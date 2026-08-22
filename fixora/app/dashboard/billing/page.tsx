"use client"

import React from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { MetricCard } from '@/components/dashboard/MetricCard'
import { CreditCard, Check, Cpu, Sparkle, ShieldCheck } from '@phosphor-icons/react'

export default function BillingPage() {
  const plans = [
    {
      id: 'free',
      name: 'Community Developer',
      price: '$0',
      period: 'forever free',
      aiModel: 'Ollama Local (Mistral / Llama 3.1)',
      features: [
        'Unlimited AI Scans (Local Ollama)',
        'Up to 3 Monitored Websites',
        'SEO & Performance Audits',
        'WCAG 2.1 Level AA Accessibility',
        '1-Click Code Patch Generator',
      ],
      current: true,
    },
    {
      id: 'pro',
      name: 'Pro Team',
      price: '$29',
      period: '/ month',
      aiModel: 'Ollama Local + CockroachDB Sync',
      features: [
        'Everything in Free Plan',
        'Unlimited Monitored Websites',
        'Playwright Visual Diff Screenshots',
        'Exportable PDF Client Reports',
        'Role-Based Team Member Access',
        'Priority Local Model Acceleration',
      ],
      popular: true,
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
                  <BreadcrumbPage>Billing & Usage</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Subscription & Local AI Cost Analytics</h1>
            <p className="text-xs text-muted-foreground">
              Because Fixora AI utilizes local Ollama inference, your AI scans cost $0 per token with zero API quotas or paywalls.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <MetricCard title="Current Plan" value="Free Forever" icon="fix" description="Powered by Ollama" />
            <MetricCard title="Cloud API Fee Saved" value="$142.50" icon="sparkle" trend="+100%" description="Vs OpenAI GPT-4o pricing" />
            <MetricCard title="AI Token Usage" value="Unlimited" icon="check" description="0 rate limits" />
            <MetricCard title="CockroachDB DB Storage" value="Free Tier" icon="globe" description="Distributed DB cluster active" />
          </div>

          {/* Pricing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2 max-w-4xl">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className="p-6 rounded-2xl bg-card shadow-sm flex flex-col justify-between space-y-6 relative"
              >
                {plan.popular && (
                  <span className="absolute -top-3 right-6 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary text-primary-foreground shadow-sm">
                    Most Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-foreground">{plan.name}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">{plan.aiModel}</p>
                  </div>

                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-extrabold font-mono text-foreground">{plan.price}</span>
                    <span className="text-xs text-muted-foreground font-mono">{plan.period}</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-border/40 text-xs">
                    {plan.features.map((feat) => (
                      <div key={feat} className="flex items-center gap-2 text-muted-foreground">
                        <Check className="w-4 h-4 text-foreground shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  className={`w-full py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all ${
                    plan.current
                      ? 'bg-muted text-muted-foreground cursor-default'
                      : 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95'
                  }`}
                >
                  {plan.current ? 'Active Plan' : 'Upgrade Plan'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
