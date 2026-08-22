"use client"

import React, { useState } from 'react'
import { useAiStore } from '../../store/aiStore'
import { ollamaService } from '../../services/ollamaService'
import { aiApi } from '../../services/backendService'
import type { AiModel } from '../../types/ai'
import { PaperPlaneRight, Robot, User, Trash, Sparkle, CircleNotch } from '@phosphor-icons/react'

export function AiChatPanel() {
  const { selectedModel, setSelectedModel, chatMessages, addChatMessage, clearChat, ollamaUrl } = useAiStore()
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!input.trim() || loading) return

    const userPrompt = input.trim()
    setInput('')

    // Add user message
    addChatMessage({
      role: 'user',
      content: userPrompt,
    })

    setLoading(true)

    // Placeholder assistant message updated as content arrives
    addChatMessage({
      role: 'assistant',
      content: '...',
      model: selectedModel,
    })

    const updateLast = (content: string) => {
      useAiStore.setState((state) => {
        const updated = [...state.chatMessages]
        updated[updated.length - 1] = {
          ...updated[updated.length - 1],
          content,
        }
        return { chatMessages: updated }
      })
    }

    try {
      try {
        // Preferred path: backend /api/ai/chat/ (persists history, proxies Ollama)
        const reply = await aiApi.chat(userPrompt, selectedModel)
        updateLast(reply.content || '...')
      } catch {
        // Fallback: stream directly from local Ollama in the browser
        let fullResponse = ''
        const generator = ollamaService.stream(userPrompt, selectedModel, ollamaUrl)
        for await (const chunk of generator) {
          fullResponse += chunk
          updateLast(fullResponse)
        }
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const promptPresets = [
    'How do I fix LCP image delay on Next.js 14?',
    'Generate meta tags for an AI product site',
    'Explain WCAG 2.1 AA color contrast rules',
    'How to optimize React 19 re-renders?',
  ]

  return (
    <div className="flex flex-col h-[520px] rounded-2xl bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-border/40 bg-muted/30">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-muted text-foreground">
            <Robot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Ollama AI Assistant</h3>
            <p className="text-[11px] text-muted-foreground">Free local LLM execution engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Model Selector */}
          <select
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as AiModel)}
            className="text-xs bg-muted rounded-lg px-2.5 py-1 font-mono font-medium focus:ring-2 focus:ring-primary"
          >
            <option value="mistral">Mistral 7B (Fast)</option>
            <option value="llama3.1:8b">Llama 3.1 8B (Deep Analysis)</option>
          </select>

          <button
            onClick={clearChat}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted"
            title="Clear Chat History"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start gap-3 ${
              msg.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`p-2 rounded-xl shrink-0 ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-foreground'
              }`}
            >
              {msg.role === 'user' ? <User className="w-4 h-4" /> : <Robot className="w-4 h-4 text-foreground" />}
            </div>

            <div
              className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-tr-none'
                  : 'bg-muted text-foreground rounded-tl-none font-sans'
              }`}
            >
              {msg.model && (
                <div className="text-[10px] font-mono text-muted-foreground mb-1 uppercase font-bold tracking-wider">
                  [{msg.model}]
                </div>
              )}
              <pre className="whitespace-pre-wrap font-sans">{msg.content}</pre>
            </div>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground font-mono animate-pulse">
            <CircleNotch className="w-4 h-4 animate-spin text-primary" />
            <span>Ollama {selectedModel} is thinking...</span>
          </div>
        )}
      </div>

      {/* Presets */}
      <div className="px-4 py-2 bg-muted/20 border-t border-border/40 flex items-center gap-2 overflow-x-auto text-[11px] scrollbar-none">
        <Sparkle className="w-3.5 h-3.5 text-primary shrink-0" />
        {promptPresets.map((preset) => (
          <button
            key={preset}
            onClick={() => {
              setInput(preset)
            }}
            className="px-2.5 py-1 rounded-full bg-muted text-muted-foreground hover:text-foreground whitespace-nowrap transition-colors"
          >
            {preset}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={handleSend} className="p-3 border-t border-border/40 bg-background flex items-center gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask ${selectedModel} about site performance, SEO or code fixes...`}
          className="flex-1 text-xs px-3.5 py-2.5 rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-2.5 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 transition-all active:scale-95"
        >
          <PaperPlaneRight className="w-4 h-4" />
        </button>
      </form>
    </div>
  )
}
