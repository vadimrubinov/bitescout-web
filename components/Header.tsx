"use client"

import { useState } from "react"
import Link from "next/link"
import { Logo } from "./Logo"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Header() {
  const [isLoading, setIsLoading] = useState(false)

  const handleUpgrade = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
      })
      const data = await response.json()
      
      if (data.url) {
        window.location.href = data.url
      } else {
        console.error('No checkout URL returned')
      }
    } catch (error) {
      console.error('Checkout error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <header className="w-full py-4 px-4 md:px-6">
      <div className="max-w-[800px] mx-auto flex items-center justify-between">
        <Logo />
        <nav className="flex items-center gap-4">
          <Link 
            href="/about" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
          
          <SignedOut>
            <SignInButton mode="modal">
              <button className="text-muted-foreground hover:text-foreground transition-colors">
                Sign In
              </button>
            </SignInButton>
            <SignUpButton mode="modal">
              <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          
          <SignedIn>
            <button 
              onClick={handleUpgrade}
              disabled={isLoading}
              className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {isLoading ? '...' : 'Upgrade $29/yr'}
            </button>
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
