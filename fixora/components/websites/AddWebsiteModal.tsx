"use client"

import React, { useState } from 'react'
import { useUiStore } from '../../store/uiStore'
import { useWebsiteStore } from '../../store/websiteStore'
import { Globe, X, Sparkle } from '@phosphor-icons/react'

export function AddWebsiteModal() {
  const { isAddWebsiteModalOpen, setAddWebsiteModalOpen, addToast } = useUiStore()
  const { addWebsite } = useWebsiteStore()

  const [name, setName] = useState('')
  const [url, setUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (!isAddWebsiteModalOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !url.trim()) return

    setSubmitting(true)
    setTimeout(() => {
      const newSite = addWebsite({ name: name.trim(), url: url.trim() })
      setSubmitting(false)
      setAddWebsiteModalOpen(false)
      setName('')
      setUrl('')
      addToast({
        type: 'success',
        message: `Added "${newSite.name}" to fixora monitoring queue.`,
      })
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg rounded-2xl bg-card shadow-2xl p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-muted text-foreground">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground">Add New Website</h3>
              <p className="text-xs text-muted-foreground">Monitor SEO, Performance & WCAG A11y</p>
            </div>
          </div>

          <button
            onClick={() => setAddWebsiteModalOpen(false)}
            className="p-1.5 rounded-lg text-muted-foreground hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Website Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. My SaaS Landing Page"
              required
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-foreground">Website URL</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              required
              className="w-full text-xs px-3.5 py-2.5 rounded-xl bg-muted focus:outline-none focus:ring-2 focus:ring-primary font-mono"
            />
          </div>

          <div className="p-3.5 rounded-xl bg-muted text-xs text-muted-foreground space-y-1">
            <div className="font-semibold text-foreground flex items-center gap-1.5">
              <Sparkle className="w-4 h-4 text-foreground" /> Free Local AI Scan Enabled
            </div>
            <p className="text-[11px] leading-relaxed">
              Ollama local engine will automatically capture DOM snapshots, evaluate lighthouse metrics, and queue AI fixes.
            </p>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => setAddWebsiteModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-muted-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm active:scale-95 transition-all"
            >
              {submitting ? 'Adding Site...' : 'Start AI Analysis'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
