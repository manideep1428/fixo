"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MOCK_REPORTS } from '@/services/mockDataService'
import { FileText, Download, Printer, Share, CheckCircle } from '@phosphor-icons/react'
import Link from 'next/link'

export default function ReportsPage() {
  const handlePrint = () => {
    window.print()
  }

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
                  <BreadcrumbPage>PDF Reports</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-muted text-foreground hover:bg-muted/80 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Print / Export PDF
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Executive Analysis Reports</h1>
            <p className="text-xs text-muted-foreground">
              Generate and download exportable client-ready PDF summaries combining SEO, Performance, and WCAG accessibility scores.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {MOCK_REPORTS.map((rep) => (
              <div key={rep.id} className="p-6 rounded-2xl bg-card shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-muted text-foreground">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground">{rep.website_name}</h3>
                        <p className="text-xs font-mono text-muted-foreground">{rep.website_url}</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {new Date(rep.created_at).toLocaleDateString()}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground leading-relaxed bg-muted p-3 rounded-xl">
                    {rep.summary_text}
                  </p>

                  <div className="grid grid-cols-4 gap-2 text-center text-xs font-mono pt-1">
                    <div className="p-2 rounded-lg bg-muted">
                      <span className="text-[9px] text-muted-foreground block">SEO</span>
                      <strong className="text-foreground font-bold">{rep.seo_score}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <span className="text-[9px] text-muted-foreground block">PERF</span>
                      <strong className="text-foreground font-bold">{rep.perf_score}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <span className="text-[9px] text-muted-foreground block">A11Y</span>
                      <strong className="text-foreground font-bold">{rep.a11y_score}</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-muted">
                      <span className="text-[9px] text-muted-foreground block">OVERALL</span>
                      <strong className="text-foreground font-bold">{rep.overall_score}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                  <span className="text-[11px] text-muted-foreground font-semibold flex items-center gap-1">
                    <CheckCircle className="w-3.5 h-3.5 text-foreground" /> {rep.fixes_applied} AI Fixes Included
                  </span>

                  <div className="flex items-center gap-2">
                    <Link
                      href={`/dashboard/reports/${rep.id}`}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      View Report
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
