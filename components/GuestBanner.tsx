"use client"

import { SignUpButton } from "@clerk/nextjs"

export function GuestBanner() {
  return (
    <div className="border border-border rounded-lg p-3 bg-muted/50 text-center">
      <p className="text-sm text-muted-foreground">
        Sign up for free to save your chats and get more messages.{" "}
        <SignUpButton mode="modal">
          <button className="text-primary font-medium hover:underline">
            Create account →
          </button>
        </SignUpButton>
      </p>
    </div>
  )
}
