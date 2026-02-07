"use client"

import { useState, useEffect } from "react"

interface Scout {
  recordId: string
  title: string
  status: string
  tags: string
  messageCount: number
  createdAt: string
}

interface SidebarProps {
  activeScoutId: string | null
  onSelectScout: (scoutId: string) => void
  onNewScout: () => void
  refreshTrigger: number
}

function formatDate(iso: string): string {
  if (!iso) return ""
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }
  if (diffDays === 1) return "Yesterday"
  if (diffDays < 7) return `${diffDays}d ago`
  return d.toLocaleDateString([], { month: "short", day: "numeric" })
}

function statusIcon(status: string): string {
  if (status === "active") return "🟢"
  if (status === "completed") return "✅"
  return "📋"
}

function parseTags(raw: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed.slice(0, 3)
  } catch {
    return raw.split(",").map((t: string) => t.trim()).filter(Boolean).slice(0, 3)
  }
  return []
}

export function Sidebar({ activeScoutId, onSelectScout, onNewScout, refreshTrigger }: SidebarProps) {
  const [scouts, setScouts] = useState<Scout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/scouts", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setScouts(data.scouts || [])
      })
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [refreshTrigger])

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-background border border-border rounded-md shadow-sm"
        aria-label="Toggle scouts"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          {isOpen ? (
            <path d="M18 6L6 18M6 6l12 12" />
          ) : (
            <path d="M3 12h18M3 6h18M3 18h18" />
          )}
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:sticky top-0 left-0 z-40
          h-screen w-64 bg-muted/30 border-r border-border
          flex flex-col
          transition-transform duration-200
          ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
        `}
      >
        <div className="p-3 border-b border-border">
          <button
            onClick={() => {
              onNewScout()
              setIsOpen(false)
            }}
            className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            + New Scout
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-3 text-sm text-muted-foreground">Loading...</p>
          ) : scouts.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No scouts yet</p>
          ) : (
            <ul className="py-1">
              {scouts.map((s) => (
                <li key={s.recordId}>
                  <button
                    onClick={() => {
                      onSelectScout(s.recordId)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full text-left px-3 py-2 text-sm
                      hover:bg-muted transition-colors
                      ${activeScoutId === s.recordId ? "bg-muted font-medium" : ""}
                    `}
                  >
                    <p className="truncate text-foreground">
                      {statusIcon(s.status)} {s.title || "New Scout"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(s.createdAt)}
                      {s.messageCount > 0 && ` · ${s.messageCount} msg`}
                    </p>
                    {parseTags(s.tags).length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {parseTags(s.tags).map((tag, i) => (
                          <span
                            key={i}
                            className="inline-block px-1.5 py-0 text-[10px] rounded-full bg-primary/10 text-primary/70"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}

