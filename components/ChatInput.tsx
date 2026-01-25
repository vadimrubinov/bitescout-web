"use client"

import React from "react"

import { Button } from "@/components/ui/button"

interface ChatInputProps {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  isLoading: boolean
  placeholder?: string
  buttonText?: string
  rows?: number
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  isLoading,
  placeholder = "Type your message...",
  buttonText = "Send →",
  rows = 3,
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      if (value.trim() && !isLoading) {
        onSubmit()
      }
    }
  }

  return (
    <div className="space-y-3">
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        rows={rows}
        disabled={isLoading}
        className="w-full px-4 py-3 text-base border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
      />
      <Button
        onClick={onSubmit}
        disabled={!value.trim() || isLoading}
        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
      >
        {isLoading ? "Thinking..." : buttonText}
      </Button>
    </div>
  )
}
