"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarRail,
} from "@/components/ui/sidebar"

import {
  LayoutDashboard,
  Globe,
  ScanLine,
  Search,
  Gauge,
  Accessibility,
  Wrench,
  FileText,
  Camera,
  BarChart2,
  CreditCard,
  Users,
  Settings,
  Sparkles,
  Sun,
  Moon,
  ChevronRight,
  ChevronDown,
  Home,
  LogIn,
  UserPlus,
} from "lucide-react"

import { NavUser } from "@/components/nav-user"
import { useTheme } from "next-themes"
import { useWebsiteStore } from "@/store/websiteStore"
import { useAiStore } from "@/store/aiStore"
import { useScanStore } from "@/store/scanStore"
import { MOCK_REPORTS } from "@/services/mockDataService"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname()
  const { resolvedTheme, setTheme } = useTheme()

  const { websites } = useWebsiteStore()
  const { fixes } = useAiStore()
  const { scans } = useScanStore()

  const pendingFixesCount = fixes.filter((f) => !f.applied).length

  // Submenu toggle states
  const [openWebsites, setOpenWebsites] = React.useState(true)
  const [openScanners, setOpenScanners] = React.useState(true)
  const [openReports, setOpenReports] = React.useState(true)

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="px-4 py-3">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground font-black shrink-0 shadow-sm">
            <Sparkles className="h-5 w-5 text-primary-foreground" />
          </div>
          <div className="flex flex-col group-data-[collapsible=icon]:hidden">
            <span className="text-base font-extrabold tracking-tight text-foreground leading-none">
              FIXORA AI
            </span>
            <span className="text-[10px] font-mono text-muted-foreground uppercase font-bold tracking-wider mt-1">
              Ollama 7B/8B Engine
            </span>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        {/* Main Platform Navigation */}
        <SidebarGroup>
          <SidebarGroupLabel>Platform</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Overview */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard"} tooltip="Overview">
                  <Link href="/dashboard" className="flex items-center gap-2 w-full">
                    <LayoutDashboard className="h-4 w-4 shrink-0" />
                    <span>Overview</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Websites & Sub-pages */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/websites"}
                    tooltip="Websites"
                    className="flex-1"
                  >
                    <Link href="/dashboard/websites" className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4 shrink-0" />
                        <span>Websites</span>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-muted text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {websites.length}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <button
                    type="button"
                    onClick={() => setOpenWebsites(!openWebsites)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted group-data-[collapsible=icon]:hidden ml-1"
                    title="Toggle websites subpages"
                  >
                    {openWebsites ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {openWebsites && (
                  <SidebarMenuSub className="mt-1">
                    {websites.map((site) => {
                      const siteUrl = `/dashboard/websites/${site.id}`
                      const isActive = pathname === siteUrl
                      return (
                        <SidebarMenuSubItem key={site.id}>
                          <SidebarMenuSubButton isActive={isActive}>
                            <Link href={siteUrl} className="flex items-center justify-between w-full text-xs">
                              <span className="truncate max-w-[125px]" title={site.name}>
                                {site.name}
                              </span>
                              <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted/70 text-muted-foreground shrink-0">
                                {site.overall_score || site.seo_score} pt
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Scanners & Sub-pages */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/scanners"}
                    tooltip="Scanners Queue"
                    className="flex-1"
                  >
                    <Link href="/dashboard/scanners" className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <ScanLine className="h-4 w-4 shrink-0" />
                        <span>Scanners</span>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-data-[collapsible=icon]:hidden">
                        {scans.length} Jobs
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <button
                    type="button"
                    onClick={() => setOpenScanners(!openScanners)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted group-data-[collapsible=icon]:hidden ml-1"
                    title="Toggle scanner jobs"
                  >
                    {openScanners ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {openScanners && (
                  <SidebarMenuSub className="mt-1">
                    {scans.map((scan) => {
                      const scanUrl = `/dashboard/scanners/${scan.id}`
                      const isActive = pathname === scanUrl
                      return (
                        <SidebarMenuSubItem key={scan.id}>
                          <SidebarMenuSubButton isActive={isActive}>
                            <Link href={scanUrl} className="flex items-center justify-between w-full text-xs">
                              <span className="truncate max-w-[125px]" title={scan.website_name}>
                                {scan.website_name}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-muted-foreground shrink-0">
                                {scan.progress}%
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Intelligence & Analysis */}
        <SidebarGroup>
          <SidebarGroupLabel>AI & Audits</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* SEO Dashboard */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/seo"} tooltip="SEO Audit">
                  <Link href="/dashboard/seo" className="flex items-center gap-2 w-full">
                    <Search className="h-4 w-4 shrink-0" />
                    <span>SEO Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Performance */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/performance"} tooltip="Performance & CWV">
                  <Link href="/dashboard/performance" className="flex items-center gap-2 w-full">
                    <Gauge className="h-4 w-4 shrink-0" />
                    <span>Performance & CWV</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Accessibility */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/accessibility"} tooltip="Accessibility (WCAG)">
                  <Link href="/dashboard/accessibility" className="flex items-center gap-2 w-full">
                    <Accessibility className="h-4 w-4 shrink-0" />
                    <span>Accessibility (WCAG)</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* AI Code Fixes */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/fixes"} tooltip="AI Code Fixes">
                  <Link href="/dashboard/fixes" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Wrench className="h-4 w-4 shrink-0 text-primary" />
                      <span>AI Code Fixes</span>
                    </div>
                    {pendingFixesCount > 0 && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 group-data-[collapsible=icon]:hidden font-mono">
                        {pendingFixesCount} Pending
                      </span>
                    )}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Visual Diffs */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/screenshots"} tooltip="Visual Diffs">
                  <Link href="/dashboard/screenshots" className="flex items-center gap-2 w-full">
                    <Camera className="h-4 w-4 shrink-0" />
                    <span>Visual Diffs</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* PDF Reports & Sub-pages */}
              <SidebarMenuItem>
                <div className="flex items-center justify-between w-full">
                  <SidebarMenuButton
                    isActive={pathname === "/dashboard/reports"}
                    tooltip="PDF Reports"
                    className="flex-1"
                  >
                    <Link href="/dashboard/reports" className="flex items-center justify-between w-full">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 shrink-0" />
                        <span>PDF Reports</span>
                      </div>
                      <span className="px-1.5 py-0.5 text-[10px] font-mono font-bold rounded-md bg-muted text-muted-foreground group-data-[collapsible=icon]:hidden">
                        {MOCK_REPORTS.length}
                      </span>
                    </Link>
                  </SidebarMenuButton>
                  <button
                    type="button"
                    onClick={() => setOpenReports(!openReports)}
                    className="p-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted group-data-[collapsible=icon]:hidden ml-1"
                    title="Toggle reports subpages"
                  >
                    {openReports ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronRight className="h-3.5 w-3.5" />}
                  </button>
                </div>

                {openReports && (
                  <SidebarMenuSub className="mt-1">
                    {MOCK_REPORTS.map((rep) => {
                      const repUrl = `/dashboard/reports/${rep.id}`
                      const isActive = pathname === repUrl
                      return (
                        <SidebarMenuSubItem key={rep.id}>
                          <SidebarMenuSubButton isActive={isActive}>
                            <Link href={repUrl} className="flex items-center justify-between w-full text-xs">
                              <span className="truncate max-w-[125px]" title={rep.website_name}>
                                {rep.website_name}
                              </span>
                              <span className="text-[9px] font-mono font-bold text-muted-foreground shrink-0">
                                {rep.overall_score} pt
                              </span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      )
                    })}
                  </SidebarMenuSub>
                )}
              </SidebarMenuItem>

              {/* Analytics */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/analytics"} tooltip="Analytics & Trends">
                  <Link href="/dashboard/analytics" className="flex items-center gap-2 w-full">
                    <BarChart2 className="h-4 w-4 shrink-0" />
                    <span>Analytics & Trends</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Management & System */}
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Billing */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/billing"} tooltip="Billing & Usage">
                  <Link href="/dashboard/billing" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 shrink-0" />
                      <span>Billing & Usage</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-data-[collapsible=icon]:hidden font-mono">
                      $0 Free
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* User Management */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/users"} tooltip="User Management">
                  <Link href="/dashboard/users" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 shrink-0" />
                      <span>User Management</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-muted text-muted-foreground group-data-[collapsible=icon]:hidden font-mono">
                      3 Team
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Settings */}
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/dashboard/settings"} tooltip="Settings">
                  <Link href="/dashboard/settings" className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4 shrink-0" />
                      <span>Settings</span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[9px] font-bold rounded-md bg-primary/10 text-primary group-data-[collapsible=icon]:hidden font-mono">
                      Ollama
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Public & Quick Links */}
        <SidebarGroup>
          <SidebarGroupLabel>Public Portal</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/"} tooltip="Landing Page">
                  <Link href="/" className="flex items-center gap-2 w-full">
                    <Home className="h-4 w-4 shrink-0" />
                    <span>Landing Page</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/login"} tooltip="Auth Portal">
                  <Link href="/login" className="flex items-center gap-2 w-full">
                    <LogIn className="h-4 w-4 shrink-0" />
                    <span>Auth Portal</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton isActive={pathname === "/signup"} tooltip="Sign Up">
                  <Link href="/signup" className="flex items-center gap-2 w-full">
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span>Sign Up</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-3 space-y-2">
        {/* Quick Theme Switcher Button */}
        <div className="group-data-[collapsible=icon]:hidden px-1">
          <button
            type="button"
            onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
            className="w-full flex items-center justify-between px-3 py-1.5 rounded-xl bg-muted/40 hover:bg-muted text-xs text-muted-foreground transition-all"
          >
            <span className="flex items-center gap-2 font-medium">
              {resolvedTheme === "dark" ? (
                <Moon className="w-3.5 h-3.5 text-indigo-400" />
              ) : (
                <Sun className="w-3.5 h-3.5 text-amber-500" />
              )}
              {resolvedTheme === "dark" ? "Dark Mode" : "Light Mode"}
            </span>
            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-muted text-muted-foreground">
              Press 'D'
            </span>
          </button>
        </div>

        {/* NavUser Slot */}
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  )
}

