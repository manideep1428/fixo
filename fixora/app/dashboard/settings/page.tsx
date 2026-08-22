"use client"

import React, { useState, useEffect } from 'react'
import { AppSidebar } from "@/components/app-sidebar"
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { useAiStore } from '@/store/aiStore'
import { useUiStore } from '@/store/uiStore'
import { ollamaService } from '@/services/ollamaService'
import { Gear, Cpu, CheckCircle, XCircle, Sparkle, FloppyDisk } from '@phosphor-icons/react'

export default function SettingsPage() {
  const { ollamaUrl, setOllamaUrl, selectedModel, setSelectedModel, isOllamaConnected, setOllamaConnected } = useAiStore()
  const { addToast } = useUiStore()

  const [inputUrl, setInputUrl] = useState(ollamaUrl)
  const [testing, setTesting] = useState(false)

  useEffect(() => {
    ollamaService.checkConnection(ollamaUrl).then((connected) => {
      setOllamaConnected(connected)
    })
  }, [ollamaUrl, setOllamaConnected])

  const handleTestConnection = async () => {
    setTesting(true)
    const connected = await ollamaService.checkConnection(inputUrl)
    setTesting(false)
    setOllamaConnected(connected)

    if (connected) {
      setOllamaUrl(inputUrl)
      addToast({
        type: 'success',
        message: `Successfully connected to Ollama server at ${inputUrl}`,
      })
    } else {
      addToast({
        type: 'warning',
        message: `Could not connect to ${inputUrl}. Running in simulated fallback mode.`,
      })
    }
  }

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
                  <BreadcrumbPage>Settings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-6 p-6 max-w-4xl">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Platform & AI Engine Settings</h1>
            <p className="text-xs text-muted-foreground">
              Configure your local Ollama server address, default LLM model selection, and WorkOS Auth settings.
            </p>
          </div>

          {/* Ollama Server Config */}
          <div className="p-6 rounded-2xl bg-card shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-muted text-foreground">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-foreground">Local Ollama AI Engine Server</h3>
                  <p className="text-xs text-muted-foreground">Free Unlimited On-Premise LLM Execution</p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isOllamaConnected ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                    <CheckCircle className="w-3.5 h-3.5 text-foreground" /> Ollama Online
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-muted text-muted-foreground">
                    <XCircle className="w-3.5 h-3.5 text-foreground" /> Offline (Fallback Mode)
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Ollama Server Host Base URL</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputUrl}
                    onChange={(e) => setInputUrl(e.target.value)}
                    placeholder="http://localhost:11434"
                    className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-muted font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                  <button
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-all shadow-sm active:scale-95 flex items-center gap-1.5"
                  >
                    <FloppyDisk className="w-4 h-4" />
                    {testing ? 'Testing...' : 'Save & Test'}
                  </button>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Default Ollama port is <code>http://localhost:11434</code>. Ensure <code>ollama serve</code> is running.
                </p>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-border/40">
                <label className="text-xs font-semibold text-foreground">Default Local AI Model</label>
                <select
                  value={selectedModel}
                  onChange={(e) => setSelectedModel(e.target.value as any)}
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-muted font-mono focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="mistral">Mistral 7B (Recommended - Fast & Lightweight)</option>
                  <option value="llama3.1:8b">Llama 3.1 8B (Deep Structural Code Fixes)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
