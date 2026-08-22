"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useScanStore } from '@/store/scanStore'
import { useWebsiteStore } from '@/store/websiteStore'
import { ScanProgress } from '@/components/scanners/ScanProgress'
import { Lightning, Play, Clock, CheckCircle } from '@phosphor-icons/react'

export default function ScannersPage() {
  const { scans, startScan } = useScanStore()
  const { websites } = useWebsiteStore()

  const handleLaunchScan = () => {
    if (websites.length > 0) {
      const site = websites[0]
      startScan(site.id, site.name, site.url)
    }
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
                  <BreadcrumbPage>Scanners Queue</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={handleLaunchScan}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95"
          >
            <Play className="w-4 h-4" /> Trigger New Scan
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Playwright + Ollama Scanner Queue</h1>
            <p className="text-xs text-muted-foreground">
              Monitor active, pending, and completed site scanning jobs. Free unlimited local execution.
            </p>
          </div>

          {/* Scans List */}
          <div className="space-y-4">
            {scans.map((scan) => (
              <ScanProgress key={scan.id} scan={scan} />
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
