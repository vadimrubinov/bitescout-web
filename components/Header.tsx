import Link from "next/link"
import { Logo } from "./Logo"
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'

export function Header() {
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
            <UserButton afterSignOutUrl="/" />
          </SignedIn>
        </nav>
      </div>
    </header>
  )
}
