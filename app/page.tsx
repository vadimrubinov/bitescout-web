'use client'

import { useState } from 'react'
import { HeaderNew } from '@/components/HeaderNew'
import { Hero } from '@/components/Hero'
import { HowItWorks } from '@/components/HowItWorks'
import { FeaturedDestinations } from '@/components/FeaturedDestinations'
import { Testimonials } from '@/components/Testimonials'
import { FooterNew } from '@/components/FooterNew'
import { ChatInterface } from '@/components/ChatInterface'

export default function Home() {
  const [chatQuery, setChatQuery] = useState<string | null>(null)

  const handleSearch = (query: string) => {
    setChatQuery(query)
  }

  const handleBack = () => {
    setChatQuery(null)
  }

  if (chatQuery) {
    return <ChatInterface initialQuery={chatQuery} onBack={handleBack} />
  }

  return (
    <main className="min-h-screen">
      <HeaderNew />
      <Hero onSearch={handleSearch} />
      <HowItWorks />
      <FeaturedDestinations />
      <Testimonials />
      <FooterNew />
    </main>
  )
}
