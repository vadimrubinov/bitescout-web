"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/images/hero-fishing.jpg')" }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[#1E3A5F]/60 via-[#1E3A5F]/40 to-[#1E3A5F]/70" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight text-balance">
          World's most complete trophy fishing database
        </h1>
        <p className="text-lg md:text-xl text-white/90 mb-10 max-w-2xl mx-auto">
          AI finds your perfect charter in seconds
        </p>

        {/* Search Bar */}
        <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto mb-10">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Where do you want to fish?"
              className="pl-12 h-14 text-base bg-white border-0 rounded-xl shadow-lg focus-visible:ring-2 focus-visible:ring-accent text-foreground"
            />
          </div>
          <Button 
            className="h-14 px-8 text-base font-semibold bg-[#3B82F6] hover:bg-[#2563EB] text-white rounded-xl shadow-lg transition-all hover:scale-105"
          >
            Find Charters
          </Button>
        </div>

        {/* Trust Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-white/80 text-sm md:text-base">
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full" />
            1,500+ operators
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full sm:hidden" />
            BC & Alaska
          </span>
          <span className="hidden sm:inline text-white/40">•</span>
          <span className="flex items-center gap-2">
            <span className="w-2 h-2 bg-accent rounded-full sm:hidden" />
            Expanding worldwide
          </span>
        </div>
      </div>
    </section>
  )
}
