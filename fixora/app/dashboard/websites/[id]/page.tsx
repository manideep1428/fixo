"use client"

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useWebsiteStore } from '@/store/websiteStore'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { AiFixCard } from '@/components/ai/AiFixCard'
import { useAiStore } from '@/store/aiStore'
import { Globe, ArrowSquareOut, Lightning, Sparkle, ShieldCheck, Gauge, Wheelchair } from '@phosphor-icons/react'

export default function WebsiteDetailPage() {
  const params = useParams()
  const siteId = params.id as string
  const { websites, rescanWebsite } = useWebsiteStore()
  const { fixes } = useAiStore()

  const [activeTab, setActiveTab] = useState<'overview' | 'seo' | 'perf' | 'a11y' | 'fixes'>('overview')

  const site = websites.find((w) => w.id === siteId) || websites[0]

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
                  <BreadcrumbLink href="/dashboard/websites">Websites</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{site?.name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={() => site && rescanWebsite(site.id)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            <Lightning className="w-4 h-4 text-primary-foreground" />
            {site?.status === 'scanning' ? 'Scanning...' : 'Rescan Website'}
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          {/* Header info */}
          <div className="p-6 rounded-2xl bg-card shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-muted text-foreground">
                <Globe className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-extrabold text-foreground">{site?.name}</h1>
                <a
                  href={site?.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs font-mono text-muted-foreground hover:underline inline-flex items-center gap-1 mt-0.5"
                >
                  {site?.url} <ArrowSquareOut className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right font-mono text-xs text-muted-foreground">
                <div>Owner: <strong className="text-foreground">{site?.owner}</strong></div>
                <div>Last Scanned: <strong className="text-foreground">{site?.last_scanned}</strong></div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-border/40 pb-2">
            {[
              { id: 'overview', label: 'Overview', icon: Globe },
              { id: 'seo', label: 'SEO Audit', icon: ShieldCheck },
              { id: 'perf', label: 'Performance', icon: Gauge },
              { id: 'a11y', label: 'Accessibility', icon: Wheelchair },
              { id: 'fixes', label: 'AI Code Fixes', icon: Sparkle },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ScoreGauge label="SEO Score" score={site?.seo_score || 80} color="success" />
                <ScoreGauge label="Performance Score" score={site?.perf_score || 70} color="warning" />
                <ScoreGauge label="Accessibility Score" score={site?.a11y_score || 85} color="success" />
              </div>

              <div className="space-y-3">
                <h3 className="text-base font-bold text-foreground">Recommended Fixes for {site?.name}</h3>
                {fixes.map((fix) => (
                  <AiFixCard key={fix.id} fix={fix} />
                ))}
              </div>
            </div>
          )}

          {activeTab !== 'overview' && (
            <div className="p-8 rounded-2xl bg-card shadow-sm text-center space-y-3">
              <h3 className="text-lg font-bold text-foreground capitalize">{activeTab} Details</h3>
              <p className="text-xs text-muted-foreground max-w-md mx-auto">
                Detailed telemetry for {activeTab.toUpperCase()} analysis. You can also view dedicated dashboards in the sidebar.
              </p>
              <div className="pt-2">
                {fixes.slice(0, 2).map((fix) => (
                  <AiFixCard key={fix.id} fix={fix} />
                ))}
              </div>
            </div>
          )}
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
