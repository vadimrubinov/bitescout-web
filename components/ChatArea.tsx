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
}

export function ChatArea({
  messages,
  inputValue,
  onInputChange,
  onSubmit,
  isLoading,
}: ChatAreaProps) {
  return (
    <div className="w-full space-y-4">
      <div className="space-y-4 max-h-[400px] overflow-y-auto">
        {messages.map((message, index) => (
          <ChatMessage key={index} role={message.role} content={message.content} />
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-muted rounded-lg px-4 py-3">
              <p className="text-xs font-medium mb-1 opacity-70">Scout</p>
              <div className="text-sm text-muted-foreground">Searching...</div>
            </div>
          </div>
        )}
      </div>
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
  )
}
