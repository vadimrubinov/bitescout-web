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
import { ErrorBoundary } from "@/components/ErrorBoundary"

interface Message {
  role: "user" | "assistant"
  content: string
}

const exampleQueries = [
  "Best halibut charters in Alaska",
  "Cheapest salmon fishing near Vancouver",
]

function HomeContent() {
  const { isSignedIn } = useUser()
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMessages, setIsLoadingMessages] = useState(false)
  const [hasStartedChat, setHasStartedChat] = useState(false)
  const [sessionId, setSessionId] = useState<string | null>(null)
  const [chatId, setChatId] = useState<string | null>(null)
  const [scoutId, setScoutId] = useState<string | null>(null)
  const [scoutBrief, setScoutBrief] = useState<string | null>(null)
  const [scoutTags, setScoutTags] = useState<string>("")
  const [scoutEntities, setScoutEntities] = useState<string>("")
  const [scoutStatus, setScoutStatus] = useState<string>("active")
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
    setScoutBrief(null)
    setScoutStatus("active")
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
    setScoutBrief(null)
    setScoutTags("")
    setScoutEntities("")
    setScoutStatus("active")
    setHasStartedChat(false)
    setLimitReached(false)
    setSidebarRefresh((n) => n + 1)
  }

  const handleScoutDeleted = (deletedScoutId: string) => {
    if (scoutId === deletedScoutId) {
      setMessages([])
      setSessionId(null)
      setChatId(null)
      setScoutId(null)
      setScoutBrief(null)
      setScoutTags("")
      setScoutEntities("")
      setScoutStatus("active")
      setHasStartedChat(false)
    }
  }

  const handleSelectScout = async (selectedScoutId: string) => {
    setScoutId(selectedScoutId)
    setSessionId(null)
    setChatId(null)
    setHasStartedChat(true)
    setMessages([])
    setScoutBrief(null)
    setScoutTags("")
    setScoutEntities("")
    setScoutStatus("active")
    setIsLoadingMessages(true)

    try {
      const res = await fetch("/api/scout-messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scoutId: selectedScoutId }),
      })
      const data = await res.json()

      if (data.type === "brief") {
        // Completed/archived scout — show brief card
        setScoutBrief(data.briefUser || data.brief || "")
        setScoutTags(data.tags || "")
        setScoutEntities(data.entities || "")
        setScoutStatus(data.status || "completed")
        setMessages([])
      } else {
        // Active scout — show raw messages
        setScoutBrief(null)
        const msgs: Message[] = (data.messages || []).map((m: { role: string; content: string }) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        }))
        setMessages(msgs)
      }
    } catch {
      setMessages([])
    } finally {
      setIsLoadingMessages(false)
    }
  }

  return (
    <div className={hasStartedChat ? "h-screen flex flex-col" : "min-h-screen flex flex-col"}>
      <div className="shrink-0">
        <Header />
      </div>

      <div className={`flex-1 flex${hasStartedChat ? " min-h-0" : ""}`}>
        {/* Sidebar for logged-in users */}
        {isSignedIn && (
          <Sidebar
            activeScoutId={scoutId}
            onSelectScout={handleSelectScout}
            onNewScout={handleNewScout}
            onScoutDeleted={handleScoutDeleted}
            refreshTrigger={sidebarRefresh}
          />
        )}

        {hasStartedChat ? (
          /* Chat mode — sticky input layout */
          <main className="flex-1 min-w-0 flex flex-col">
            <div className="flex-1 flex flex-col min-h-0 px-4 md:px-6 pt-6 pb-4">
              <div className="max-w-[600px] mx-auto w-full flex-1 flex flex-col min-h-0">
                <ChatArea
                  messages={messages}
                  inputValue={inputValue}
                  onInputChange={setInputValue}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  isLoadingMessages={isLoadingMessages}
                  disabled={limitReached}
                  scoutBrief={scoutBrief}
                  scoutTags={scoutTags}
                  scoutEntities={scoutEntities}
                />

                {/* Remaining messages indicator */}
                {remainingMessages !== null && !limitReached && (
                  <p className="text-xs text-muted-foreground text-center shrink-0 pt-2">
                    {remainingMessages} message{remainingMessages !== 1 ? "s" : ""} remaining today
                  </p>
                )}

                {/* Limit reached banner */}
                {limitReached && (
                  <div className="shrink-0 pt-2">
                    <LimitBanner isGuest={isGuest} />
                  </div>
                )}

                {/* Guest banner - show after first exchange */}
                {isGuest && !limitReached && messages.length >= 2 && (
                  <div className="shrink-0 pt-2">
                    <GuestBanner />
                  </div>
                )}
              </div>
            </div>
          </main>
        ) : (
          /* Hero mode — normal scroll layout */
          <main className="flex-1 min-w-0">
            <section className="py-16 md:py-24 px-4 md:px-6">
              <div className="max-w-[800px] mx-auto text-center space-y-8">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground text-balance">
                  World&apos;s most complete trophy fishing database
                </h1>

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
              </div>
            </section>

            <ValueProps />
            <Coverage />
          </main>
        )}
      </div>

      <div className="shrink-0">
        <Footer />
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <ErrorBoundary>
      <HomeContent />
    </ErrorBoundary>
  )
}


