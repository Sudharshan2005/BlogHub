"use client"

import { useUser } from "@/contexts/user-context"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { BlogManagement } from "@/components/blog-management"
import Link from "next/link"
import { Plus, Eye, Heart, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface DashboardStats {
  totalBlogs: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

interface Blog {
  id: string
  title: string
  excerpt: string
  createdAt: string
  views: number
  likes: number
  comments: number
  published: boolean
  status: "published" | "draft" | "scheduled"
  scheduledFor?: string
}

// Mock data
const mockStats: DashboardStats = {
  totalBlogs: 12,
  totalViews: 4520,
  totalLikes: 892,
  totalComments: 156,
}

const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Next.js 14",
    excerpt: "Learn the latest features in Next.js 14 including the App Router and Server Components.",
    createdAt: "2024-01-15T10:00:00Z",
    views: 1520,
    likes: 245,
    comments: 32,
    published: true,
    status: "published",
  },
  {
    id: "2",
    title: "TypeScript Best Practices",
    excerpt: "A comprehensive guide to writing better TypeScript code.",
    createdAt: "2024-01-12T14:30:00Z",
    views: 980,
    likes: 189,
    comments: 24,
    published: false,
    status: "draft",
  },
  {
    id: "3",
    title: "React Performance Optimization",
    excerpt: "Tips and tricks to make your React applications faster.",
    createdAt: "2024-01-10T09:15:00Z",
    views: 742,
    likes: 156,
    comments: 18,
    published: true,
    status: "published",
  },
]

export default function DashboardPage() {
  const { user, isLoggedIn } = useUser()
  const [stats, setStats] = useState<DashboardStats>(mockStats)
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "scheduled">("all")

  const filteredBlogs = blogs.filter((blog) => {
    if (filter === "all") return true
    return blog.status === filter
  })

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to access your dashboard</h1>
          <p className="text-muted-foreground">You need to be logged in to view your dashboard.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold">Welcome back, {user?.name || "Guest"}!</h1>
            <p className="text-muted-foreground">Here's what's happening with your blog</p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" />
              New Post
            </Link>
          </Button>
        </div>

        <StatsCards stats={stats} loading={loading} />

        <Tabs defaultValue="overview" className="mt-8">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="posts">Manage Posts</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="mt-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Posts</CardTitle>
                    <CardDescription>Your latest blog posts</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {blogs.slice(0, 5).map((blog) => (
                        <div key={blog.id} className="border-b pb-4 last:border-b-0">
                          <h3 className="font-semibold hover:text-primary cursor-pointer">{blog.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{blog.excerpt}</p>
                          <div className="flex items-center space-x-4 mt-2 text-xs text-muted-foreground">
                            <span className="flex items-center">
                              <Eye className="mr-1 h-3 w-3" />
                              {blog.views}
                            </span>
                            <span className="flex items-center">
                              <Heart className="mr-1 h-3 w-3" />
                              {blog.likes}
                            </span>
                            <span
                              className={`px-2 py-1 rounded text-xs ${
                                blog.status === "published"
                                  ? "bg-green-100 text-green-800"
                                  : blog.status === "draft"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-blue-100 text-blue-800"
                              }`}
                            >
                              {blog.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <RecentActivity />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="posts" className="mt-6">
            <BlogManagement blogs={filteredBlogs} filter={filter} setFilter={setFilter} />
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Views Over Time</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    Analytics Chart Placeholder
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Posts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {blogs
                      .sort((a, b) => b.views - a.views)
                      .slice(0, 5)
                      .map((blog, index) => (
                        <div key={blog.id} className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-sm font-medium text-muted-foreground">#{index + 1}</span>
                            <span className="font-medium text-sm">{blog.title}</span>
                          </div>
                          <span className="text-sm text-muted-foreground">{blog.views} views</span>
                        </div>
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
