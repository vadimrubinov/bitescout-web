"use client"

import { useState, useEffect } from "react"

interface ChatSession {
  recordId: string
  preview: string
  createdAt: string
  status: string
}

interface SidebarProps {
  activeChatId: string | null
  onSelectChat: (chatId: string) => void
  onNewChat: () => void
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

export function Sidebar({ activeChatId, onSelectChat, onNewChat, refreshTrigger }: SidebarProps) {
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    fetch("/api/sessions", { method: "POST" })
      .then((res) => res.json())
      .then((data) => {
        setSessions(data.sessions || [])
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
        aria-label="Toggle chat history"
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
              onNewChat()
              setIsOpen(false)
            }}
            className="w-full px-3 py-2 text-sm font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            + New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <p className="p-3 text-sm text-muted-foreground">Loading...</p>
          ) : sessions.length === 0 ? (
            <p className="p-3 text-sm text-muted-foreground">No chats yet</p>
          ) : (
            <ul className="py-1">
              {sessions.map((s) => (
                <li key={s.recordId}>
                  <button
                    onClick={() => {
                      onSelectChat(s.recordId)
                      setIsOpen(false)
                    }}
                    className={`
                      w-full text-left px-3 py-2 text-sm
                      hover:bg-muted transition-colors
                      ${activeChatId === s.recordId ? "bg-muted font-medium" : ""}
                    `}
                  >
                    <p className="truncate text-foreground">
                      {s.preview || "New chat"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {formatDate(s.createdAt)}
                    </p>
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
