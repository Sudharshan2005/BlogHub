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
const mockRecentBlogs: Blog[] = [
  {
    id: "4",
    title: "Understanding TypeScript: A Comprehensive Guide",
    excerpt:
      "Dive deep into TypeScript and learn how it can improve your JavaScript development experience with better tooling and type safety.",
    author: {
      name: "David Kim",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-14T16:20:00Z",
    readTime: 10,
    tags: ["TypeScript", "JavaScript", "Programming"],
    likes: 203,
    views: 1340,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "5",
    title: "CSS Grid vs Flexbox: When to Use Which",
    excerpt:
      "A practical guide to choosing between CSS Grid and Flexbox for your layout needs, with real-world examples and use cases.",
    author: {
      name: "Lisa Wang",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-13T11:45:00Z",
    readTime: 7,
    tags: ["CSS", "Layout", "Design"],
    likes: 167,
    views: 890,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "6",
    title: "Getting Started with Next.js 14: New Features and Improvements",
    excerpt:
      "Explore the latest features in Next.js 14, including the new App Router, Server Components, and performance improvements.",
    author: {
      name: "Alex Thompson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-11T13:30:00Z",
    readTime: 9,
    tags: ["Next.js", "React", "Web Development"],
    likes: 298,
    views: 1650,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "7",
    title: "The Psychology of User Experience Design",
    excerpt:
      "Understanding how users think and behave can dramatically improve your design decisions. Learn the psychological principles behind great UX.",
    author: {
      name: "Maria Garcia",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-09T15:10:00Z",
    readTime: 11,
    tags: ["UX Design", "Psychology", "Design"],
    likes: 134,
    views: 567,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "8",
    title: "API Design Best Practices for Modern Applications",
    excerpt:
      "Learn how to design APIs that are intuitive, scalable, and maintainable. Best practices from industry experts.",
    author: {
      name: "James Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-08T10:25:00Z",
    readTime: 13,
    tags: ["API", "Backend", "Architecture"],
    likes: 221,
    views: 1120,
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    id: "9",
    title: "Mobile-First Design: Why It Matters More Than Ever",
    excerpt:
      "With mobile traffic dominating the web, learn why mobile-first design is crucial and how to implement it effectively.",
    author: {
      name: "Sophie Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    createdAt: "2024-01-07T14:50:00Z",
    readTime: 8,
    tags: ["Mobile Design", "Responsive", "UX"],
    likes: 178,
    views: 823,
    image: "/placeholder.svg?height=200&width=400",
  },
]

export function RecentBlogs() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setBlogs(mockRecentBlogs)
      setLoading(false)
    }, 1200)

    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
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
