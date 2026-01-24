import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "BiteScout — World's Most Complete Trophy Fishing Database",
  description: 'AI-powered fishing assistant. Find the perfect charter, lodge, or guide from 1,500+ verified operators worldwide.',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  openGraph: {
    title: 'BiteScout — Trophy Fishing Database',
    description: 'AI finds your perfect fishing charter in seconds.',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
