"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { CWVMetricsCard } from '@/components/performance/CWVMetricsCard'
import { CORE_WEB_VITALS_DATA } from '@/services/mockDataService'
import { Gauge, Lightning, Timer, ArrowDown } from '@phosphor-icons/react'

export default function PerformancePage() {
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
                  <BreadcrumbPage>Performance & CWV</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Core Web Vitals & Lighthouse Diagnostics</h1>
            <p className="text-xs text-muted-foreground">
              Monitor real user speed metrics: Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS), and Interaction to Next Paint (INP).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Lighthouse Perf Score" value="88/100" icon="scan" trend="+6%" description="Speed Index: 1.1s" />
            <MetricCard title="Total Page Weight" value="1.2 MB" icon="globe" description="Uncompressed CSS/JS minified" />
            <MetricCard title="Time to Interactive" value="1.4 s" icon="check" description="Main thread execution speed" />
            <MetricCard title="Payload Savings" value="840 KB" icon="fix" description="Achieved via Next.js WebP" />
          </div>

          {/* Core Web Vitals Grid */}
          <div className="space-y-3">
            <h3 className="text-base font-bold text-foreground">Google Core Web Vitals Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
              {CORE_WEB_VITALS_DATA.map((vital) => (
                <CWVMetricsCard key={vital.metric} vital={vital} />
              ))}
            </div>
          </div>

          {/* Performance Diagnostics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 p-5 rounded-2xl bg-card shadow-sm space-y-4">
              <h3 className="text-base font-bold text-foreground">Lighthouse Speed Diagnostics</h3>
              <div className="space-y-3">
                <div className="p-3.5 rounded-xl bg-muted flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">Eliminate Render-Blocking Resources</span>
                    <p className="text-muted-foreground mt-0.5">2 external CSS stylesheets delaying first frame render by ~310ms.</p>
                  </div>
                  <span className="font-mono text-muted-foreground font-bold shrink-0">Save 310ms</span>
                </div>

                <div className="p-3.5 rounded-xl bg-muted flex items-start justify-between text-xs">
                  <div>
                    <span className="font-bold text-foreground">Properly Size & Preload Images</span>
                    <p className="text-muted-foreground mt-0.5">Hero image converted to Next.js WebP format with priority preloading.</p>
                  </div>
                  <span className="font-mono text-foreground font-bold shrink-0">Passed ✓</span>
                </div>
              </div>
            </div>

            <div>
              <ScoreGauge label="Overall Speed Score" score={88} color="success" subtext="Desktop Viewport" />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
