'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface HeroProps {
  onSearch: (query: string) => void
}

export function Hero({ onSearch }: HeroProps) {
  const [query, setQuery] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (query.trim()) {
      onSearch(query)
    }
  }

  const handleExampleClick = (example: string) => {
    setQuery(example)
    onSearch(example)
  }

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
          World's most complete
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
            <Input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Where do you want to fish?"
              className="pl-12 h-14 text-base bg-white border-0 rounded-xl shadow-lg text-gray-900"
            />
          </div>
          <Button 
            type="submit"
            className="h-14 px-8 text-base font-semibold bg-[#E67E22] hover:bg-[#D35400] text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Find Charters
          </Button>
        </form>

        {/* Example Queries */}
        <div className="mb-10">
          <p className="text-white/60 text-sm mb-2">Try:</p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              'Salmon fishing in BC, July',
              'Alaska halibut charter',
              'Family-friendly fishing lodge',
            ].map((example) => (
              <button
                key={example}
                onClick={() => handleExampleClick(example)}
                className="text-sm text-white/80 hover:text-white bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-full transition-colors"
              >
                {example}
              </button>
            ))}
          </div>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-white/80 text-sm md:text-base">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-[#E67E22] rounded-full" />
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
