"use client"

import { useEffect, useState } from "react"
import { BlogCard } from "./blog-card"
import { useToast } from "@/hooks/use-toast"

interface Blog {
  _id: string
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

export function RecentBlogs() {
  const { toast } = useToast()
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blog/all', {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' }
        });

        const data = await response.json();
        // Sort blogs by createdAt in descending order and take the first 6
        const recentBlogs = data.blogs
          .sort((a: Blog, b: Blog) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 6);
        setBlogs(recentBlogs);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load blog data. Please try again.",
        });
      }
    };

    fetchBlogs();
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