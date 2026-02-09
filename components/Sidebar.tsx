"use client"

import { useState, useEffect, useRef } from "react"
import { Skeleton } from "@/components/ui/skeleton"

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
  onScoutDeleted?: (scoutId: string) => void
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

function SidebarSkeleton() {
  return (
    <div className="py-1 space-y-1">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="px-3 py-2 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/2" />
        </div>
      ))}
    </div>
  )
}

export function Sidebar({ activeScoutId, onSelectScout, onNewScout, onScoutDeleted, refreshTrigger }: SidebarProps) {
  const [scouts, setScouts] = useState<Scout[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState("")
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)
  const editInputRef = useRef<HTMLInputElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

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

  // Focus input when editing starts
  useEffect(() => {
    if (editingId && editInputRef.current) {
      editInputRef.current.focus()
      editInputRef.current.select()
    }
  }, [editingId])

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpenId(null)
      }
    }
    if (menuOpenId) {
      document.addEventListener("mousedown", handleClickOutside)
      return () => document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [menuOpenId])

  const handleRename = async (scoutId: string) => {
    const trimmed = editTitle.trim()
    if (!trimmed) {
      setEditingId(null)
      return
    }

    try {
      const res = await fetch("/api/scout-rename", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoutId, newTitle: trimmed }),
      })
      if (res.ok) {
        setScouts((prev) =>
          prev.map((s) => (s.recordId === scoutId ? { ...s, title: trimmed } : s))
        )
      }
    } catch {}
    setEditingId(null)
  }

  const handleDelete = async (scoutId: string) => {
    try {
      const res = await fetch("/api/scout-delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoutId }),
      })
      if (res.ok) {
        setScouts((prev) => prev.filter((s) => s.recordId !== scoutId))
        if (onScoutDeleted) {
          onScoutDeleted(scoutId)
        }
      }
    } catch {}
    setConfirmDeleteId(null)
  }

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
          h-full w-64 bg-muted/30 border-r border-border
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
            <SidebarSkeleton />
          ) : scouts.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No scouts yet</p>
          ) : (
            <ul className="py-1">
              {scouts.map((s) => (
                <li key={s.recordId} className="relative group">
                  {editingId === s.recordId ? (
                    /* Inline rename */
                    <div className="px-3 py-2">
                      <input
                        ref={editInputRef}
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") handleRename(s.recordId)
                          if (e.key === "Escape") setEditingId(null)
                        }}
                        onBlur={() => handleRename(s.recordId)}
                        className="w-full px-2 py-1 text-sm border border-border rounded bg-background text-foreground outline-none focus:ring-1 focus:ring-primary"
                        maxLength={100}
                      />
                    </div>
                  ) : confirmDeleteId === s.recordId ? (
                    /* Delete confirmation */
                    <div className="px-3 py-2 space-y-2">
                      <p className="text-xs text-muted-foreground">Delete this scout?</p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleDelete(s.recordId)}
                          className="flex-1 px-2 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                        >
                          Delete
                        </button>
                        <button
                          onClick={() => setConfirmDeleteId(null)}
                          className="flex-1 px-2 py-1 text-xs bg-muted text-foreground rounded hover:bg-muted/80 transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Normal scout item */
                    <>
                      <button
                        onClick={() => {
                          onSelectScout(s.recordId)
                          setIsOpen(false)
                        }}
                        className={`
                          w-full text-left px-3 py-2 text-sm pr-8
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

                      {/* Three dots menu button — visible on hover */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          setMenuOpenId(menuOpenId === s.recordId ? null : s.recordId)
                        }}
                        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 hover:bg-muted-foreground/10 transition-opacity"
                        aria-label="Scout options"
                      >
                        <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                          <circle cx="8" cy="3" r="1.5" />
                          <circle cx="8" cy="8" r="1.5" />
                          <circle cx="8" cy="13" r="1.5" />
                        </svg>
                      </button>

                      {/* Dropdown menu */}
                      {menuOpenId === s.recordId && (
                        <div
                          ref={menuRef}
                          className="absolute top-8 right-2 z-50 bg-background border border-border rounded-md shadow-lg py-1 min-w-[120px]"
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setEditingId(s.recordId)
                              setEditTitle(s.title || "")
                              setMenuOpenId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm hover:bg-muted transition-colors"
                          >
                            Rename
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setConfirmDeleteId(s.recordId)
                              setMenuOpenId(null)
                            }}
                            className="w-full text-left px-3 py-1.5 text-sm text-red-600 hover:bg-muted transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      </aside>
    </>
  )
}
