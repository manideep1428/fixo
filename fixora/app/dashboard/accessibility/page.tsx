"use client"

import React, { useState } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard } from '@/components/dashboard/MetricCard'
import { ScoreGauge } from '@/components/dashboard/ScoreGauge'
import { INITIAL_A11Y_ISSUES } from '@/services/mockDataService'
import { Wheelchair, ShieldWarning, Sparkle, CheckCircle } from '@phosphor-icons/react'

export default function AccessibilityPage() {
  const [filterLevel, setFilterLevel] = useState<string>('all')

  const filteredIssues = INITIAL_A11Y_ISSUES.filter(
    (i) => filterLevel === 'all' || i.wcag_level === filterLevel
  )

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
                  <BreadcrumbPage>Accessibility (WCAG 2.1)</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">WCAG 2.1 Accessibility Audit</h1>
            <p className="text-xs text-muted-foreground">
              Automated testing for screen reader labels, keyboard navigation focus, and color contrast compliance (Level A, AA, AAA).
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="WCAG Compliance" value="96/100" icon="seo" trend="+2%" description="Passed 48/51 checks" />
            <MetricCard title="Critical Issues" value="1" icon="scan" description="Color contrast ratio failure" />
            <MetricCard title="Passed Audit Rules" value="48" icon="check" description="No keyboard trap detected" />
            <MetricCard title="Aria Attributes" value="Clean" icon="globe" description="All interactive elements labeled" />
          </div>

          {/* Issue Filter & List */}
          <div className="p-5 rounded-2xl bg-card shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Wheelchair className="w-5 h-5 text-foreground" />
                <h3 className="text-base font-bold text-foreground">Detected Accessibility Violations</h3>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="text-muted-foreground font-semibold">WCAG Level:</span>
                {['all', 'A', 'AA', 'AAA'].map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => setFilterLevel(lvl)}
                    className={`px-3 py-1 rounded-lg font-bold font-mono transition-all ${
                      filterLevel === lvl
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {lvl.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-4">
              {filteredIssues.map((issue) => (
                <div key={issue.id} className="p-4 rounded-xl bg-card shadow-sm space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          WCAG {issue.wcag_level}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
                          {issue.impact}
                        </span>
                        <span className="text-xs font-mono font-bold text-muted-foreground">{issue.code}</span>
                      </div>
                      <h4 className="text-sm font-bold text-foreground mt-1">{issue.help}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{issue.description}</p>
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-muted text-foreground font-mono text-xs space-y-1">
                    <span className="text-muted-foreground text-[10px]">CSS Selector: {issue.selector}</span>
                    <pre className="text-foreground font-mono overflow-x-auto"><code>{issue.html_snippet}</code></pre>
                  </div>

                  <div className="p-3 rounded-lg bg-muted/60 text-xs text-foreground font-sans space-y-1">
                    <strong className="flex items-center gap-1">
                      <Sparkle className="w-3.5 h-3.5 text-foreground" /> Suggested Fix:
                    </strong>
                    <p>{issue.suggested_fix}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
