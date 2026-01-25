import { Check } from "lucide-react"

const props = [
  "AI finds best matches",
  "Compare operators side-by-side",
  "Request quotes with one click",
]

export function ValueProps() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-[800px] mx-auto">
        <div className="flex flex-col md:flex-row md:justify-center gap-6 md:gap-12">
          {props.map((prop) => (
            <div key={prop} className="flex items-center gap-2 text-muted-foreground">
              <Check className="h-5 w-5 text-primary flex-shrink-0" />
              <span>{prop}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
