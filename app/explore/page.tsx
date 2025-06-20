"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, Star } from "lucide-react"

interface Blog {
  id: string
  title: string
  excerpt: string
  author: {
    name: string
    avatar?: string
  }
  createdAt: string
  readTime: number
  tags: string[]
  likes: number
  views: number
  image?: string
}

// Mock data for different categories
const mockBlogs = {
  trending: [
    {
      id: "1",
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt:
        "Explore the latest trends shaping the future of web development, from AI integration to new frameworks and tools.",
      author: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-15T10:00:00Z",
      readTime: 8,
      tags: ["Web Development", "Technology", "AI"],
      likes: 245,
      views: 1520,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Building Scalable React Applications: Best Practices",
      excerpt: "Learn how to structure and build React applications that can scale with your business needs.",
      author: { name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-12T14:30:00Z",
      readTime: 12,
      tags: ["React", "JavaScript", "Architecture"],
      likes: 189,
      views: 980,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "3",
      title: "Understanding TypeScript: A Comprehensive Guide",
      excerpt: "Dive deep into TypeScript and learn how it can improve your JavaScript development experience.",
      author: { name: "David Kim", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-14T16:20:00Z",
      readTime: 10,
      tags: ["TypeScript", "JavaScript", "Programming"],
      likes: 203,
      views: 1340,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  recent: [
    {
      id: "4",
      title: "CSS Grid vs Flexbox: When to Use Which",
      excerpt: "A practical guide to choosing between CSS Grid and Flexbox for your layout needs.",
      author: { name: "Lisa Wang", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-13T11:45:00Z",
      readTime: 7,
      tags: ["CSS", "Layout", "Design"],
      likes: 167,
      views: 890,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "5",
      title: "Getting Started with Next.js 14: New Features",
      excerpt: "Explore the latest features in Next.js 14, including the new App Router and Server Components.",
      author: { name: "Alex Thompson", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-11T13:30:00Z",
      readTime: 9,
      tags: ["Next.js", "React", "Web Development"],
      likes: 298,
      views: 1650,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  featured: [
    {
      id: "6",
      title: "The Art of Technical Writing: Communicating Complex Ideas",
      excerpt: "Master the skills needed to write clear, engaging technical content that helps developers learn.",
      author: { name: "Emily Rodriguez", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-10T09:15:00Z",
      readTime: 6,
      tags: ["Writing", "Communication", "Career"],
      likes: 156,
      views: 742,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
}

const categories = ["All", "Technology", "Programming", "Design", "Career", "AI", "Web Development"]

export default function ExplorePage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [activeTab, setActiveTab] = useState("trending")
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockBlogs[activeTab as keyof typeof mockBlogs])
      setLoading(false)
    }, 1000)
  }, [activeTab])

  const filteredBlogs =
    selectedCategory === "All" ? blogs : blogs.filter((blog) => blog.tags.includes(selectedCategory))

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Explore Amazing Content</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover insightful articles, tutorials, and stories from our community of writers
            </p>
          </div>

          {/* Category Filter */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Badge
                    key={category}
                    variant={selectedCategory === category ? "default" : "secondary"}
                    className="cursor-pointer"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Content Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="trending" className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4" />
                <span>Trending</span>
              </TabsTrigger>
              <TabsTrigger value="recent" className="flex items-center space-x-2">
                <Clock className="h-4 w-4" />
                <span>Recent</span>
              </TabsTrigger>
              <TabsTrigger value="featured" className="flex items-center space-x-2">
                <Star className="h-4 w-4" />
                <span>Featured</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="trending" className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="recent" className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="featured" className="mt-8">
              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredBlogs.map((blog) => (
                    <BlogCard key={blog.id} blog={blog} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              Load More Articles
            </Button>
          </div>
        </div>
      </main>
    </div>
  )
}
