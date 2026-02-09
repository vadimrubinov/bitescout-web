"use client"

import { useEffect, useRef } from "react"
import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"
import { Skeleton } from "@/components/ui/skeleton"

interface Message {
  role: "user" | "assistant"
  content: string
}

interface ChatAreaProps {
  messages: Message[]
  inputValue: string
  onInputChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  disabled?: boolean
  scoutBrief?: string | null
  scoutTags?: string
  scoutEntities?: string
  isLoadingMessages?: boolean
}

function parseTags(raw: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {
    return raw.split(",").map((t: string) => t.trim()).filter(Boolean)
  }
  return []
}

function parseEntities(raw: string): Array<{ name: string; vendor_id?: string; type?: string }> {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {}
  return []
}

function MessagesSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i} className="text-left space-y-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  )
}

function ScoutBriefCard({
  brief,
  tags,
  entities,
}: {
  brief: string
  tags: string
  entities: string
}) {
  const parsedTags = parseTags(tags)
  const parsedEntities = parseEntities(entities)

  return (
    <div className="w-full rounded-lg border border-border bg-muted/20 p-5 space-y-4 text-left">
      <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
        <span>📋</span>
        <span>Scout Summary</span>
      </div>

      <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
        {brief}
      </div>

      {parsedTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {parsedTags.map((tag, i) => (
            <span
              key={i}
              className="inline-block px-2 py-0.5 text-xs rounded-full bg-primary/10 text-primary font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {parsedEntities.length > 0 && (
        <div className="border-t border-border pt-3 space-y-1">
          <p className="text-xs font-medium text-muted-foreground">Mentioned charters</p>
          {parsedEntities.map((entity, i) => (
            <p key={i} className="text-sm text-foreground">
              🎣 {entity.name}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export function ChatArea({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  disabled = false,
  scoutBrief,
  scoutTags = "",
  scoutEntities = "",
  isLoadingMessages = false,
}: ChatAreaProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, isLoading])

  // Loading messages (opening a scout)
  if (isLoadingMessages) {
    return (
      <div className="w-full flex-1">
        <MessagesSkeleton />
      </div>
    )
  }

  // Completed scout with brief — show brief + input for continuation
  if (scoutBrief) {
    return (
      <div className="w-full flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto">
          <ScoutBriefCard brief={scoutBrief} tags={scoutTags} entities={scoutEntities} />
        </div>
        {!disabled && (
          <div className="shrink-0 pt-4">
            <ChatInput
              value={inputValue}
              onChange={onInputChange}
              onSubmit={onSubmit}
              isLoading={isLoading}
              placeholder="Continue this conversation..."
              buttonText="Send →"
              rows={2}
            />
          </div>
        )}
      </div>
    )
  }

  // Active chat — scrollable messages + sticky input
  return (
    <div className="w-full flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className="text-left">
            <p className="text-xs font-medium mb-1 opacity-70">Scout</p>
            <div className="text-sm text-muted-foreground">Searching...</div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      {!disabled && (
        <div className="shrink-0 pt-4">
          <ChatInput
            value={inputValue}
            onChange={onInputChange}
            onSubmit={onSubmit}
            isLoading={isLoading}
            placeholder="Ask a follow-up question..."
            buttonText="Send →"
            rows={2}
          />
        </div>
      )}
    </div>
  )
}
