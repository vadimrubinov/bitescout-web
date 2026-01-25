interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className="text-left">
      <p className="text-xs font-medium mb-1 opacity-70">
        {isUser ? "You" : "Scout"}
      </p>
      <div className={`text-sm whitespace-pre-wrap ${isUser ? "text-muted-foreground" : "text-foreground"}`}>
        {content}
      </div>
    </div>
  )
}
