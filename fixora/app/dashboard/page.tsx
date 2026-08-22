"use client"

import React from 'react'
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { MetricCard } from '@/components/dashboard/MetricCard'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { ActivityFeed } from '@/components/dashboard/ActivityFeed'
import { AiFixCard } from '@/components/ai/AiFixCard'
import { AddWebsiteModal } from '@/components/websites/AddWebsiteModal'

import { useWebsiteStore } from '@/store/websiteStore'
import { useAiStore } from '@/store/aiStore'
import { useUiStore } from '@/store/uiStore'
import { Plus, Globe, ArrowRight, Cpu, Sparkle } from '@phosphor-icons/react'
import Link from 'next/link'

export default function DashboardPage() {
  const { user } = useAuth({ ensureSignedIn: true })
  const { websites, rescanWebsite, fetchWebsites } = useWebsiteStore()
  const { fixes } = useAiStore()
  const { setAddWebsiteModalOpen } = useUiStore()

  // Bootstrap: pull the user's real websites from the backend on load
  React.useEffect(() => {
    fetchWebsites()
  }, [fetchWebsites])

  // Calculate overall metrics
  const avgSeo = Math.round(websites.reduce((acc, w) => acc + (w.seo_score || 80), 0) / (websites.length || 1))
  const avgPerf = Math.round(websites.reduce((acc, w) => acc + (w.perf_score || 70), 0) / (websites.length || 1))
  const avgA11y = Math.round(websites.reduce((acc, w) => acc + (w.a11y_score || 85), 0) / (websites.length || 1))

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 data-vertical:h-4 data-vertical:self-auto" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="/dashboard">Fixora AI</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Overview</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={() => setAddWebsiteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" /> Add Website
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Welcome Banner */}
          <div className="relative overflow-hidden rounded-2xl bg-card p-6 text-card-foreground shadow-sm">
            <div className="relative z-10 space-y-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground text-[11px] font-mono font-semibold">
                <Cpu className="w-3.5 h-3.5 text-foreground" /> Free Local AI Engine Active (Ollama Mistral 7B & Llama 3.1 8B)
              </div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">
                Welcome back, {user?.firstName || user?.email?.split('@')[0] || 'Developer'}!
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Fixora AI is monitoring {websites.length} websites. You have saved <strong>$142.50</strong> in API fees this month by utilizing local Ollama models.
              </p>
            </div>
          </div>

          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Monitored Websites" value={websites.length} icon="globe" description="Active URLs tracked" />
            <MetricCard title="Scans Today" value={34} icon="scan" trend="+12%" description="Local Playwright + Ollama scans" />
            <MetricCard title="AI Fixes Applied" value={127} icon="fix" trend="+8%" description="One-click code patches" />
            <MetricCard title="Avg SEO Score" value={`${avgSeo}/100`} icon="seo" description="Search engine optimization" />
          </div>

          {/* Score Gauges */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ScoreGauge label="Overall SEO Health" score={avgSeo} color={avgSeo >= 85 ? 'success' : 'warning'} subtext="Canonical & Meta Audit" />
            <ScoreGauge label="Lighthouse Performance" score={avgPerf} color={avgPerf >= 85 ? 'success' : 'warning'} subtext="Core Web Vitals Metric" />
            <ScoreGauge label="WCAG 2.1 Accessibility" score={avgA11y} color={avgA11y >= 90 ? 'success' : 'warning'} subtext="Screen Reader Compliance" />
          </div>

          {/* Main Content Grid: Recent Sites & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left 2 Cols: Monitored Websites Table */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-foreground">Monitored Websites</h3>
                <Link href="/dashboard/websites" className="text-xs font-semibold text-primary hover:underline flex items-center gap-1">
                  View All Websites <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              <div className="rounded-2xl bg-card shadow-sm overflow-hidden">
                <div className="divide-y divide-border/40">
                  {websites.slice(0, 3).map((site) => (
                    <div key={site.id} className="p-4 flex items-center justify-between hover:bg-muted/40 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-muted text-foreground">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div>
                          <Link href={`/dashboard/websites/${site.id}`} className="text-sm font-bold text-foreground hover:underline">
                            {site.name}
                          </Link>
                          <p className="text-xs font-mono text-muted-foreground">{site.url}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="hidden sm:flex items-center gap-2 text-xs font-mono">
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">
                            SEO {site.seo_score}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">
                            PERF {site.perf_score}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-muted text-muted-foreground font-bold">
                            A11Y {site.a11y_score}
                          </span>
                        </div>

                        <button
                          onClick={() => rescanWebsite(site.id)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 transition-colors"
                        >
                          {site.status === 'scanning' ? 'Scanning...' : 'Rescan'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommended AI Fixes */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
                    <Sparkle className="w-5 h-5 text-primary" /> Pending AI Fix Recommendations
                  </h3>
                  <Link href="/dashboard/fixes" className="text-xs font-semibold text-primary hover:underline">
                    View AI Fix Center ({fixes.filter((f) => !f.applied).length})
                  </Link>
                </div>
                {fixes.slice(0, 2).map((fix) => (
                  <AiFixCard key={fix.id} fix={fix} />
                ))}
              </div>
            </div>

            {/* Right 1 Col: Live Activity Feed */}
            <div>
              <ActivityFeed />
            </div>
          </div>
        </div>

        <AddWebsiteModal />
      </SidebarInset>
    </SidebarProvider>
  )
}
