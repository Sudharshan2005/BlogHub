"use client"

import { useState, useEffect } from "react"
import { useUser } from "@/contexts/user-context"
import { Header } from "@/components/header"
import { RichTextEditor } from "@/components/rich-text-editor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { X, Save, Eye, Send, Calendar } from "lucide-react"

interface User {
  _id: string;
}

export default function CreateBlogPage() {
  const { user, isLoggedIn } = useUser()
  const { toast } = useToast()
  const router = useRouter()

  const [title, setTitle] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [content, setContent] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [tagInput, setTagInput] = useState("")
  const [category, setCategory] = useState("")
  const [loading, setLoading] = useState(false)
  const [isScheduled, setIsScheduled] = useState(false)
  const [scheduledDate, setScheduledDate] = useState("")
  const [slug, setSlug] = useState("")
  const [userDetails, setUserDetails] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)


  interface ScheduleChangeEvent extends React.ChangeEvent<HTMLInputElement> {}

  const handleScheduleChange = (e: ScheduleChangeEvent): void => {
    const localValue: string = e.target.value; // e.g., "2025-06-28T17:08"
    setScheduledDate(localValue); // still store it locally for the UI

    const localDate: Date = new Date(localValue);

    const utcISOString: string = new Date(
      localDate.getTime() - localDate.getTimezoneOffset() * 60000
    ).toISOString();

    console.log("Scheduled UTC ISO:", utcISOString);
  };
  

  useEffect(() => {
      const token = sessionStorage.getItem('token')
      setIsAuthenticated(!!token)
    }, [])
  
    useEffect(() => {
      const fetchData = async () => {
        const token = sessionStorage.getItem('token')
        if (!token) {
          console.error('No token found in localStorage')
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

  // Auto-generate slug from title
  useEffect(() => {
    if (title) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-zA-Z0-9]/g, "-")
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
      // Simulate saving draft to localStorage
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

  const handleSubmit = async (publish = false) => {
    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Title and content are required",
        variant: "destructive",
      })
      return
    }

    setLoading(true)

    try {
      const blogData = {
        title,
        excerpt,
        content,
        tags,
        category,
        slug,
        published: publish && !isScheduled,
        scheduled: isScheduled,
        scheduledFor: isScheduled ? scheduledDate : null,
        createdAt: new Date().toISOString(),
      }
      console.log(blogData);
      
      const existingBlogs = JSON.parse(localStorage.getItem("user-blogs") || "[]")
      const newBlog = { ...blogData, id: Date.now().toString() }
      localStorage.setItem("user-blogs", JSON.stringify([newBlog, ...existingBlogs]))

      const res = await fetch('/api/blog/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: userDetails?._id || "", ...blogData })
      });

      if (!res.ok) {
        throw new Error('Failed to create blog');
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
      </main>
    </div>
  )
}
