import Link from "next/link"
import { Logo } from "./Logo"

export function Header() {
  return (
    <header className="w-full py-4 px-4 md:px-6">
      <div className="max-w-[800px] mx-auto flex items-center justify-between">
        <Logo />
        <nav>
          <Link 
            href="/about" 
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            About
          </Link>
        </nav>
      </div>
    </header>
  )
}
