"use client"

import { Fish, Menu, X } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navLinks = [
  { label: "Find Charters", href: "#" },
  { label: "Destinations", href: "#" },
  { label: "How It Works", href: "#" },
  { label: "For Operators", href: "#" },
]

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="absolute top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <Fish className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold text-white">BiteScout</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-white/80 hover:text-white transition-colors text-sm font-medium"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center gap-3">
            <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white">
              Sign In
            </Button>
            <Button className="bg-accent hover:bg-accent/90 text-white">
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
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-white/80 hover:text-white transition-colors text-sm font-medium py-2"
                >
                  {link.label}
                </Link>
              ))}
              <hr className="border-white/20" />
              <Button variant="ghost" className="text-white hover:bg-white/10 hover:text-white justify-start">
                Sign In
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-white">
                Get Started
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
