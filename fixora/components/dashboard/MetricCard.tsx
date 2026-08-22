"use client"

import React from 'react'
import {
  Globe,
  Lightning,
  CheckCircle,
  TrendUp,
  ShieldCheck,
  Wrench,
  Sparkle,
} from '@phosphor-icons/react'

interface MetricCardProps {
  title: string
  value: string | number
  icon?: 'globe' | 'scan' | 'check' | 'seo' | 'fix' | 'sparkle'
  trend?: string
  trendUp?: boolean
  description?: string
}

export function MetricCard({ title, value, icon = 'globe', trend, trendUp = true, description }: MetricCardProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'globe':
        return <Globe className="w-5 h-5 text-foreground" />
      case 'scan':
        return <Lightning className="w-5 h-5 text-foreground" />
      case 'check':
        return <CheckCircle className="w-5 h-5 text-foreground" />
      case 'seo':
        return <ShieldCheck className="w-5 h-5 text-foreground" />
      case 'fix':
        return <Wrench className="w-5 h-5 text-foreground" />
      case 'sparkle':
        return <Sparkle className="w-5 h-5 text-foreground" />
      default:
        return <Globe className="w-5 h-5 text-foreground" />
    }
  }

  return (
    <div className="p-5 rounded-2xl bg-card shadow-sm transition-all duration-200 hover:shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </span>
        <div className="p-2 rounded-xl bg-muted">
          {renderIcon()}
        </div>
      </div>
      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-extrabold tracking-tight font-mono text-foreground">
          {value}
        </span>
        {trend && (
          <span
            className="inline-flex items-center text-xs font-bold font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground"
          >
            <TrendUp className="w-3 h-3 mr-1" />
            {trend}
          </span>
        )}
      </div>
      {description && (
        <p className="text-xs text-muted-foreground mt-2 line-clamp-1">
          {description}
        </p>
      )}
    </div>
  )
}
