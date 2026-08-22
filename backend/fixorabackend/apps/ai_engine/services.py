"""AI helpers: Ollama proxying and offline fallback replies."""


def build_chat_reply(prompt: str) -> str:
    lowered = prompt.lower()
    if "seo" in lowered:
        return (
            "[Fixora AI - MISTRAL]\n\n"
            "SEO recommendations:\n"
            "1. Add a unique <title> (50-60 chars) and meta description (50-160 chars).\n"
            "2. Use a single descriptive <h1> per page.\n"
            "3. Add alt text to every informative image.\n"
            "4. Submit an XML sitemap and verify robots.txt."
        )
    if "performance" in lowered or "speed" in lowered or "lcp" in lowered:
        return (
            "[Fixora AI - MISTRAL]\n\n"
            "Performance recommendations:\n"
            "1. Preload the LCP image with fetchpriority=high.\n"
            "2. Convert hero images to WebP/AVIF.\n"
            "3. Defer non-critical JavaScript and inline critical CSS.\n"
            "4. Serve static assets via a CDN with Brotli compression."
        )
    if "accessib" in lowered or "wcag" in lowered or "a11y" in lowered:
        return (
            "[Fixora AI - MISTRAL]\n\n"
            "Accessibility recommendations:\n"
            "1. Ensure 4.5:1 contrast for body text (WCAG AA).\n"
            "2. Give every form control a visible label.\n"
            "3. Add aria-labels to icon-only buttons.\n"
            "4. Declare the page language on <html lang>."
        )
    return (
        "[Fixora AI - MISTRAL]\n\n"
        f"Analysis for: \"{prompt}\"\n\n"
        "Ollama is currently unreachable, so this is Fixora's built-in guidance: "
        "run a full website scan to get scored SEO, performance and accessibility "
        "results plus AI-generated code patches tailored to each detected issue."
    )
