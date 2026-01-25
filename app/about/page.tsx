import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 py-16 px-4 md:px-6">
        <div className="max-w-[800px] mx-auto space-y-12">
          <div className="space-y-4">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              About BiteScout
            </h1>
            <p className="text-lg text-muted-foreground">
              BiteScout is building the world&apos;s most comprehensive trophy fishing
              database — every charter, lodge, and guide, verified and searchable.
            </p>
          </div>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Why we built this
            </h2>
            <p className="text-muted-foreground">
              Planning a fishing trip shouldn&apos;t take hours of Googling. Our AI
              assistant knows the waters, the operators, and the seasons.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">
              Current coverage
            </h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• BC: 1,200+ operators</li>
              <li>• Alaska: 200+ operators</li>
              <li>• Expanding to Florida, Mexico, Norway, New Zealand</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">How it works</h2>
            <ol className="space-y-2 text-muted-foreground list-decimal list-inside">
              <li>Tell us what you&apos;re looking for</li>
              <li>AI finds best matches</li>
              <li>Compare, ask questions, get quotes</li>
            </ol>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-foreground">Contact</h2>
            <p className="text-muted-foreground">
              <a
                href="mailto:gofishing@bitescout.com"
                className="text-primary hover:underline"
              >
                gofishing@bitescout.com
              </a>
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
