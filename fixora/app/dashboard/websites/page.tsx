"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useWebsiteStore } from '@/store/websiteStore'
import { useUiStore } from '@/store/uiStore'
import { AddWebsiteModal } from '@/components/websites/AddWebsiteModal'
import { Plus, Globe, MagnifyingGlass, Trash, Lightning, ArrowSquareOut } from '@phosphor-icons/react'
import Link from 'next/link'

export default function WebsitesPage() {
  const { websites, searchQuery, setSearchQuery, deleteWebsite, rescanWebsite } = useWebsiteStore()
  const { setAddWebsiteModalOpen } = useUiStore()

  const filteredWebsites = websites.filter(
    (w) =>
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.url.toLowerCase().includes(searchQuery.toLowerCase())
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
                  <BreadcrumbPage>Websites</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button
            onClick={() => setAddWebsiteModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" /> Add Website
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Monitored Websites</h1>
              <p className="text-xs text-muted-foreground">
                Manage, scan, and inspect SEO, performance, and accessibility health across all your sites.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px]">
              <MagnifyingGlass className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search websites by name or URL..."
                className="w-full text-xs pl-9 pr-3.5 py-2 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Websites Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {filteredWebsites.map((site) => (
              <div key={site.id} className="p-5 rounded-2xl bg-card shadow-sm transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="p-2.5 rounded-xl bg-muted text-foreground">
                        <Globe className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-foreground leading-snug">{site.name}</h3>
                        <a
                          href={site.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs font-mono text-muted-foreground hover:underline inline-flex items-center gap-1"
                        >
                          {site.url} <ArrowSquareOut className="w-3 h-3" />
                        </a>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteWebsite(site.id)}
                      className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted"
                      title="Remove Website"
                    >
                      <Trash className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {site.tech_stack?.map((tech) => (
                      <span key={tech} className="text-[10px] font-mono px-2 py-0.5 rounded bg-muted text-muted-foreground">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-3 border-t border-border/40 space-y-3">
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-2 rounded-xl bg-muted">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">SEO</span>
                      <div className="text-base font-extrabold text-foreground font-mono">
                        {site.seo_score || '--'}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-muted">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">PERF</span>
                      <div className="text-base font-extrabold text-foreground font-mono">
                        {site.perf_score || '--'}
                      </div>
                    </div>
                    <div className="p-2 rounded-xl bg-muted">
                      <span className="text-[10px] text-muted-foreground font-semibold uppercase">A11Y</span>
                      <div className="text-base font-extrabold text-foreground font-mono">
                        {site.a11y_score || '--'}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <button
                      onClick={() => rescanWebsite(site.id)}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-muted hover:bg-muted/80 transition-colors"
                    >
                      <Lightning className="w-3.5 h-3.5 text-foreground" />
                      {site.status === 'scanning' ? 'Scanning...' : 'Trigger Scan'}
                    </button>

                    <Link
                      href={`/dashboard/websites/${site.id}`}
                      className="px-4 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
                    >
                      Inspect
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <AddWebsiteModal />
      </SidebarInset>
    </SidebarProvider>
  )
}
