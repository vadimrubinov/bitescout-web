import Image from "next/image"
import { MapPin, Star, Fish } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const destinations = [
  {
    id: 1,
    title: "BC Salmon Run",
    location: "British Columbia, Canada",
    image: "/images/bc-salmon.jpg",
    species: "King Salmon, Coho, Sockeye",
    rating: 4.9,
    reviews: 324,
    tag: "Peak Season",
  },
  {
    id: 2,
    title: "Alaska Halibut",
    location: "Seward, Alaska",
    image: "/images/alaska-halibut.jpg",
    species: "Halibut, Lingcod, Rockfish",
    rating: 4.8,
    reviews: 512,
    tag: "Most Popular",
  },
]

export function FeaturedDestinations() {
  return (
    <section className="py-20 md:py-28 px-4 bg-secondary">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Featured destinations
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our most sought-after trophy fishing experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <Card 
              key={destination.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-card"
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <Image
                  src={destination.image || "/placeholder.svg"}
                  alt={destination.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-accent text-white border-0">
                  {destination.tag}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">
                    {destination.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-accent text-accent" />
                    <span className="font-medium text-foreground">{destination.rating}</span>
                    <span className="text-muted-foreground">({destination.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination.location}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Fish className="w-4 h-4" />
                  <span className="text-sm">{destination.species}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
