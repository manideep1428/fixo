"use client"

import React from 'react'
import type { CoreWebVital } from '../../types/performance'
import { CheckCircle, Warning, XCircle } from '@phosphor-icons/react'

interface CWVMetricsCardProps {
  vital: CoreWebVital
}

export function CWVMetricsCard({ vital }: CWVMetricsCardProps) {
  return (
    <div className="p-4 rounded-2xl bg-card shadow-sm flex flex-col justify-between space-y-3 transition-all">
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold font-mono px-2 py-0.5 rounded bg-muted text-foreground">
          {vital.metric}
        </span>
        <div className="flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
          <CheckCircle className="w-4 h-4 text-foreground" />
          <span className="capitalize">{vital.status.replace('-', ' ')}</span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-muted-foreground">{vital.name}</h4>
        <div className="text-2xl font-extrabold font-mono text-foreground mt-1">
          {vital.value} <span className="text-xs font-normal text-muted-foreground">{vital.unit}</span>
        </div>
      </div>

      <div className="text-[10px] text-muted-foreground border-t border-border/40 pt-2 font-mono flex justify-between">
        <span>Target Goal:</span>
        <span className="font-semibold">{vital.benchmark}</span>
      </div>
    </div>
  )
}
