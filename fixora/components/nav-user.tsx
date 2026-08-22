"use client"

import React, { useState } from "react"
import Link from "next/link"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { useTheme } from "next-themes"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import {
  ChevronsUpDown,
  LogOut,
  Sun,
  Moon,
  Laptop,
  Sparkles,
  CreditCard,
  Settings,
  User,
  Shield,
  Bell,
} from "lucide-react"

export function NavUser() {
  const { isMobile } = useSidebar()
  const { user } = useAuth()
  const { theme, setTheme } = useTheme()

  const displayName = user
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || user.email
    : "Authenticated User"

  const displayEmail = user?.email || "user@fixora.ai"
  const displayAvatar = user?.profilePictureUrl || ""
  const initials =
    displayName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "U"

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
              />
            }
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage src={displayAvatar} alt={displayName} />
              <AvatarFallback className="rounded-lg bg-primary/10 text-primary font-bold text-xs">
                {initials}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-xs leading-tight group-data-[collapsible=icon]:hidden">
              <span className="truncate font-bold text-foreground">{displayName}</span>
              <span className="truncate text-[10px] text-muted-foreground font-mono">WorkOS Connected</span>
            </div>
            <ChevronsUpDown className="ml-auto size-4 group-data-[collapsible=icon]:hidden" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-64 rounded-2xl p-2 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={6}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-3 p-2 text-left">
                  <Avatar className="h-9 w-9 rounded-xl border">
                    <AvatarImage src={displayAvatar} alt={displayName} />
                    <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-xs leading-tight">
                    <span className="truncate font-bold text-foreground">{displayName}</span>
                    <span className="truncate text-[11px] text-muted-foreground font-mono">{displayEmail}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Theme Toggle System Slots */}
            <DropdownMenuGroup>
              <div className="px-2 py-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground font-mono">
                Theme System
              </div>
              <div className="grid grid-cols-3 gap-1 p-1 bg-muted/50 rounded-xl border">
                <button
                  type="button"
                  onClick={() => setTheme("light")}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === "light"
                      ? "bg-background text-foreground shadow-xs border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Sun className="w-3.5 h-3.5" /> Light
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("dark")}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === "dark"
                      ? "bg-background text-foreground shadow-xs border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Moon className="w-3.5 h-3.5" /> Dark
                </button>
                <button
                  type="button"
                  onClick={() => setTheme("system")}
                  className={`flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    theme === "system"
                      ? "bg-background text-foreground shadow-xs border"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Laptop className="w-3.5 h-3.5" /> System
                </button>
              </div>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Quick Navigation Slots */}
            <DropdownMenuGroup>
              <DropdownMenuItem render={<Link href="/dashboard/billing" className="flex items-center gap-2 text-xs" />}>
                <CreditCard className="w-4 h-4 text-primary" />
                <span>Billing & Usage</span>
              </DropdownMenuItem>

              <DropdownMenuItem render={<Link href="/dashboard/settings" className="flex items-center gap-2 text-xs" />}>
                <Settings className="w-4 h-4 text-indigo-500" />
                <span>Ollama Engine Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem render={<Link href="/dashboard/users" className="flex items-center gap-2 text-xs" />}>
                <User className="w-4 h-4 text-purple-500" />
                <span>Team Members</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            {/* Sign Out Slot */}
            <DropdownMenuItem render={<Link href="/logout" className="flex items-center gap-2 text-xs text-rose-500 font-semibold focus:text-rose-500" />}>
              <LogOut className="w-4 h-4 text-rose-500" />
              <span>Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
