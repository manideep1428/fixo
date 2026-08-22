"use client"

import React from 'react'
import { Sparkle, CheckCircle, Lightning, ShieldWarning } from '@phosphor-icons/react'

export function ActivityFeed() {
  const activities = [
    {
      id: '1',
      title: 'Applied AI Patch: Missing Meta Description',
      time: '12 minutes ago',
      site: 'fixora.ai',
      type: 'fix',
      model: 'Mistral 7B',
    },
    {
      id: '2',
      title: 'Full Website Scan Completed',
      time: '45 minutes ago',
      site: 'store.acme-corp.com',
      type: 'scan',
      model: 'Ollama Engine',
    },
    {
      id: '3',
      title: 'WCAG 2.1 Color Contrast Alert',
      time: '2 hours ago',
      site: 'launch.fixora.ai',
      type: 'warning',
      model: 'A11y Inspector',
    },
    {
      id: '4',
      title: 'Core Web Vitals Optimized (+14% LCP)',
      time: '5 hours ago',
      site: 'docs.fixora.ai',
      type: 'success',
      model: 'Llama 3.1 8B',
    },
  ]

  return (
    <div className="p-5 rounded-2xl bg-card shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-foreground">Recent Activity</h3>
        <span className="text-xs text-muted-foreground font-mono">Live Logs</span>
      </div>
      <div className="space-y-3">
        {activities.map((act) => (
          <div
            key={act.id}
            className="flex items-start gap-3 p-3 rounded-xl bg-muted/40 hover:bg-muted/70 transition-colors"
          >
            <div className="p-2 rounded-lg bg-muted mt-0.5 text-foreground">
              {act.type === 'fix' && <Sparkle className="w-4 h-4" />}
              {act.type === 'scan' && <Lightning className="w-4 h-4" />}
              {act.type === 'warning' && <ShieldWarning className="w-4 h-4" />}
              {act.type === 'success' && <CheckCircle className="w-4 h-4" />}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground truncate">{act.title}</p>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground mt-0.5 font-mono">
                <span>{act.site}</span>
                <span>•</span>
                <span>{act.time}</span>
              </div>
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {act.model}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
