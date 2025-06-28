"use client"

import { useUser } from "@/contexts/user-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/header"
import { StatsCards } from "@/components/stats-cards"
import { RecentActivity } from "@/components/recent-activity"
import { BlogManagement } from "@/components/blog-management"
import Link from "next/link"
import { useToast } from "@/hooks/use-toast"
import { Plus, Eye, Heart, BarChart3 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import mongoose from "mongoose"

interface DashboardStats {
  totalBlogs: number
  totalViews: number
  totalLikes: number
  totalComments: number
}

interface Blog {
  _id: string
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

interface User {
  _id: string
  id: string
  name: string
  email: string
  password?: string
  avatar: string
  bio: string
  googleId?: string
  githubId?: string
  isVerified: boolean
  followers: mongoose.Types.ObjectId[]
  following: mongoose.Types.ObjectId[]
  bookmarks: mongoose.Types.ObjectId[]
  comparePassword(candidatePassword: string): Promise<boolean>
}

export default function DashboardPage() {
  const { user, isLoggedIn } = useUser()
  const [stats, setStats] = useState<DashboardStats>({
    totalBlogs: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
  })
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(false)
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "scheduled">("all")
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem('token')
      if (!token) {
        console.error('No token found in sessionStorage')
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to view your profile.",
        })
        return
      }

      try {
        const res = await fetch('/api/user/fetch', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error('Failed to fetch user data')
        }

        const data = await res.json()
        setUserDetails(data.user)
      } catch (error) {
        console.error('Error fetching user:', error)
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load user data. Please try again.",
        })
      }
    }

    if (isAuthenticated) {
      fetchData()
    }
  }, [isAuthenticated, toast])

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        if (!userDetails) {
          console.error("User details are not available")
          return
        }
        setLoading(true)
        const token = sessionStorage.getItem('token')
        if (!token) {
          console.error('No token found')
          toast({ title: 'Error', description: 'Please log in again.', variant: 'destructive' })
          return
        }
        const res = await fetch(`/api/blog/fetch/${userDetails._id}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        })

        if (res.status === 404) {
          console.log('No blogs found for user')
          setBlogs([])
          setStats({ totalBlogs: 0, totalViews: 0, totalLikes: 0, totalComments: 0 })
          return
        }
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(`Failed to fetch blogs: ${res.status} - ${errorData.message}`)
        }

        const data = await res.json()
        const fetchedBlogs = data.blogs.map((post: any) => ({
          _id: post._id,
          id: post._id,
          title: post.title,
          excerpt: post.excerpt,
          createdAt: post.createdAt,
          views: post.views || 0,
          likes: post.likes?.length || 0,
          comments: post.comments || 0,
          published: post.published,
          status: post.published ? 'published' : post.scheduledFor ? 'scheduled' : 'draft',
          scheduledFor: post.scheduledFor,
        }))
        setBlogs(fetchedBlogs)
        const stats: DashboardStats = {
          totalBlogs: fetchedBlogs.length,
          totalViews: fetchedBlogs.reduce((sum: number, blog: Blog) => sum + blog.views, 0),
          totalLikes: fetchedBlogs.reduce((sum: number, blog: Blog) => sum + blog.likes, 0),
          totalComments: fetchedBlogs.reduce((sum: number, blog: Blog) => sum + blog.comments, 0),
        }
        setStats(stats)
      } catch (error) {
        console.error('Error fetching blogs:', error)
        toast({
          title: "Error",
          description: (error instanceof Error ? error.message : "Failed to load blogs. Please try again."),
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isAuthenticated && userDetails) {
      fetchBlogs()
    }
  }, [isAuthenticated, userDetails, toast])

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
            <h1 className="text-3xl font-bold">Welcome back, {userDetails?.name || "Guest"}!</h1>
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
                      {blogs
                      .sort((a,b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                      .slice(0, 5).map((blog) => (
                        <div key={blog._id} className="border-b pb-4 last:border-b-0">
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
                        <div key={blog._id} className="flex items-center justify-between">
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