import { Search, Sparkles, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

const steps = [
  {
    icon: Search,
    title: "Tell us where",
    description: "Enter your dream fishing destination or let us suggest the best spots for your target species.",
  },
  {
    icon: Sparkles,
    title: "AI matches you",
    description: "Our AI analyzes 1,500+ charters to find the perfect match based on your preferences and budget.",
  },
  {
    icon: Calendar,
    title: "Book with confidence",
    description: "Read verified reviews, compare availability, and book directly with top-rated operators.",
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            How it works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            From dream to dock in three simple steps
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <Card 
              key={step.title} 
              className="border-0 shadow-lg hover:shadow-xl transition-shadow bg-card"
            >
              <CardContent className="p-8 text-center">
                <div className="relative mb-6">
                  <div className="w-16 h-16 mx-auto bg-[#1E3A5F]/10 rounded-2xl flex items-center justify-center">
                    <step.icon className="w-8 h-8 text-[#1E3A5F]" />
                  </div>
                  <span className="absolute -top-2 -right-2 md:right-6 lg:right-12 w-8 h-8 bg-accent text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {step.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
