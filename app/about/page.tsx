export default function AboutPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">About BiteScout</h1>
      
      <div className="prose prose-gray max-w-none space-y-6">
        <p className="text-lg text-gray-700">
          BiteScout is building the world's most comprehensive trophy fishing database — 
          every charter, lodge, and guide, verified and searchable.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Why we built this</h2>
        <p className="text-gray-700">
          Planning a fishing trip shouldn't take hours of Googling. Our AI assistant 
          knows the waters, the operators, and the seasons. Ask anything and get 
          personalized recommendations in seconds.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Current coverage</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li><strong>British Columbia:</strong> 1,200+ operators</li>
          <li><strong>Alaska:</strong> 200+ operators</li>
        </ul>
        <p className="text-gray-500 text-sm">
          Coming soon: Florida, Mexico, Norway, New Zealand, and more.
        </p>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">How it works</h2>
        <ol className="list-decimal list-inside text-gray-700 space-y-1">
          <li>Tell us what you're looking for (species, location, dates, budget)</li>
          <li>AI finds the best matches from our verified database</li>
          <li>Compare operators, ask follow-up questions, request quotes</li>
        </ol>

        <h2 className="text-xl font-semibold text-gray-900 mt-8">Contact</h2>
        <p className="text-gray-700">
          Questions? Feedback? We'd love to hear from you.
          <br />
          Email: <a href="mailto:gofishing@bitescout.com" className="text-primary hover:underline">gofishing@bitescout.com</a>
        </p>
      </div>

      <div className="mt-12">
        <a 
          href="/" 
          className="inline-flex items-center text-primary hover:underline"
        >
          ← Back to search
        </a>
      </div>
    </div>
  );
}
