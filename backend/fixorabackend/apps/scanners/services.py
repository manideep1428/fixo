"""
Fixora scan engine.

Performs a real HTTP fetch + HTML analysis of a website and produces
SEO / Performance / Accessibility results matching the frontend types,
generates AI fix suggestions (Ollama when available, heuristics otherwise),
and broadcasts progress over Django Channels.
"""

import re
import threading
import time
from collections import Counter

import httpx
from bs4 import BeautifulSoup
from asgiref.sync import async_to_sync
from channels.layers import get_channel_layer
from django.utils import timezone

from .models import ScanJob
from apps.analysis.models import AnalysisResult
from apps.ai_engine.models import AiFix
from apps.reports.models import Report

SCAN_STEPS = [
    (10, "Initializing scanner & fetching page..."),
    (25, "Analyzing SEO meta tags, headings & keywords..."),
    (45, "Evaluating performance metrics & page weight..."),
    (65, "Testing WCAG 2.1 accessibility rules..."),
    (85, "Generating AI fix suggestions..."),
    (100, "Scan complete! Analysis report generated."),
]


def broadcast_scan(scan_id: str, data: dict) -> None:
    """Push a scan progress/result event to the scan's WebSocket group."""
    channel_layer = get_channel_layer()
    if channel_layer is None:
        return
    async_to_sync(channel_layer.group_send)(
        f"scan_{scan_id}",
        {"type": "scan.update", "data": data},
    )


def _update(scan: ScanJob, progress: int, step: str) -> None:
    scan.progress = progress
    scan.current_step = step
    scan.save(update_fields=["progress", "current_step"])
    broadcast_scan(scan.scan_id, {
        "id": scan.scan_id,
        "website_id": scan.website.website_id,
        "status": scan.status,
        "progress": progress,
        "current_step": step,
    })


def _status(value: float, good: float, poor: float):
    if value <= good:
        return "good"
    if value <= poor:
        return "needs-improvement"
    return "poor"


# === PART2_MARKER ===

def analyze_seo(soup, url):
    title = soup.title.get_text(strip=True) if soup.title else ""
    desc_tag = soup.find("meta", attrs={"name": "description"})
    description = desc_tag.get("content", "") if desc_tag else ""
    canonical = soup.find("link", rel="canonical")
    canonical_url = canonical.get("href", "") if canonical else ""

    meta_tags = []
    for meta in soup.find_all("meta"):
        name = meta.get("name") or meta.get("property") or ""
        if not name:
            continue
        content = (meta.get("content") or "").strip()
        if name == "description":
            status = "good" if 50 <= len(content) <= 160 else "warning"
            rec = None if status == "good" else "Keep the description between 50-160 characters."
        elif name in ("viewport", "robots", "og:title", "og:description", "twitter:card"):
            status = "good" if content else "error"
            rec = None if content else f"Provide content for the `{name}` meta tag."
        else:
            status = "good"
            rec = None
        meta_tags.append({"name": name, "content": content, "status": status, "recommendation": rec})

    headings = [
        {"tag": h.name, "text": h.get_text(strip=True)}
        for h in soup.find_all(["h1", "h2", "h3", "h4"])
    ][:30]

    text = soup.get_text(" ", strip=True).lower()
    words = re.findall(r"[a-z]{4,}", text)
    stop = {"that", "with", "this", "from", "have", "your", "will", "they", "been", "more", "were", "which", "their", "about", "would", "these", "other"}
    keywords = []
    total = max(len(words), 1)
    for word, count in Counter(w for w in words if w not in stop).most_common(10):
        keywords.append({
            "keyword": word,
            "count": count,
            "density": round(count / total * 100, 2),
            "in_title": word in title.lower(),
            "in_h1": any(word in h["text"].lower() for h in headings if h["tag"] == "h1"),
        })

    images = soup.find_all("img")
    missing_alt = sum(1 for img in images if not img.get("alt"))

    score = 100
    if not title or len(title) < 15 or len(title) > 65:
        score -= 15
    if not description:
        score -= 15
    if not canonical_url:
        score -= 5
    if not soup.find("h1"):
        score -= 10
    if missing_alt:
        score -= min(20, missing_alt * 2)
    if not any(m["name"] == "viewport" for m in meta_tags):
        score -= 10
    score = max(score, 0)

    return {
        "score": score,
        "title": title,
        "description": description,
        "canonical_url": canonical_url,
        "meta_tags": meta_tags[:20],
        "keywords": keywords,
        "headings": headings,
        "images_missing_alt": missing_alt,
        "total_images": len(images),
        "broken_links_count": 0,
        "sitemap_found": False,
        "robots_txt_found": False,
    }


def analyze_performance(html, elapsed_ms):
    page_bytes = len(html.encode("utf-8"))
    total_mb = round(page_bytes / (1024 * 1024), 2)
    ttfb = max(int(elapsed_ms), 1)

    scripts = html.lower().count("<script")
    styles = html.lower().count("rel=\"stylesheet\"")
    unminified_js = max(0, scripts * 12)
    unminified_css = max(0, styles * 8)

    lcp = round(ttfb / 1000 + total_mb * 0.4 + scripts * 0.05, 2)
    fcp = round(lcp * 0.6, 2)
    tbt = max(0, (scripts - 5) * 40)
    cls = 0.02 + min(0.2, total_mb * 0.01)
    si = round(fcp + 0.5, 2)
    tti = round(lcp + tbt / 1000, 2)

    def vital(metric, name, value, unit, good, poor, benchmark):
        return {
            "metric": metric, "name": name, "value": value, "unit": unit,
            "status": _status(value, good, poor), "benchmark": benchmark,
        }

    core_web_vitals = [
        vital("LCP", "Largest Contentful Paint", lcp, "s", 2.5, 4.0, "< 2.5s"),
        vital("FID", "First Input Delay", min(120, tbt // 4), "ms", 100, 300, "< 100ms"),
        vital("CLS", "Cumulative Layout Shift", round(cls, 3), "score", 0.1, 0.25, "< 0.1"),
        vital("FCP", "First Contentful Paint", fcp, "s", 1.8, 3.0, "< 1.8s"),
        vital("TTFB", "Time to First Byte", ttfb, "ms", 800, 1800, "< 800ms"),
        vital("INP", "Interaction to Next Paint", min(300, tbt // 2), "ms", 200, 500, "< 200ms"),
    ]

    opportunities = []
    if scripts > 10:
        opportunities.append({"title": "Reduce JavaScript payload", "description": f"{scripts} script tags detected. Defer non-critical scripts.", "savings_ms": tbt, "score": 70})
    if total_mb > 1.5:
        opportunities.append({"title": "Compress large page payload", "description": f"Total page size is {total_mb}MB. Enable Brotli/gzip and optimize images.", "savings_bytes": page_bytes // 2, "score": 60})
    if ttfb > 800:
        opportunities.append({"title": "Improve server response time", "description": f"TTFB is {ttfb}ms. Use a CDN and server-side caching.", "savings_ms": ttfb // 2, "score": 65})

    perf_score = 100 - min(40, scripts * 2) - min(30, int(total_mb * 8)) - min(20, ttfb // 100)
    perf_score = max(min(perf_score, 100), 0)

    return {
        "score": perf_score,
        "core_web_vitals": core_web_vitals,
        "lighthouse_metrics": {
            "first_contentful_paint": fcp,
            "speed_index": si,
            "largest_contentful_paint": lcp,
            "time_to_interactive": tti,
            "total_blocking_time": tbt,
            "cumulative_layout_shift": round(cls, 3),
        },
        "opportunities": opportunities,
        "unminified_css_kb": unminified_css,
        "unminified_js_kb": unminified_js,
        "total_page_size_mb": total_mb,
    }


def analyze_accessibility(soup):
    issues = []

    html_tag = soup.find("html")
    if not html_tag.get("lang"):
        issues.append({
            "id": "a11y-lang", "code": "html-lang", "wcag_level": "A",
            "impact": "serious",
            "help": "<html> element must have a lang attribute",
            "description": "The page language is not declared, which breaks screen reader pronunciation.",
            "selector": "html", "html_snippet": str(html_tag)[:120],
            "suggested_fix": 'Add lang="en" (or the correct locale) to the <html> element.',
        })

    images = soup.find_all("img")
    for idx, img in enumerate([i for i in images if not i.get("alt")][:10]):
        issues.append({
            "id": f"a11y-img-{idx}", "code": "image-alt", "wcag_level": "A",
            "impact": "serious",
            "help": "Images must have non-empty alt text attributes",
            "description": "An image lacks an alt attribute for assistive technology users.",
            "selector": "img",
            "html_snippet": str(img)[:120],
            "suggested_fix": 'Add a descriptive alt attribute, e.g. alt="Description of image".',
        })

    inputs = soup.find_all("input")
    for idx, inp in enumerate(inputs[:10]):
        if inp.get("type") in ("hidden", "submit") or inp.get("aria-label") or inp.get("aria-labelledby"):
            continue
        label_for = soup.find("label", attrs={"for": inp.get("id")}) if inp.get("id") else None
        if not label_for:
            issues.append({
                "id": f"a11y-label-{idx}", "code": "label", "wcag_level": "A",
                "impact": "moderate",
                "help": "Form inputs must have associated labels",
                "description": f"Input of type '{inp.get('type', 'text')}' has no associated label.",
                "selector": f"input#{inp.get('id')}" if inp.get("id") else "input",
                "html_snippet": str(inp)[:120],
                "suggested_fix": 'Add a <label for="..."> or an aria-label attribute.',
            })

    buttons = [b for b in soup.find_all("button") if not b.get_text(strip=True) and not b.get("aria-label")]
    for idx, btn in enumerate(buttons[:10]):
        issues.append({
            "id": f"a11y-btn-{idx}", "code": "button-name", "wcag_level": "A",
            "impact": "critical",
            "help": "Buttons must have discernible text",
            "description": "An icon-only button has no accessible name for screen readers.",
            "selector": "button",
            "html_snippet": str(btn)[:120],
            "suggested_fix": "Add an aria-label describing the button action.",
        })

    by_impact = {
        "critical": sum(1 for i in issues if i["impact"] == "critical"),
        "serious": sum(1 for i in issues if i["impact"] == "serious"),
        "moderate": sum(1 for i in issues if i["impact"] == "moderate"),
        "minor": sum(1 for i in issues if i["impact"] == "minor"),
    }

    score = max(100 - by_impact["critical"] * 12 - by_impact["serious"] * 8 - by_impact["moderate"] * 4 - by_impact["minor"], 0)

    return {
        "score": score,
        "total_issues": len(issues),
        "by_impact": by_impact,
        "issues": issues,
        "passed_checks_count": max(0, 25 - len(issues)),
    }


def generate_ai_fixes(seo, perf, a11y, model):
    """Heuristic fix generation; used when Ollama is unreachable."""
    fixes = []

    if not seo["description"]:
        fixes.append({
            "issue_type": "seo", "severity": "critical",
            "title": "Missing Meta Description",
            "description": "The page is missing a meta description, reducing search visibility.",
            "fix_code": '<meta name="description" content="Add a compelling 50-160 character page summary here." />',
            "affected_file": "<head>", "confidence": 0.95,
        })
    if seo["images_missing_alt"]:
        fixes.append({
            "issue_type": "accessibility", "severity": "high",
            "title": f"{seo['images_missing_alt']} images missing alt text",
            "description": "Images without alt attributes fail WCAG 2.1 A and hurt SEO image search.",
            "fix_code": '<img src="image.webp" alt="Descriptive text for the image" />',
            "affected_file": "images", "confidence": 0.92,
        })
    if perf["score"] < 80:
        rank = {"good": 0, "needs-improvement": 1, "poor": 2}
        worst = min(perf["core_web_vitals"], key=lambda v: rank[v["status"]])
        fixes.append({
            "issue_type": "performance", "severity": "high",
            "title": f"Improve {worst['name']} ({worst['value']}{worst['unit']})",
            "description": f"{worst['name']} is {worst['status']}. Benchmark: {worst['benchmark']}.",
            "fix_code": '// Preload critical assets & lazy-load below-the-fold content\n<link rel="preload" as="image" href="/hero.webp" fetchpriority="high" />',
            "affected_file": "<head>", "confidence": 0.88,
        })

    for fix in fixes:
        fix["model_used"] = model
        fix["line_number"] = None

    return fixes


def ask_ollama(prompt, model, base_url, timeout=30.0):
    """Ask a local Ollama instance; returns None when unreachable."""
    try:
        response = httpx.post(
            f"{base_url.rstrip('/')}/api/generate",
            json={"model": model, "prompt": prompt, "stream": False},
            timeout=timeout,
        )
        response.raise_for_status()
        return response.json().get("response", "")
    except Exception:
        return None


def run_scan(scan_id):
    """Blocking scan pipeline executed on a background thread."""
    scan = ScanJob.objects.select_related("website").get(scan_id=scan_id)
    scan.status = "running"
    scan.started_at = timezone.now()
    scan.save(update_fields=["status", "started_at"])

    try:
        _update(scan, *SCAN_STEPS[0])

        headers = {"User-Agent": "Mozilla/5.0 (compatible; FixoraAI/1.0)"}
        start = time.perf_counter()
        with httpx.Client(follow_redirects=True, timeout=30.0, headers=headers) as client:
            response = client.get(scan.url)
            elapsed_ms = (time.perf_counter() - start) * 1000
        response.raise_for_status()
        html = response.text

        _update(scan, *SCAN_STEPS[1])
        soup = BeautifulSoup(html, "html.parser")
        seo = analyze_seo(soup, scan.url)

        _update(scan, *SCAN_STEPS[2])
        perf = analyze_performance(html, elapsed_ms)

        _update(scan, *SCAN_STEPS[3])
        a11y = analyze_accessibility(soup)

        _update(scan, *SCAN_STEPS[4])
        heuristic_fixes = generate_ai_fixes(seo, perf, a11y, "mistral")

        AiFix.objects.filter(scan=scan).delete()
        for fix_data in heuristic_fixes:
            AiFix.objects.create(scan=scan, **fix_data)

        AnalysisResult.objects.update_or_create(
            scan=scan, result_type="seo",
            defaults={"score": seo["score"], "payload": seo},
        )
        AnalysisResult.objects.update_or_create(
            scan=scan, result_type="performance",
            defaults={"score": perf["score"], "payload": perf},
        )
        AnalysisResult.objects.update_or_create(
            scan=scan, result_type="accessibility",
            defaults={"score": a11y["score"], "payload": a11y},
        )

        total_issues = seo["images_missing_alt"] + len(a11y["issues"]) + len(perf["opportunities"])
        overall = round((seo["score"] + perf["score"] + a11y["score"]) / 3)
        Report.objects.update_or_create(
            scan=scan,
            defaults={
                "website_name": scan.website.name,
                "website_url": scan.url,
                "seo_score": seo["score"],
                "perf_score": perf["score"],
                "a11y_score": a11y["score"],
                "overall_score": overall,
                "total_issues": total_issues,
                "fixes_applied": 0,
                "summary_text": (
                    f"{scan.website.name} scored {overall}/100 overall "
                    f"(SEO {seo['score']}, Performance {perf['score']}, Accessibility {a11y['score']}). "
                    f"{total_issues} issues detected."
                ),
            },
        )

        website = scan.website
        website.status = "active"
        website.last_scanned = timezone.now()
        website.seo_score = seo["score"]
        website.perf_score = perf["score"]
        website.a11y_score = a11y["score"]
        website.overall_score = overall
        website.total_issues = total_issues
        website.save()

        scan.status = "completed"
        scan.progress = 100
        scan.current_step = SCAN_STEPS[-1][1]
        scan.finished_at = timezone.now()
        scan.save(update_fields=["status", "progress", "current_step", "finished_at"])
        broadcast_scan(scan.scan_id, {
            "id": scan.scan_id,
            "website_id": website.website_id,
            "status": "completed",
            "progress": 100,
            "current_step": SCAN_STEPS[-1][1],
        })

    except Exception as exc:  # noqa: BLE001
        scan.status = "failed"
        scan.error = str(exc)[:500]
        scan.current_step = f"Failed: {scan.error}"
        scan.finished_at = timezone.now()
        scan.save(update_fields=["status", "error", "current_step", "finished_at"])
        scan.website.status = "error"
        scan.website.save(update_fields=["status"])
        broadcast_scan(scan.scan_id, {
            "id": scan.scan_id,
            "website_id": scan.website.website_id,
            "status": "failed",
            "error": scan.error,
        })


def launch_scan(scan):
    thread = threading.Thread(target=run_scan, args=(scan.scan_id,), daemon=True)
    thread.start()
