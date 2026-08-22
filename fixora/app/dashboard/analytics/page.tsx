"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ChartBar, TrendUp, Cpu, Lightning } from '@phosphor-icons/react'

export default function AnalyticsPage() {
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
                  <BreadcrumbPage>Analytics & Trends</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Historical Audit Analytics</h1>
            <p className="text-xs text-muted-foreground">
              Track site performance growth, issue reduction velocity, and local AI throughput over time.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Total Scans Executed" value="1,420" icon="scan" trend="+18%" description="Past 30 days" />
            <MetricCard title="Avg Score Increase" value="+14 pt" icon="check" trend="+4%" description="Post AI fix deployment" />
            <MetricCard title="Local Token Inferences" value="4.2M" icon="sparkle" description="Mistral 7B & Llama 3.1 8B" />
            <MetricCard title="CockroachDB Queries" value="28.4k" icon="globe" description="Distributed DB cache hit 99.2%" />
          </div>

          {/* Visual Trend Charts */}
          <div className="p-6 rounded-2xl bg-card shadow-sm space-y-4">
            <h3 className="text-base font-bold text-foreground">30-Day Overall Site Health Trend</h3>
            <div className="h-64 w-full flex items-end justify-between gap-3 pt-6 px-4 bg-muted/30 rounded-xl font-mono text-xs">
              {[
                { day: 'Jan 01', score: 62 },
                { day: 'Jan 05', score: 68 },
                { day: 'Jan 10', score: 71 },
                { day: 'Jan 15', score: 75 },
                { day: 'Jan 20', score: 82 },
                { day: 'Jan 25', score: 88 },
                { day: 'Feb 01', score: 92 },
              ].map((bar) => (
                <div key={bar.day} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                    {bar.score} pts
                  </span>
                  <div
                    className="w-full max-w-[40px] bg-primary/80 hover:bg-primary rounded-t-lg transition-all shadow-sm"
                    style={{ height: `${bar.score * 2}px` }}
                  />
                  <span className="text-[10px] text-muted-foreground">{bar.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
