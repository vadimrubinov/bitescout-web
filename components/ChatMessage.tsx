import Markdown from "react-markdown"

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
      {isUser ? (
        <div className="text-sm whitespace-pre-wrap text-muted-foreground">
          {content}
        </div>
      ) : (
        <div className="text-sm text-foreground scout-markdown">
          <Markdown>{content}</Markdown>
        </div>
      )}
    </div>
  )
}
