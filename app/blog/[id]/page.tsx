"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { formatDistanceToNow } from "date-fns"
import { Heart, Share2, Bookmark, Eye, Clock } from "lucide-react"
import { CommentSection } from "@/components/comment-section"
import Image from "next/image"

interface BlogPost {
  id: string
  title: string
  content: string
  excerpt: string
  author: {
    id: string
    name: string
    avatar?: string
    bio?: string
  }
  createdAt: string
  updatedAt: string
  tags: string[]
  category: string
  views: number
  likes: number
  readTime: number
  image?: string
}

// Mock blog data
const mockBlogData: { [key: string]: BlogPost } = {
  "1": {
    id: "1",
    title: "The Future of Web Development: Trends to Watch in 2024",
    content: `
      <h2>Introduction</h2>
      <p>The web development landscape is constantly evolving, and 2024 promises to bring exciting new trends and technologies that will shape how we build applications. From AI integration to new frameworks, let's explore what's on the horizon.</p>
      
      <h2>AI-Powered Development</h2>
      <p>Artificial Intelligence is revolutionizing how we write code. Tools like GitHub Copilot and ChatGPT are becoming essential parts of the developer toolkit, helping with everything from code generation to debugging and documentation.</p>
      
      <h2>Server Components and Edge Computing</h2>
      <p>React Server Components are changing how we think about rendering and data fetching. Combined with edge computing platforms, we can deliver faster, more efficient applications that run closer to our users.</p>
      
      <h2>WebAssembly Growth</h2>
      <p>WebAssembly continues to gain traction, allowing developers to run high-performance applications in the browser using languages like Rust, C++, and Go. This opens up new possibilities for web applications.</p>
      
      <h2>Conclusion</h2>
      <p>The future of web development is bright, with new tools and technologies making it easier than ever to build amazing user experiences. Stay curious and keep learning!</p>
    `,
    excerpt:
      "Explore the latest trends shaping the future of web development, from AI integration to new frameworks and tools that are revolutionizing how we build applications.",
    author: {
      id: "1",
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Senior Frontend Developer with 8+ years of experience building scalable web applications. Passionate about React, TypeScript, and developer experience.",
    },
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z",
    tags: ["Web Development", "Technology", "AI"],
    category: "Technology",
    views: 1520,
    likes: 245,
    readTime: 8,
    image: "/placeholder.svg?height=400&width=800",
  },
  "2": {
    id: "2",
    title: "Building Scalable React Applications: Best Practices",
    content: `
      <h2>Project Structure</h2>
      <p>A well-organized project structure is the foundation of any scalable React application. We'll explore folder organization, component hierarchy, and file naming conventions.</p>
      
      <h2>State Management</h2>
      <p>Choosing the right state management solution is crucial. We'll compare Redux, Zustand, and React Context to help you make the best choice for your project.</p>
      
      <h2>Performance Optimization</h2>
      <p>Learn about React.memo, useMemo, useCallback, and other optimization techniques to keep your application fast as it grows.</p>
      
      <h2>Testing Strategies</h2>
      <p>Implement comprehensive testing with Jest, React Testing Library, and Cypress to ensure your application remains reliable.</p>
    `,
    excerpt:
      "Learn how to structure and build React applications that can scale with your business needs. Discover patterns, tools, and techniques used by top companies.",
    author: {
      id: "2",
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      bio: "Full-stack developer and React enthusiast. Building scalable applications at a Fortune 500 company.",
    },
    createdAt: "2024-01-12T14:30:00Z",
    updatedAt: "2024-01-12T14:30:00Z",
    tags: ["React", "JavaScript", "Architecture"],
    category: "Programming",
    views: 980,
    likes: 189,
    readTime: 12,
    image: "/placeholder.svg?height=400&width=800",
  },
}

export default function BlogPostPage() {
  const params = useParams()
  const [blog, setBlog] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)

  useEffect(() => {
    if (params.id) {
      // Simulate API call
      setTimeout(() => {
        const blogData = mockBlogData[params.id as string]
        if (blogData) {
          setBlog(blogData)
        }
        setLoading(false)
      }, 1000)
    }
  }, [params.id])

  const handleLike = () => {
    if (!blog) return
    setLiked(!liked)
    setBlog({
      ...blog,
      likes: liked ? blog.likes - 1 : blog.likes + 1,
    })
  }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blog?.title,
        url: window.location.href,
      })
    } else {
      navigator.clipboard.writeText(window.location.href)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-3/4"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Blog post not found</h1>
          <p className="text-muted-foreground">The blog post you're looking for doesn't exist.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <article className="space-y-8">
          {/* Header */}
          <header className="space-y-6">
            {blog.image && (
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
              </div>
            )}

            <div className="flex flex-wrap gap-2">
              {blog.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>

            <h1 className="text-4xl font-bold leading-tight">{blog.title}</h1>

            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{blog.author.name}</p>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {blog.readTime} min read
                    </span>
                    <span className="flex items-center">
                      <Eye className="mr-1 h-3 w-3" />
                      {blog.views} views
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant={liked ? "default" : "outline"}
                  size="sm"
                  onClick={handleLike}
                  className="flex items-center space-x-1"
                >
                  <Heart className={`h-4 w-4 ${liked ? "fill-current" : ""}`} />
                  <span>{blog.likes}</span>
                </Button>

                <Button variant={bookmarked ? "default" : "outline"} size="sm" onClick={handleBookmark}>
                  <Bookmark className={`h-4 w-4 ${bookmarked ? "fill-current" : ""}`} />
                </Button>

                <Button variant="outline" size="sm" onClick={handleShare}>
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </header>

          <Separator />

          {/* Content */}
          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <Separator />

          {/* Author Bio */}
          <Card>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{blog.author.name}</h3>
                  <p className="text-muted-foreground mt-1">{blog.author.bio || "Passionate writer and blogger"}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Follow
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          {/* Comments */}
          <CommentSection blogId={blog.id} />
        </article>
      </main>
    </div>
  )
}
