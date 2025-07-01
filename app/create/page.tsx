"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { X, Save, Eye, Send, Calendar } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogDescription, DialogTitle } from "@/components/ui/dialog"

interface User {
  _id: string;
}

export default function CreateBlogPage() {
  const { user, isLoggedIn } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState<string>("")
  const [excerpt, setExcerpt] = useState<string>("")
  const [content, setContent] = useState<string>("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState<string>("")
  const [category, setCategory] = useState<string>("")
  const [loading, setLoading] = useState<boolean>(false)
  const [isScheduled, setIsScheduled] = useState<boolean>(false)
  const [showSchedulingConfirmation, setShowSchedulingConfirmation] = useState<boolean>(false)
  const [scheduledDate, setScheduledDate] = useState<string>("") // Store as YYYY-MM-DDThh:mm
  const [slug, setSlug] = useState<string>("")
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  // Get current local time in YYYY-MM-DDThh:mm format for min attribute
  const getCurrentLocalDateTime = (): string => {
    const now = new Date()
    const year = now.getFullYear()
    const month = String(now.getMonth() + 1).padStart(2, "0")
    const day = String(now.getDate()).padStart(2, "0")
    const hours = String(now.getHours()).padStart(2, "0")
    const minutes = String(now.getMinutes()).padStart(2, "0")
    return `${year}-${month}-${day}T${hours}:${minutes}`
  }

  interface ScheduleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleScheduleChange = (e: ScheduleChangeEvent): void => {
    const localValue: string = e.target.value // e.g., "2025-06-28T11:53"
    if (!localValue) {
      setScheduledDate("")
      return
    }

    const localDate = new Date(localValue)
    if (isNaN(localDate.getTime())) {
      toast({
        variant: "destructive",
        title: "Invalid Date",
        description: "Please enter a valid date and time.",
      })
      return
    }

    // Store as local YYYY-MM-DDThh:mm format for the input
    setScheduledDate(localValue)
  }

  useEffect(() => {
    const token = sessionStorage.getItem("token")
    setIsAuthenticated(!!token)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const token = sessionStorage.getItem("token")
      if (!token) {
        console.error("No token found in sessionStorage")
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please log in to view your profile.",
        })
        return
      }

      try {
        const res = await fetch("/api/user/fetch", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })

        if (!res.ok) {
          throw new Error("Failed to fetch user data")
        }

        const data = await res.json()
        setUserDetails(data.user)
      } catch (error) {
        console.error("Error fetching user:", error)
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

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-|-$/g, "")
      setSlug(generatedSlug)
    }
  }, [title])

  // Auto-save functionality
  useEffect(() => {
    const interval = setInterval(() => {
      if (title || content) {
        saveDraft()
      }
    }, 10000) // Auto-save every 10 seconds

    return () => clearInterval(interval)
  }, [title, content, excerpt, tags, category])

  const saveDraft = async () => {
    if (!user) return

    try {
      const draft = {
        title,
        excerpt,
        content,
        tags,
        category,
        slug,
        updatedAt: new Date().toISOString(),
      }
      localStorage.setItem("blog-draft", JSON.stringify(draft))

      toast({
        title: "Draft saved",
        description: "Your changes have been saved automatically.",
      })
    } catch (error) {
      console.error("Auto-save failed:", error)
    }
  }

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  const handleSubmit = async (publish: boolean = false) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    if (isScheduled && !scheduledDate) {
      toast({
        title: "Error",
        description: "Please set a valid schedule date.",
        variant: "destructive",
      })
      return
    }

    if (publish && isScheduled) {
      setShowSchedulingConfirmation(true)
      return
    }

    setLoading(true)

    try {
      // Convert scheduledDate to UTC ISO string for backend
      const scheduledFor = isScheduled && scheduledDate
        ? new Date(scheduledDate).toISOString()
        : null

      const blogData = {
        title,
        excerpt,
        content,
        tags,
        category,
        slug,
        published: publish && !isScheduled,
        scheduled: isScheduled,
        scheduledFor,
        createdAt: new Date().toISOString(),
      }

      const existingBlogs = JSON.parse(localStorage.getItem("user-blogs") || "[]")
      const newBlog = { ...blogData, id: Date.now().toString() }
      localStorage.setItem("user-blogs", JSON.stringify([newBlog, ...existingBlogs]))

      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: userDetails?._id || "", ...blogData })
      })

      if (!res.ok) {
        throw new Error("Failed to create blog")
      }

      localStorage.removeItem("blog-draft")

      toast({
        title: "Success",
        description: publish
          ? isScheduled
            ? "Blog scheduled successfully!"
            : "Blog published successfully!"
          : "Draft saved successfully!",
      })

      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save blog. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleScheduleConfirm = async () => {
    setLoading(true)
    try {
      const scheduledFor = scheduledDate ? new Date(scheduledDate).toISOString() : null
      const blogData = {
        title,
        excerpt,
        content,
        tags,
        category,
        slug,
        published: false,
        scheduled: true,
        scheduledFor,
        createdAt: new Date().toISOString(),
      }

      const existingBlogs = JSON.parse(localStorage.getItem("user-blogs") || "[]")
      const newBlog = { ...blogData, id: Date.now().toString() }
      localStorage.setItem("user-blogs", JSON.stringify([newBlog, ...existingBlogs]))

      const res = await fetch("/api/blog/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ author: userDetails?._id || "", ...blogData })
      })

      if (!res.ok) {
        throw new Error("Failed to schedule blog")
      }

      localStorage.removeItem("blog-draft")

      toast({
        title: "Success",
        description: "Blog scheduled successfully!",
      })

      setShowSchedulingConfirmation(false)
      router.push("/dashboard")
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to schedule blog. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8 text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to create a blog post</h1>
          <p className="text-muted-foreground">You need to be logged in to create content.</p>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Create New Post</h1>
          <div className="flex space-x-2">
            <Button variant="outline" onClick={() => handleSubmit(false)} disabled={loading}>
              <Save className="mr-2 h-4 w-4" />
              Save Draft
            </Button>
            <Button onClick={() => handleSubmit(true)} disabled={loading}>
              {isScheduled ? (
                <>
                  <Calendar className="mr-2 h-4 w-4" />
                  Schedule
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Post Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter your blog title..."
                    className="text-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="slug">URL Slug</Label>
                  <Input
                    id="slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="url-friendly-slug"
                  />
                  <p className="text-xs text-muted-foreground mt-1">URL: /blog/{slug || "your-slug-here"}</p>
                </div>

                <div>
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <Textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(e) => setExcerpt(e.target.value)}
                    placeholder="Brief description of your post..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Content</CardTitle>
              </CardHeader>
              <CardContent>
                <RichTextEditor content={content} onChange={setContent} placeholder="Start writing your blog post..." />
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Publishing Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch id="scheduled" checked={isScheduled} onCheckedChange={setIsScheduled} />
                  <Label htmlFor="scheduled">Schedule for later</Label>
                </div>

                {isScheduled && (
                  <div>
                    <Label htmlFor="scheduledDate">Publish Date</Label>
                    <Input
                      id="scheduledDate"
                      type="datetime-local"
                      value={scheduledDate}
                      onChange={handleScheduleChange}
                      min={getCurrentLocalDateTime()}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Categories & Tags</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="e.g., Technology, Lifestyle"
                  />
                </div>

                <div>
                  <Label htmlFor="tags">Tags</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="tags"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                    />
                    <Button type="button" onClick={addTag} size="sm">
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        {tag}
                        <X className="h-3 w-3 cursor-pointer" onClick={() => removeTag(tag)} />
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  <Eye className="mr-2 h-4 w-4" />
                  Preview Post
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {isScheduled && (
          <Dialog open={showSchedulingConfirmation} onOpenChange={setShowSchedulingConfirmation}>
            <DialogContent className="sm:max-w-md bg-[#1F1F1F] border-[#444444] text-white">
              <DialogHeader>
                <DialogTitle className="text-white">Schedule Confirmation</DialogTitle>
                <DialogDescription className="text-[#D1D1D1]">
                  Your post is being scheduled using GitHub Workflow. Please note that it may take 10 to 20 minutes from the scheduled time for the post to be published.
                </DialogDescription>
              </DialogHeader>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  onClick={() => setShowSchedulingConfirmation(false)}
                  className="px-4 py-2 bg-transparent border border-[#444444] text-white rounded-md hover:bg-[#2A2A2A] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleScheduleConfirm}
                  className="px-4 py-2 bg-white text-black rounded-md transition-colors"
                >
                  Confirm
                </button>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </main>
    </div>
  )
}