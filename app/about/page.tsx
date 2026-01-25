import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <header className="border-b">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="text-xl font-bold text-[#1E3A5F]">
            BiteScout
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">About BiteScout</h1>
        
        <div className="prose prose-lg">
          <p className="text-gray-600 mb-6">
            BiteScout is building the world&apos;s most comprehensive trophy fishing 
            database — every charter, lodge, and guide, verified and searchable.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Why we built this</h2>
          <p className="text-gray-600 mb-6">
            Planning a fishing trip shouldn&apos;t take hours of Googling. 
            Our AI assistant knows the waters, the operators, and the seasons.
          </p>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Current coverage</h2>
          <ul className="text-gray-600 mb-6 list-disc pl-6">
            <li><strong>British Columbia:</strong> 1,200+ operators</li>
            <li><strong>Alaska:</strong> 200+ operators</li>
            <li><strong>Expanding:</strong> Florida, Mexico, Norway, New Zealand...</li>
          </ul>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">How it works</h2>
          <ol className="text-gray-600 mb-6 list-decimal pl-6">
            <li>Tell us what you&apos;re looking for</li>
            <li>AI finds the best matches from our database</li>
            <li>Compare, ask questions, get quotes</li>
          </ol>

          <h2 className="text-xl font-semibold text-gray-900 mt-8 mb-4">Contact</h2>
          <p className="text-gray-600 mb-6">
            Questions? Feedback? Email us: <a href="mailto:gofishing@bitescout.com" className="text-[#1E3A5F] underline">gofishing@bitescout.com</a>
          </p>
        </div>

        <div className="mt-12 pt-8 border-t text-center text-gray-500 text-sm">
          © 2026 BiteScout
        </div>
      </main>
    </div>
  )
}
