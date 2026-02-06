"use client"

import { SignUpButton } from "@clerk/nextjs"

interface LimitBannerProps {
  isGuest: boolean
}

export function LimitBanner({ isGuest }: LimitBannerProps) {
  if (isGuest) {
    return (
      <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20 text-center space-y-2">
        <p className="text-sm font-medium text-foreground">
          You&apos;ve used all your free messages for today
        </p>
        <p className="text-sm text-muted-foreground">
          Create a free account to get more messages and save your chat history.
        </p>
        <SignUpButton mode="modal">
          <button className="mt-1 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors text-sm font-medium">
            Sign up free →
          </button>
        </SignUpButton>
      </div>
    )
  }

  return (
    <div className="border border-amber-500/30 rounded-lg p-4 bg-amber-50 dark:bg-amber-950/20 text-center space-y-2">
      <p className="text-sm font-medium text-foreground">
        You&apos;ve reached your daily message limit
      </p>
      <p className="text-sm text-muted-foreground">
        Upgrade to Pro for more messages and exclusive features.
      </p>
      <button
        onClick={async () => {
          try {
            const res = await fetch("/api/checkout", { method: "POST" })
            const data = await res.json()
            if (data.url) window.location.href = data.url
          } catch (e) {
            console.error("Checkout error:", e)
          }
        }}
        className="mt-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-medium"
      >
        Upgrade to Pro →
      </button>
    </div>
  )
}
