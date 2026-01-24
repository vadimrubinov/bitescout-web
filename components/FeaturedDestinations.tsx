import { MapPin, Star, Fish } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

const destinations = [
  {
    id: 1,
    title: 'BC Salmon Run',
    location: 'British Columbia, Canada',
    image: 'https://images.unsplash.com/photo-1583212292454-1fe6229603b7?q=80&w=800',
    species: 'King Salmon, Coho, Sockeye',
    rating: 4.9,
    reviews: 324,
    tag: 'Peak Season',
  },
  {
    id: 2,
    title: 'Alaska Halibut',
    location: 'Seward, Alaska',
    image: 'https://images.unsplash.com/photo-1545816250-e12bedba42ba?q=80&w=800',
    species: 'Halibut, Lingcod, Rockfish',
    rating: 4.8,
    reviews: 512,
    tag: 'Most Popular',
  },
]

export function FeaturedDestinations() {
  return (
    <section id="destinations" className="py-20 md:py-28 px-4 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Featured destinations
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our most sought-after trophy fishing experiences
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {destinations.map((destination) => (
            <Card 
              key={destination.id}
              className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              <div className="relative h-64 md:h-72 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <Badge className="absolute top-4 left-4 bg-[#E67E22] text-white border-0">
                  {destination.tag}
                </Badge>
              </div>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {destination.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-[#E67E22] text-[#E67E22]" />
                    <span className="font-medium text-gray-900">{destination.rating}</span>
                    <span className="text-gray-500">({destination.reviews})</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm">{destination.location}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
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
