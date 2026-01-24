import { Star, Quote } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const testimonials = [
  {
    id: 1,
    name: "Mike Richardson",
    location: "Seattle, WA",
    initials: "MR",
    rating: 5,
    text: "BiteScout matched me with a charter in Ketchikan that I never would have found on my own. Landed a 180lb halibut on day one. The AI recommendation was spot-on for what I was looking for.",
  },
  {
    id: 2,
    name: "Sarah Chen",
    location: "Vancouver, BC",
    initials: "SC",
    rating: 5,
    text: "As a first-time charter fisher, I was overwhelmed by options. BiteScout made it easy to find a family-friendly operator in Campbell River. The kids still talk about catching their first salmon!",
  },
  {
    id: 3,
    name: "Tom Bradley",
    location: "Denver, CO",
    initials: "TB",
    rating: 5,
    text: "I've been planning fishing trips for 20 years. BiteScout's database is the most comprehensive I've ever seen. The verified reviews saved me from booking a dud charter.",
  },
]

export function Testimonials() {
  return (
    <section className="py-20 md:py-28 px-4 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Trusted by anglers worldwide
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Join thousands of fishers who found their perfect catch
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <Card 
              key={testimonial.id}
              className="border-0 shadow-lg bg-card"
            >
              <CardContent className="p-6">
                <Quote className="w-10 h-10 text-accent/30 mb-4" />
                <p className="text-foreground/90 leading-relaxed mb-6">
                  "{testimonial.text}"
                </p>
                <div className="flex items-center gap-4">
                  <Avatar className="w-12 h-12 bg-[#1E3A5F]">
                    <AvatarFallback className="bg-[#1E3A5F] text-white font-medium">
                      {testimonial.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-foreground">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                  </div>
                </div>
                <div className="flex gap-1 mt-4">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-accent text-accent" />
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
