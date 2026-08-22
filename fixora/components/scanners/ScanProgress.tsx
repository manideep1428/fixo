"use client"

import React from 'react'
import type { ScanJob } from '../../types/scanner'
import { CircleNotch, CheckCircle, Warning, Play, Terminal } from '@phosphor-icons/react'

interface ScanProgressProps {
  scan: ScanJob
}

export function ScanProgress({ scan }: ScanProgressProps) {
  return (
    <div className="p-5 rounded-2xl bg-card shadow-sm space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h4 className="text-sm font-bold text-foreground">{scan.website_name}</h4>
          <p className="text-xs font-mono text-muted-foreground">{scan.url}</p>
        </div>
        <div className="flex items-center gap-2">
          {scan.status === 'running' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              <CircleNotch className="w-3.5 h-3.5 animate-spin text-foreground" /> Scanning Active
            </span>
          )}
          {scan.status === 'completed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              <CheckCircle className="w-3.5 h-3.5 text-foreground" /> Completed
            </span>
          )}
          {scan.status === 'failed' && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
              <Warning className="w-3.5 h-3.5 text-foreground" /> Failed
            </span>
          )}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex justify-between text-xs font-mono text-muted-foreground">
          <span>Progress</span>
          <span>{scan.progress}%</span>
        </div>
        <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${scan.progress}%` }}
          />
        </div>
      </div>

      {/* Live Log Step Console */}
      <div className="p-3.5 rounded-xl bg-muted text-foreground font-mono text-xs space-y-1">
        <div className="flex items-center gap-2 text-muted-foreground pb-1.5 border-b border-border/40 mb-1.5">
          <Terminal className="w-4 h-4 text-foreground" />
          <span>Execution Log Console</span>
        </div>
        <p className="text-foreground text-[11px] font-semibold">
          &gt; {scan.current_step || 'Processing queue step...'}
        </p>
        {scan.started_at && (
          <p className="text-muted-foreground text-[10px]">Started: {new Date(scan.started_at).toLocaleTimeString()}</p>
        )}
      </div>
    </div>
  )
}
