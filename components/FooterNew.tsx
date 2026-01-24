import { Fish } from 'lucide-react'
import Link from 'next/link'

export function FooterNew() {
  return (
    <footer className="bg-[#1E3A5F] text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Logo & Description */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-[#E67E22] rounded-lg flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold">BiteScout</span>
            </Link>
            <p className="text-white/70 text-sm leading-relaxed">
              The world's most complete trophy fishing charter database.
            </p>
          </div>

          {/* Explore */}
          <div>
            <h4 className="font-semibold mb-4">Explore</h4>
            <ul className="space-y-2">
              <li><Link href="#" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">Find Charters</Link></li>
              <li><Link href="#destinations" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">Destinations</Link></li>
              <li><Link href="#how-it-works" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">How It Works</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">About Us</Link></li>
              <li><Link href="mailto:gofishing@bitescout.com" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li><Link href="mailto:gofishing@bitescout.com" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">Help Center</Link></li>
              <li><Link href="#" className="text-white/70 hover:text-[#E67E22] transition-colors text-sm">List Your Charter</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10">
          <p className="text-center text-white/50 text-sm">
            © {new Date().getFullYear()} BiteScout. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
