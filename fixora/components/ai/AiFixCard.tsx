"use client"

import React, { useState } from 'react'
import type { AiFix } from '../../types/ai'
import { useAiStore } from '../../store/aiStore'
import { useUiStore } from '../../store/uiStore'
import { Sparkle, CheckCircle, Code, Copy, CaretDown, CaretUp, Cpu } from '@phosphor-icons/react'

interface AiFixCardProps {
  fix: AiFix
}

export function AiFixCard({ fix }: AiFixCardProps) {
  const { applyFix } = useAiStore()
  const { addToast } = useUiStore()
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [applying, setApplying] = useState(false)

  const handleApply = () => {
    setApplying(true)
    setTimeout(() => {
      applyFix(fix.id)
      setApplying(false)
      addToast({
        type: 'success',
        message: `Successfully applied AI fix: "${fix.title}"`,
      })
    }, 700)
  }

  const handleCopyCode = () => {
    if (!fix.fix_code) return
    navigator.clipboard.writeText(fix.fix_code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getSeverityBadge = (sev: string) => {
    return 'bg-muted text-muted-foreground font-mono'
  }

  return (
    <div className="p-5 rounded-2xl bg-card shadow-sm transition-all duration-200">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${getSeverityBadge(
                fix.severity
              )}`}
            >
              {fix.severity}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground">
              {fix.issue_type}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground font-mono">
              <Cpu className="w-3.5 h-3.5 text-foreground" />
              {fix.model_used} ({Math.round(fix.confidence * 100)}% confidence)
            </span>
          </div>
          <h3 className="text-base font-bold text-foreground">{fix.title}</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {fix.description}
          </p>
          {fix.affected_file && (
            <p className="text-[11px] font-mono text-muted-foreground">
              File: {fix.affected_file} {fix.line_number ? `(L${fix.line_number})` : ''}
            </p>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleApply}
            disabled={fix.applied || applying}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide transition-all shadow-sm ${
              fix.applied
                ? 'bg-muted text-muted-foreground cursor-default'
                : 'bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95'
            }`}
          >
            {fix.applied ? (
              <>
                <CheckCircle className="w-4 h-4 text-foreground" /> Patch Applied
              </>
            ) : applying ? (
              <>Applying Fix...</>
            ) : (
              <>
                <Sparkle className="w-4 h-4" /> Apply AI Fix
              </>
            )}
          </button>
        </div>
      </div>

      {fix.fix_code && (
        <div className="mt-4 pt-3 border-t border-border/40">
          <button
            onClick={() => setExpanded(!expanded)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline"
          >
            <Code className="w-4 h-4" />
            {expanded ? 'Hide Generated Code Patch' : 'View Generated Code Patch'}
            {expanded ? <CaretUp className="w-3.5 h-3.5" /> : <CaretDown className="w-3.5 h-3.5" />}
          </button>

          {expanded && (
            <div className="mt-3 relative rounded-xl overflow-hidden bg-muted p-4 text-foreground font-mono text-xs">
              <button
                onClick={handleCopyCode}
                className="absolute top-3 right-3 p-1.5 rounded-lg bg-background hover:bg-muted text-foreground text-xs flex items-center gap-1 shadow-sm"
              >
                <Copy className="w-3.5 h-3.5" />
                {copied ? 'Copied!' : 'Copy Code'}
              </button>
              <pre className="overflow-x-auto whitespace-pre-wrap leading-relaxed">
                <code>{fix.fix_code}</code>
              </pre>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
