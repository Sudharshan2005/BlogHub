"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Flame, Eye, Heart } from "lucide-react"

interface TrendingBlog {
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
  trendingScore: number
}

const mockTrendingBlogs: TrendingBlog[] = [
  {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2024",
    excerpt: "Explore the latest trends shaping the future of web development, from AI integration to new frameworks.",
    author: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40" },
    createdAt: "2024-01-15T10:00:00Z",
    readTime: 8,
    tags: ["Web Development", "Technology", "AI"],
    likes: 245,
    views: 1520,
    image: "/placeholder.svg?height=200&width=400",
    trendingScore: 95,
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
    trendingScore: 87,
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
    trendingScore: 82,
  },
]

const trendingTopics = [
  { name: "AI & Machine Learning", count: 45 },
  { name: "Web Development", count: 38 },
  { name: "React", count: 32 },
  { name: "TypeScript", count: 28 },
  { name: "Design Systems", count: 24 },
  { name: "DevOps", count: 19 },
]

export default function TrendingPage() {
  const [blogs, setBlogs] = useState<TrendingBlog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBlogs(mockTrendingBlogs)
      setLoading(false)
    }, 1000)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Flame className="h-8 w-8 text-orange-500" />
              <h1 className="text-4xl font-bold">Trending Now</h1>
            </div>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover the most popular and engaging content from our community
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-3">
              {loading ? (
                <div className="space-y-6">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-muted h-48 rounded-lg mb-4"></div>
                      <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-8">
                  {blogs.map((blog, index) => (
                    <div key={blog.id} className="relative">
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <Badge variant="secondary" className="flex items-center space-x-1">
                          <TrendingUp className="h-3 w-3" />
                          <span>Trending Score: {blog.trendingScore}</span>
                        </Badge>
                      </div>
                      <BlogCard blog={blog} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="h-5 w-5" />
                    <span>Trending Topics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {trendingTopics.map((topic, index) => (
                      <div key={topic.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                          <span className="font-medium">{topic.name}</span>
                        </div>
                        <Badge variant="outline">{topic.count}</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>This Week's Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Views</span>
                      </div>
                      <span className="font-semibold">1.2M</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Total Likes</span>
                      </div>
                      <span className="font-semibold">45.2K</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Trending Posts</span>
                      </div>
                      <span className="font-semibold">127</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
