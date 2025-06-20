"use client"

import { useEffect, useState } from "react"
import { BlogCard } from "./blog-card"

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

// Mock data for demonstration
const mockFeaturedBlogs: Blog[] = [
  {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2025",
    excerpt:
      "Explore the latest trends shaping the future of web development, from AI integration to new frameworks and tools that are revolutionizing how we build applications.",
    author: {
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
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
    excerpt:
      "Learn how to structure and build React applications that can scale with your business needs. Discover patterns, tools, and techniques used by top companies.",
    author: {
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-12T14:30:00Z",
    readTime: 12,
    tags: ["React", "JavaScript", "Architecture"],
    likes: 189,
    views: 980,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "3",
    title: "The Art of Technical Writing: Communicating Complex Ideas",
    excerpt:
      "Master the skills needed to write clear, engaging technical content that helps developers learn and grow. Tips from experienced technical writers.",
    author: {
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-10T09:15:00Z",
    readTime: 6,
    tags: ["Writing", "Communication", "Career"],
    likes: 156,
    views: 742,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export function FeaturedBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBlogs(mockFeaturedBlogs)
      setLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="bg-muted h-48 rounded-lg mb-4"></div>
            <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-muted rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {blogs.map((blog) => (
        <BlogCard key={blog.id} blog={blog} />
      ))}
    </div>
  )
}
