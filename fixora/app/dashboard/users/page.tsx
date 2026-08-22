"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAuth } from "@workos-inc/authkit-nextjs/components"
import { Users, UserPlus, Shield, CheckCircle } from '@phosphor-icons/react'

export default function UsersPage() {
  const { user } = useAuth()

  const members = [
    {
      id: '1',
      name: user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Primary Account',
      email: user?.email || 'admin@fixora.ai',
      role: 'Admin',
      status: 'Active',
      joined: '2025-01-10',
    },
    {
      id: '2',
      name: 'Sarah Jenkins',
      email: 'sarah@acme-corp.com',
      role: 'Manager',
      status: 'Active',
      joined: '2025-01-18',
    },
    {
      id: '3',
      name: 'Alex Rivera',
      email: 'alex.dev@fixora.ai',
      role: 'Viewer',
      status: 'Active',
      joined: '2025-01-24',
    },
  ]

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
                  <BreadcrumbPage>User Management</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm">
            <UserPlus className="w-4 h-4" /> Invite Team Member
          </button>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Team Member Permissions & Roles</h1>
            <p className="text-xs text-muted-foreground">
              Manage organization members authenticated securely via WorkOS AuthKit.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-card shadow-sm space-y-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-foreground" />
              <h3 className="text-base font-bold text-foreground">Organization Members ({members.length})</h3>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-sans">
                <thead className="bg-muted/50 text-muted-foreground font-mono">
                  <tr>
                    <th className="p-3">User</th>
                    <th className="p-3">Role</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/40">
                  {members.map((m) => (
                    <tr key={m.id} className="hover:bg-muted/30">
                      <td className="p-3">
                        <div className="font-bold text-foreground">{m.name}</div>
                        <div className="text-xs font-mono text-muted-foreground">{m.email}</div>
                      </td>
                      <td className="p-3">
                        <span className="text-[11px] font-bold font-mono px-2.5 py-0.5 rounded bg-muted text-muted-foreground">
                          {m.role}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center gap-1 text-foreground font-semibold">
                          <CheckCircle className="w-3.5 h-3.5 text-foreground" /> {m.status}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-muted-foreground">{m.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
