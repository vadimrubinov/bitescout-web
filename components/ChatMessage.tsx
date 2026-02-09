import ReactMarkdown from "react-markdown"

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
        <div className="text-sm text-foreground">
          <ReactMarkdown
            components={{
              p: ({ children }) => (
                <p className="mb-2 last:mb-0">{children}</p>
              ),
              ol: ({ children }) => (
                <ol className="list-decimal list-inside space-y-1 mb-2">{children}</ol>
              ),
              ul: ({ children }) => (
                <ul className="list-disc list-inside space-y-1 mb-2">{children}</ul>
              ),
              li: ({ children }) => (
                <li className="ml-1">{children}</li>
              ),
              strong: ({ children }) => (
                <strong className="font-semibold">{children}</strong>
              ),
              a: ({ href, children }) => (
                <a href={href} className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                  {children}
                </a>
              ),
            }}
          >
            {content}
          </ReactMarkdown>
        </div>
      )}
    </div>
  )
}
