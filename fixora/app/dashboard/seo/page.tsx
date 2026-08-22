"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { ShieldCheck, CheckCircle, Warning, Tag, Key, FileCode } from '@phosphor-icons/react'

export default function SeoPage() {
  const metaTags = [
    { name: 'title', content: 'Fixora AI — AI Website Fixer & Optimization Platform', status: 'good' },
    { name: 'description', content: 'Scan, audit, and fix your website SEO, performance, and accessibility instantly with free local Ollama AI models.', status: 'good' },
    { name: 'og:image', content: 'https://fixora.ai/og-banner.png (1200x630)', status: 'good' },
    { name: 'canonical', content: 'https://fixora.ai', status: 'good' },
    { name: 'robots', content: 'index, follow', status: 'good' },
    { name: 'twitter:card', content: 'summary_large_image', status: 'good' },
    { name: 'keywords', content: 'Missing meta keywords tag (low priority)', status: 'warning' },
  ]

  const keywords = [
    { keyword: 'website fixer', count: 14, density: '2.4%', inTitle: true, inH1: true },
    { keyword: 'ollama ai', count: 9, density: '1.6%', inTitle: true, inH1: false },
    { keyword: 'seo audit', count: 8, density: '1.4%', inTitle: false, inH1: true },
    { keyword: 'accessibility wcag', count: 6, density: '1.0%', inTitle: false, inH1: false },
  ]

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/dashboard">Fixora AI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>SEO Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">SEO Audit & Keyword Analyzer</h1>
            <p className="text-xs text-muted-foreground">
              Evaluate meta tag health, heading hierarchy, keyword density, canonical URLs, and sitemap status.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="SEO Score" value="92/100" icon="seo" trend="+4%" description="Optimal indexability" />
            <MetricCard title="Meta Tags Checked" value="12/14" icon="check" description="Pass 92% validation" />
            <MetricCard title="Broken Links" value="0" icon="globe" description="All internal links clean" />
            <MetricCard title="Sitemap & Robots" value="Found" icon="check" description="Valid sitemap.xml detected" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              {/* Meta Tags Checker Table */}
              <div className="p-5 rounded-2xl bg-card shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-foreground" />
                  <h3 className="text-base font-bold text-foreground">Meta Tags Inspection</h3>
                </div>

                <div className="divide-y divide-border/40 rounded-xl bg-muted/20 overflow-hidden">
                  {metaTags.map((tag) => (
                    <div key={tag.name} className="p-3.5 flex items-start justify-between gap-3 text-xs">
                      <div>
                        <span className="font-bold font-mono text-foreground">{tag.name}</span>
                        <p className="text-muted-foreground font-mono text-[11px] mt-0.5">{tag.content}</p>
                      </div>
                      <span className="shrink-0 px-2 py-0.5 rounded-full font-bold uppercase text-[10px] bg-muted text-muted-foreground">
                        {tag.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Keyword Density */}
              <div className="p-5 rounded-2xl bg-card shadow-sm space-y-4">
                <div className="flex items-center gap-2">
                  <Key className="w-5 h-5 text-foreground" />
                  <h3 className="text-base font-bold text-foreground">Top Keyword Density</h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-muted/50 text-muted-foreground">
                      <tr>
                        <th className="p-2.5">Keyword Phrase</th>
                        <th className="p-2.5">Occurrences</th>
                        <th className="p-2.5">Density</th>
                        <th className="p-2.5">In Title</th>
                        <th className="p-2.5">In H1</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/40">
                      {keywords.map((k) => (
                        <tr key={k.keyword} className="hover:bg-muted/30">
                          <td className="p-2.5 font-bold text-foreground">{k.keyword}</td>
                          <td className="p-2.5">{k.count}</td>
                          <td className="p-2.5 font-bold text-foreground">{k.density}</td>
                          <td className="p-2.5">{k.inTitle ? '✅ Yes' : '❌ No'}</td>
                          <td className="p-2.5">{k.inH1 ? '✅ Yes' : '❌ No'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Score Gauge */}
            <div className="space-y-6">
              <ScoreGauge label="SEO Health Index" score={92} color="success" subtext="Googlebot Ready" />
              <div className="p-5 rounded-2xl bg-card shadow-sm space-y-3">
                <h4 className="text-sm font-bold text-foreground">Heading Structure Tree</h4>
                <div className="space-y-2 text-xs font-mono">
                  <div className="p-2 rounded bg-muted text-foreground">H1: Fixora AI Website Analysis</div>
                  <div className="p-2 rounded bg-muted/60 ml-3 text-muted-foreground">H2: Ollama AI Local Inference</div>
                  <div className="p-2 rounded bg-muted/60 ml-3 text-muted-foreground">H2: Core Web Vitals Audit</div>
                  <div className="p-2 rounded bg-muted/40 ml-6 text-muted-foreground">H3: LCP & CLS Optimization</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
