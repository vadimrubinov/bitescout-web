interface ChatMessageProps {
  role: "user" | "assistant"
  content: string
}

export function ChatMessage({ role, content }: ChatMessageProps) {
  const isUser = role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 ${
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-foreground"
        }`}
      >
        <p className="text-xs font-medium mb-1 opacity-70">
          {isUser ? "You" : "Scout"}
        </p>
        <div className="text-sm whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  )
}
