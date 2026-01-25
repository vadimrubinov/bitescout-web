"use client"

import { useState } from "react"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ChatInput } from "@/components/ChatInput"
import { ChatArea } from "@/components/ChatArea"
import { ValueProps } from "@/components/ValueProps"
import { Coverage } from "@/components/Coverage"

interface Message {
  role: "user" | "assistant"
  content: string
}

const exampleQueries = [
  "Best halibut charters in Alaska",
  "Cheapest salmon fishing near Vancouver",
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setHasStartedChat(true)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, something went wrong. Please try again." },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleExampleClick = (query: string) => {
    setInputValue(query)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4 md:px-6">
          <div className="max-w-[800px] mx-auto text-center space-y-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
              World&apos;s most complete trophy fishing database
            </h1>

            {!hasStartedChat ? (
              <div className="max-w-[600px] mx-auto space-y-4">
                <ChatInput
                  value={inputValue}
                  onChange={setInputValue}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  placeholder="Salmon fishing in BC, July, 4 people, budget around $1500..."
                  buttonText="Ask Scout →"
                  rows={3}
                />
                <p className="text-sm text-muted-foreground">
                  Try:{" "}
                  {exampleQueries.map((query, index) => (
                    <span key={query}>
                      <button
                        onClick={() => handleExampleClick(query)}
                        className="text-primary hover:underline"
                      >
                        {query}
                      </button>
                      {index < exampleQueries.length - 1 && " • "}
                    </span>
                  ))}
                </p>
              </div>
            ) : (
              <div className="max-w-[600px] mx-auto">
                <ChatArea
                  messages={messages}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </section>

        <ValueProps />
        <Coverage />
      </main>

      <Footer />
    </div>
  )
}
