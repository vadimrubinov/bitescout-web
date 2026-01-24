'use client'

import { Fish, Menu, X } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

export function HeaderNew() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-[#E67E22] rounded-lg flex items-center justify-center">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BiteScout</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#how-it-works" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              How It Works
            </Link>
            <Link href="#destinations" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              Destinations
            </Link>
            <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium">
              About
            </Link>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white">
              Get Started
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 p-4 bg-[#1E3A5F]/95 backdrop-blur-sm rounded-xl">
            <div className="flex flex-col gap-4">
              <Link href="#how-it-works" className="text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                How It Works
              </Link>
              <Link href="#destinations" className="text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                Destinations
              </Link>
              <Link href="/about" className="text-white/80 hover:text-white transition-colors text-sm font-medium py-2">
                About
              </Link>
              <hr className="border-white/20" />
              <Button className="bg-[#E67E22] hover:bg-[#D35400] text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
