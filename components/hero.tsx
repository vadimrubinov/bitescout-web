"use client"

import { useState } from "react"
import { Search, Send, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function Hero() {
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isChatMode, setIsChatMode] = useState(false)

  const sendMessage = async (text: string) => {
    if (!text.trim()) return

    const userMessage: Message = { role: 'user', content: text }
    setMessages(prev => [...prev, userMessage])
    setQuery("")
    setIsLoading(true)
    setIsChatMode(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      })

      const data = await response.json()
      const assistantMessage: Message = {
        role: 'assistant',
        content: data.reply || 'Sorry, I encountered an error. Please try again.',
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch {
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: 'Sorry, something went wrong. Please try again.' },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(query)
  }

  const handleExampleClick = (example: string) => {
    sendMessage(example)
  }

  const handleBack = () => {
    setIsChatMode(false)
    setMessages([])
  }

  // Chat mode UI
  if (isChatMode) {
    return (
      <section className="min-h-screen bg-gray-50">
        {/* Chat Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-4">
            <button onClick={handleBack} className="text-gray-600 hover:text-gray-900">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <h1 className="font-semibold text-[#1E3A5F]">BiteScout</h1>
          </div>
        </header>

        {/* Messages */}
        <div className="max-w-3xl mx-auto px-4 py-6 pb-32">
          <div className="space-y-4">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === 'user'
                      ? 'bg-[#1E3A5F] text-white'
                      : 'bg-white border shadow-sm text-gray-800'
                  }`}
                >
                  <div className="whitespace-pre-wrap text-sm md:text-base">{msg.content}</div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white border shadow-sm rounded-2xl px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto px-4 py-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask a follow-up question..."
                className="flex-1 rounded-full border border-gray-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E3A5F] focus:border-transparent"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !query.trim()}
                className="rounded-full w-10 h-10 p-0 bg-[#1E3A5F] hover:bg-[#2d4a6f]"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>
    )
  }

  // Landing page UI
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1544551763-46a013bb70d5?q=80&w=2070')",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/70 via-[#1E3A5F]/50 to-[#1E3A5F]/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
          World&apos;s most complete
          <br />
          trophy fishing database
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          AI finds your perfect charter in seconds
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to fish?"
              className="w-full pl-12 pr-4 h-14 text-base bg-white border-0 rounded-xl shadow-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#3B82F6]"
            />
          </div>
          <Button 
            type="submit"
            disabled={!query.trim()}
            className="h-14 px-8 text-base font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl shadow-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          >
            Find Charters
          </Button>
        </form>

        {/* Example Queries */}
        <div className="mb-10">
          <p className="text-white/60 text-sm mb-3">Try:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Salmon fishing in BC, July',
              'Alaska halibut charter',
              'Family-friendly fishing lodge',
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 text-sm md:text-base">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#3B82F6] rounded-full" />
            1,500+ operators
          </span>
          <span className="text-white/40">•</span>
          <span>BC & Alaska</span>
          <span className="text-white/40">•</span>
          <span>Expanding worldwide</span>
        </div>
      </div>
    </section>
  )
}
