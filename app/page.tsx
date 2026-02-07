"use client"

import { useState, useEffect } from "react"
import { useUser } from "@clerk/nextjs"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ChatInput } from "@/components/ChatInput"
import { ChatArea } from "@/components/ChatArea"
import { ValueProps } from "@/components/ValueProps"
import { Coverage } from "@/components/Coverage"
import { GuestBanner } from "@/components/GuestBanner"
import { LimitBanner } from "@/components/LimitBanner"
import { Sidebar } from "@/components/Sidebar"

interface Message {
  role: "user" | "assistant"
  content: string
}

const exampleQueries = [
  "Best halibut charters in Alaska",
  "Cheapest salmon fishing near Vancouver",
]

export default function Home() {
  const { isSignedIn } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [scoutId, setScoutId] = useState<string | null>(null)
  const [remainingMessages, setRemainingMessages] = useState<number | null>(null)
  const [limitReached, setLimitReached] = useState(false)
  const [sidebarRefresh, setSidebarRefresh] = useState(0)

  const isGuest = !isSignedIn

  // Fetch plan info when auth state changes
  useEffect(() => {
    if (isSignedIn) {
      fetch("/api/plan-info", { method: "POST" })
        .then(res => res.json())
        .then(data => {
          setRemainingMessages(data.remainingMessages ?? null)
          setLimitReached(data.limitReached || false)
        })
        .catch(() => {})
    }
  }, [isSignedIn])

  const handleSubmit = async () => {
    if (!inputValue.trim() || isLoading || limitReached) return

    const userMessage = inputValue.trim()
    setInputValue("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setHasStartedChat(true)
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage, sessionId, chatId, scoutId }),
      })

      const data = await response.json()
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply }])
      
      if (data.sessionId) setSessionId(data.sessionId)
      if (data.chatId) setChatId(data.chatId)
      if (data.scoutId) setScoutId(data.scoutId)
      if (data.remainingMessages !== null && data.remainingMessages !== undefined) {
        setRemainingMessages(data.remainingMessages)
      }
      if (data.limitReached) setLimitReached(true)

      // Refresh sidebar after first message (new scout appears in list)
      if (!scoutId && data.scoutId) {
        setSidebarRefresh((n) => n + 1)
      }
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

  const handleNewScout = async () => {
    // Tell backend to complete current active scout
    if (isSignedIn) {
      try {
        await fetch("/api/new-scout", { method: "POST" })
      } catch {
        // Non-critical
      }
    }

    setMessages([])
    setSessionId(null)
    setChatId(null)
    setScoutId(null)
    setHasStartedChat(false)
    setLimitReached(false)
    setSidebarRefresh((n) => n + 1)
  }

  const handleSelectScout = async (selectedScoutId: string) => {
    setScoutId(selectedScoutId)
    setSessionId(null)
    setChatId(null)
    setHasStartedChat(true)
    setMessages([])
    setIsLoading(true)

    try {
      const res = await fetch("/api/scout-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoutId: selectedScoutId }),
      })
      const data = await res.json()
      const msgs: Message[] = (data.messages || []).map((m: any) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }))
      setMessages(msgs)
    } catch {
      setMessages([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 flex">
        {/* Sidebar for logged-in users */}
        {isSignedIn && (
          <Sidebar
            activeScoutId={scoutId}
            onSelectScout={handleSelectScout}
            onNewScout={handleNewScout}
            refreshTrigger={sidebarRefresh}
          />
        )}

        <main className="flex-1 min-w-0">
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
                <div className="max-w-[600px] mx-auto space-y-4">
                  <ChatArea
                    messages={messages}
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                    disabled={limitReached}
                  />

                  {/* Remaining messages indicator */}
                  {remainingMessages !== null && !limitReached && (
                    <p className="text-xs text-muted-foreground text-center">
                      {remainingMessages} message{remainingMessages !== 1 ? "s" : ""} remaining today
                    </p>
                  )}

                  {/* Limit reached banner */}
                  {limitReached && (
                    <LimitBanner isGuest={isGuest} />
                  )}

                  {/* Guest banner - show after first exchange */}
                  {isGuest && !limitReached && messages.length >= 2 && (
                    <GuestBanner />
                  )}
                </div>
              )}
            </div>
          </section>

          {!hasStartedChat && (
            <>
              <ValueProps />
              <Coverage />
            </>
          )}
        </main>
      </div>

      {!hasStartedChat && <Footer />}
    </div>
  )
}
