"use client"

import { ChatMessage } from "./ChatMessage"
import { ChatInput } from "./ChatInput"

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
}

function parseTags(raw: string): string[] {
  if (!raw) return []
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed
  } catch {
    // Fallback: comma-separated
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
    <div className="w-full rounded-lg border border-border bg-muted/20 p-5 space-y-4">
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
}: ChatAreaProps) {
  // If we have a brief, show it instead of messages
  if (scoutBrief) {
    return (
      <div className="w-full space-y-6">
        <ScoutBriefCard brief={scoutBrief} tags={scoutTags} entities={scoutEntities} />
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      <div className="space-y-6">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className="text-left">
            <p className="text-xs font-medium mb-1 opacity-70">Scout</p>
            <div className="text-sm text-muted-foreground">Searching...</div>
          </div>
        )}
      </div>
      {!disabled && (
        <ChatInput
          value={inputValue}
          onChange={onInputChange}
          onSubmit={onSubmit}
          isLoading={isLoading}
          placeholder="Ask a follow-up question..."
          buttonText="Send →"
          rows={2}
        />
      )}
    </div>
  )
}
