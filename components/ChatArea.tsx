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
}

export function ChatArea({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
  disabled = false,
}: ChatAreaProps) {
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
