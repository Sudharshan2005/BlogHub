import { Button } from "@/components/ui/button"
import Link from "next/link"

export function HeroSection() {
  return (
    <section className="py-20 px-4 text-center bg-gradient-to-b from-muted/50 to-background">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
          Discover Amazing Stories
        </h1>
        <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
          Explore a world of knowledge, insights, and inspiration from talented writers and thought leaders.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/explore">Start Reading</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/trending">Trending Now</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
