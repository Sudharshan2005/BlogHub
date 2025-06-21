"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Header } from "@/components/header"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { Heart, Share2, Bookmark, Eye, Clock } from "lucide-react"
import { CommentSection } from "@/components/comment-section"
import Image from "next/image"


interface IAuthor {
  _id: string;
  name: string;
  email: string;
  password: string;
  avatar: string;
  bio: string;
  isVerified: boolean;
  followers: string[];
  following: string[];
  bookmarks: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface IBlog {
  seo: {
    keywords: string[];
  };
  comments: number;
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: IAuthor;
  tags: string[];
  category: string;
  published: boolean;
  scheduledFor: string | null;
  views: number;
  readTime: number;
  featured: boolean;
  createdAt: string;
  images: string[];
  likes: string[];
  updatedAt: string;
  publishedAt: string;
  __v: number;
}


export default function BlogPostPage() {
  const params = useParams()
  const { toast } = useToast()
  const [blog, setBlog] = useState<IBlog | null>(null)
  const [loading, setLoading] = useState(true)
  const [liked, setLiked] = useState(false)
  const [bookmarked, setBookmarked] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  
    useEffect(() => {
      const token = sessionStorage.getItem('token')
      setIsAuthenticated(!!token)
    }, [])
  

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params?.id) {
        console.error('No blog ID provided in params')
        setLoading(false)
        toast({
          title: "Error",
          description: "Invalid blog ID.",
          variant: "destructive",
        })
        return
      }

      try {
        setLoading(true)
        const res = await fetch(`/api/blog/${params.id}`, {
          method: 'GET',
          headers: { 'Content-Type': 'application/json' },
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(`Failed to fetch blog: ${res.status} - ${errorData.message || 'Unknown error'}`)
        }

        const data = await res.json()
        if (!data.blog) {
          throw new Error('No blog data found in response')
        }
        setBlog(data.blog)
      } catch (error) {
        console.error('Error fetching blog:', error)
        setBlog(null)
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to fetch blog. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    fetchBlog()
  }, [params?.id, toast])

  // const handleLike = () => {
  //   if (!blog) return
  //   setLiked(!liked)
  //   setBlog({
  //     ...blog,
  //     likes: liked ? blog.likes - 1 : blog.likes + 1,
  //   })
  // }

  const handleBookmark = () => {
    setBookmarked(!bookmarked)
  }

  const handleShare = () => {
    if (!blog) return
    if (navigator.share) {
      navigator.share({
        title: blog.title,
        url: window.location.href,
      }).catch(error => console.error('Error sharing:', error))
    } else {
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast({ title: "Link Copied", description: "Blog URL copied to clipboard." }))
        .catch(error => console.error('Error copying link:', error))
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
          <header className="space-y-6">
            {blog.images && (
              <div className="relative h-64 md:h-96 w-full rounded-lg overflow-hidden">
                <Image src={blog.images[0] || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
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

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <div dangerouslySetInnerHTML={{ __html: blog.content }} />
          </div>

          <Separator />

          <Card>
            <CardHeader>
              <div className="flex items-start space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
                  <AvatarFallback>{blog.author.name.charAt(0) || "P"}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">{blog.author.name || "Unknown User"}</h3>
                  <p className="text-muted-foreground mt-1">{blog.author.bio || "Passionate writer and blogger"}</p>
                  <Button variant="outline" size="sm" className="mt-3">
                    Follow
                  </Button>
                </div>
              </div>
            </CardHeader>
          </Card>

          <CommentSection blogId={blog._id} />
        </article>
      </main>
    </div>
  )
}