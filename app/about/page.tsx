import { Header } from "@/components/header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { PenTool, Users, BookOpen, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <PenTool className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">About BlogHub</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A modern platform for discovering and reading amazing stories from writers around the world
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Our Mission</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  We believe in the power of storytelling and knowledge sharing. BlogHub provides a platform where
                  readers can discover insightful articles, tutorials, and stories across various topics including
                  technology, design, programming, and more.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Our Community</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Join thousands of readers who discover new perspectives daily. Our community values quality content,
                  meaningful discussions, and continuous learning. Every article is carefully curated to provide value
                  to our readers.
                </p>
              </CardContent>
            </Card>
          </div>

          <Card className="mb-12">
            <CardHeader>
              <CardTitle>What We Offer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Quality Content</h3>
                  <p className="text-sm text-muted-foreground">
                    Carefully curated articles from experienced writers and industry experts
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Users className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Community</h3>
                  <p className="text-sm text-muted-foreground">
                    Engage with like-minded readers through comments and discussions
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Passion</h3>
                  <p className="text-sm text-muted-foreground">
                    Built by developers, for developers and curious minds everywhere
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <h2 className="text-2xl font-bold mb-6">Popular Topics</h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Web Development",
                "React",
                "TypeScript",
                "JavaScript",
                "CSS",
                "Design",
                "Programming",
                "AI",
                "Machine Learning",
                "DevOps",
                "Mobile Development",
                "Career",
              ].map((topic) => (
                <Badge key={topic} variant="secondary" className="text-sm">
                  {topic}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
