"use client"

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MOCK_REPORTS } from '@/services/mockDataService'
import { reportsApi } from '@/services/backendService'
import type { ReportSummary } from '@/types/report'
import { Printer, Download, Sparkle } from '@phosphor-icons/react'

export default function ReportDetailPage() {
  const params = useParams()
  const reportId = params.id as string
  const [report, setReport] = useState<ReportSummary>(
    () => MOCK_REPORTS.find((r) => r.id === reportId) || MOCK_REPORTS[0]
  )

  useEffect(() => {
    // Try the real backend report first; fall back to mock data
    reportsApi
      .list()
      .then((data) => {
        const found = data.find((r) => r.id === reportId)
        if (found) setReport(found)
      })
      .catch(() => undefined)
  }, [reportId])

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
                  <BreadcrumbLink href="/dashboard/reports">Reports</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{report?.website_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4" /> Export / Print PDF
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-8 max-w-4xl mx-auto w-full">
          {/* Executive Document */}
          <div className="p-8 rounded-2xl bg-card shadow-lg space-y-6">
            <div className="flex justify-between items-start border-b border-border/40 pb-6">
              <div>
                <span className="text-2xl font-black text-foreground tracking-tight">FIXORA AI</span>
                <p className="text-xs text-muted-foreground font-mono mt-0.5">Automated Website Audit & Fix Report</p>
              </div>

              <div className="text-right text-xs font-mono text-muted-foreground">
                <div>Report ID: {report?.id}</div>
                <div>Date: {new Date(report?.created_at || '').toLocaleDateString()}</div>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-bold text-foreground">{report?.website_name}</h1>
              <p className="text-xs font-mono text-muted-foreground">{report?.website_url}</p>
            </div>

            <div className="p-4 rounded-xl bg-muted text-xs text-foreground leading-relaxed">
              <strong>Executive Summary:</strong> {report?.summary_text}
            </div>

            <div className="grid grid-cols-4 gap-4 text-center font-mono">
              <div className="p-4 rounded-xl bg-muted">
                <span className="text-xs text-muted-foreground block font-sans">SEO</span>
                <strong className="text-2xl text-foreground font-extrabold">{report?.seo_score}</strong>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <span className="text-xs text-muted-foreground block font-sans">Performance</span>
                <strong className="text-2xl text-foreground font-extrabold">{report?.perf_score}</strong>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <span className="text-xs text-muted-foreground block font-sans">Accessibility</span>
                <strong className="text-2xl text-foreground font-extrabold">{report?.a11y_score}</strong>
              </div>
              <div className="p-4 rounded-xl bg-muted">
                <span className="text-xs text-muted-foreground block font-sans">Overall Health</span>
                <strong className="text-2xl text-foreground font-extrabold">{report?.overall_score}</strong>
              </div>
            </div>

            <div className="border-t border-border/40 pt-4 text-center text-xs text-muted-foreground font-mono">
              © 2025 Fixora AI. Generated using local Ollama (Mistral 7B & Llama 3.1 8B).
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
