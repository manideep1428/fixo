"use client"

import React from 'react'

interface ScoreGaugeProps {
  label: string
  score: number
  color?: 'brand' | 'warning' | 'success' | 'danger'
  subtext?: string
}

export function ScoreGauge({ label, score, color = 'brand', subtext }: ScoreGaugeProps) {
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative flex flex-col items-center justify-center p-5 rounded-2xl bg-card shadow-sm transition-all duration-300">
      <div className="relative w-28 h-28 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          {/* Background Track */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-muted"
            strokeWidth="8"
            fill="transparent"
          />
          {/* Progress Ring */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            className="stroke-primary text-primary transition-all duration-1000 ease-out"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <div className="absolute flex flex-col items-center justify-center">
          <span className="text-2xl font-extrabold tracking-tight font-mono text-foreground">
            {score}
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">/100</span>
        </div>
      </div>
      <h4 className="mt-3 font-semibold text-sm tracking-wide text-foreground">{label}</h4>
      {subtext && <p className="text-xs text-muted-foreground mt-0.5">{subtext}</p>}
    </div>
  )
}
