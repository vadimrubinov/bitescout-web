import Link from "next/link"

export function Footer() {
  return (
    <footer className="w-full py-8 px-4 md:px-6 border-t border-border">
      <div className="max-w-[800px] mx-auto text-center text-sm text-muted-foreground">
        <p>
          © 2026 BiteScout •{" "}
          <Link href="/about" className="hover:text-foreground transition-colors">
            About
          </Link>{" "}
          •{" "}
          <a 
            href="mailto:gofishing@bitescout.com" 
            className="hover:text-foreground transition-colors"
          >
            Contact
          </a>
        </p>
      </div>
    </footer>
  )
}
