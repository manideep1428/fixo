"use client"

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { ollamaService } from '../../services/ollamaService'
import type { AiModel } from '../../types/ai'
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Globe,
  Wrench,
  CheckCircle2,
  ArrowRight,
  Cpu,
  Gauge,
  Accessibility,
  Code2,
  Terminal,
  Loader2,
  Copy,
  Check,
  RefreshCw,
  Server,
  Play,
  Flame,
} from 'lucide-react'

interface InteractiveLandingProps {
  user: any
}

export function InteractiveLanding({ user }: InteractiveLandingProps) {
  const [model, setModel] = useState<AiModel>('mistral')
  const [prompt, setPrompt] = useState('https://fixora.ai — Audit SEO & Generate Code Fixes')
  const [ollamaConnected, setOllamaConnected] = useState<boolean | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiOutput, setAiOutput] = useState('')
  const [tokensCount, setTokensCount] = useState(0)
  const [executionTime, setExecutionTime] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)

  // Check Ollama connection status on mount
  useEffect(() => {
    ollamaService.checkConnection().then((connected) => {
      setOllamaConnected(connected)
    })
  }, [])

  const handleRunLocalLlmTest = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!prompt.trim() || isGenerating) return

    setIsGenerating(true)
    setAiOutput('')
    setTokensCount(0)
    const startTime = Date.now()

    const fullPrompt = prompt.startsWith('http')
      ? `Audit website: ${prompt}. Analyze SEO meta tags, Core Web Vitals performance, and WCAG accessibility. Output a clean React code patch.`
      : prompt

    try {
      let accumulated = ''
      let count = 0

      for await (const chunk of ollamaService.stream(fullPrompt, model)) {
        accumulated += chunk
        count += chunk.split(/\s+/).length
        setAiOutput(accumulated)
        setTokensCount(count)
      }

      setExecutionTime(Date.now() - startTime)
    } catch (err) {
      console.error(err)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleCopyCode = () => {
    if (!aiOutput) return
    navigator.clipboard.writeText(aiOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const samplePrompts = [
    'https://fixora.ai',
    'Fix Next.js 14 LCP image loading performance',
    'Generate WCAG 2.1 AA accessible button props',
    'Write full SEO Meta & OpenGraph tags for React',
  ]

  return (
    <div className="space-y-24 pb-20">
      {/* HERO & LOCAL LLM TEST BENCH */}
      <section className="relative pt-16 pb-12 md:pt-24 md:pb-20 overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-gradient-to-tr from-blue-600/20 via-indigo-500/20 to-purple-600/20 blur-[130px] rounded-full pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6 text-center space-y-8">
          {/* Top Connection Status Badge */}
          <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full border bg-card/90 backdrop-blur-md shadow-sm text-xs font-medium">
            <Server className="w-4 h-4 text-primary" />
            <span className="font-mono font-bold">Ollama Status:</span>
            {ollamaConnected === null ? (
              <span className="text-muted-foreground flex items-center gap-1 font-mono">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> Ping http://localhost:11434...
              </span>
            ) : ollamaConnected ? (
              <span className="inline-flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Connected (http://localhost:11434)
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold font-mono">
                <span className="w-2 h-2 rounded-full bg-amber-500" /> Offline (Using Simulated Fallback Engine)
              </span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight max-w-5xl mx-auto leading-[1.1]">
            Test Your Local LLM Engine <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-600 bg-clip-text text-transparent">
              Free Website Audits & Code Fixes
            </span>
          </h1>

          <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Run real local AI inference on your browser. Zero cloud tokens, zero network latency, 100% privacy using Ollama (Mistral 7B & Llama 3.1 8B).
          </p>

          {/* LOCAL LLM TESTER SANDBOX */}
          <div className="max-w-4xl mx-auto pt-4 text-left">
            <div className="p-6 rounded-3xl bg-card border shadow-2xl space-y-5 ring-1 ring-primary/20">
              {/* Test Controls Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-primary/10 text-primary">
                    <Cpu className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-foreground">Local Ollama LLM Test Bench</h3>
                    <p className="text-xs text-muted-foreground font-mono">Host: http://localhost:11434</p>
                  </div>
                </div>

                {/* Model Selector */}
                <div className="flex items-center gap-3">
                  <span className="text-xs font-mono text-muted-foreground">Select Model:</span>
                  <select
                    value={model}
                    onChange={(e) => setModel(e.target.value as AiModel)}
                    className="text-xs font-mono font-bold bg-muted/60 border rounded-xl px-3 py-2 text-foreground focus:ring-2 focus:ring-primary"
                  >
                    <option value="mistral">Mistral 7B (Fast - ~380ms)</option>
                    <option value="llama3.1:8b">Llama 3.1 8B (Deep Structural Fixes)</option>
                  </select>
                </div>
              </div>

              {/* Input Form */}
              <form onSubmit={handleRunLocalLlmTest} className="space-y-3">
                <div className="flex flex-col sm:flex-row gap-2">
                  <div className="relative flex-1">
                    <Globe className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Enter site URL or AI prompt (e.g. https://fixora.ai)..."
                      className="w-full text-xs font-mono pl-10 pr-3 py-3 rounded-xl border bg-muted/30 focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isGenerating}
                    className="shrink-0 inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-xs bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-md active:scale-95 disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-primary-foreground" /> Generating...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 text-amber-300 fill-amber-300" /> Run Local LLM Test
                      </>
                    )}
                  </button>
                </div>

                {/* Preset Prompt Pills */}
                <div className="flex items-center gap-2 overflow-x-auto text-[11px] font-mono text-muted-foreground pt-1 scrollbar-none">
                  <Flame className="w-3.5 h-3.5 text-primary shrink-0" />
                  <span>Presets:</span>
                  {samplePrompts.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPrompt(p)}
                      className="px-2.5 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors border"
                    >
                      {p.length > 35 ? `${p.slice(0, 35)}...` : p}
                    </button>
                  ))}
                </div>
              </form>

              {/* LIVE STREAMING AI OUTPUT TERMINAL */}
              {(isGenerating || aiOutput) && (
                <div className="rounded-2xl overflow-hidden bg-slate-950 text-slate-100 border border-slate-800 p-5 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-slate-200">Ollama [{model.toUpperCase()}] Stream</span>
                    </div>

                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      {executionTime && <span>Time: {executionTime}ms</span>}
                      <span>Tokens: {tokensCount}</span>
                      <button
                        onClick={handleCopyCode}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" /> {copied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>

                  <pre className="whitespace-pre-wrap leading-relaxed text-slate-300 max-h-[300px] overflow-y-auto">
                    <code>{aiOutput}</code>
                  </pre>

                  {isGenerating && (
                    <div className="flex items-center gap-2 text-emerald-400 text-[11px] animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Streaming response chunks from local Ollama model...
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Metric Stats Banner */}
          <div className="pt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="p-4 rounded-2xl bg-card border text-center shadow-sm">
              <div className="text-2xl font-black font-mono text-primary">14,200+</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Local LLM Scans</div>
            </div>
            <div className="p-4 rounded-2xl bg-card border text-center shadow-sm">
              <div className="text-2xl font-black font-mono text-emerald-500">$0.00</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">API Costs Saved</div>
            </div>
            <div className="p-4 rounded-2xl bg-card border text-center shadow-sm">
              <div className="text-2xl font-black font-mono text-indigo-500">~380ms</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">Local Latency</div>
            </div>
            <div className="p-4 rounded-2xl bg-card border text-center shadow-sm">
              <div className="text-2xl font-black font-mono text-purple-500">100%</div>
              <div className="text-[11px] text-muted-foreground font-medium mt-0.5">On-Premise Privacy</div>
            </div>
          </div>
        </div>
      </section>

      {/* PLATFORM FEATURES */}
      <section id="features" className="max-w-7xl mx-auto px-6 space-y-12">
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold font-mono">
            <Sparkles className="w-3.5 h-3.5" /> Full-Stack Website Audits
          </div>
          <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
            Built for High-Performance Engineering
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-500 w-fit">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">SEO & Meta Audits</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Scan title lengths, meta descriptions, OpenGraph tags, canonicals, and keyword density.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 font-mono text-[11px] text-emerald-600 dark:text-emerald-400 font-bold border">
              ✓ Passed Meta & Sitemap Verification
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-500 w-fit">
                <Gauge className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">Core Web Vitals</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Monitor LCP, CLS, INP, TTFB, and speed index metrics to maximize search rankings.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 font-mono text-[11px] text-blue-600 dark:text-blue-400 font-bold border">
              ⚡ LCP 1.2s | CLS 0.03 (Good)
            </div>
          </div>

          <div className="p-8 rounded-3xl bg-card border shadow-sm space-y-4 hover:border-primary/40 transition-all flex flex-col justify-between">
            <div className="space-y-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-500 w-fit">
                <Accessibility className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold">WCAG 2.1 Accessibility</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Catch screen reader label omissions, color contrast ratio failures, and focus rings.
              </p>
            </div>
            <div className="p-3 rounded-xl bg-muted/40 font-mono text-[11px] text-purple-600 dark:text-purple-400 font-bold border">
              ♿ Level AA Compliance Verified
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CALL TO ACTION */}
      <section className="max-w-5xl mx-auto px-6 text-center">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-10 md:p-16 text-white shadow-2xl space-y-6">
          <div className="relative z-10 space-y-4">
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
              Ready to Audit Your Web Apps with Ollama?
            </h2>
            <p className="text-sm sm:text-base text-blue-100 max-w-xl mx-auto leading-relaxed">
              Launch Fixora AI now. Secure authentication with WorkOS.
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              {user ? (
                <Link
                  href="/dashboard"
                  className="px-8 py-4 rounded-2xl font-extrabold text-xs bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg active:scale-95"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <Link
                  href="/signup"
                  className="px-8 py-4 rounded-2xl font-extrabold text-xs bg-white text-blue-600 hover:bg-blue-50 transition-all shadow-lg active:scale-95 inline-flex items-center gap-2"
                >
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
