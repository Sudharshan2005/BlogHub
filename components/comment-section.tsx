"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { formatDistanceToNow } from "date-fns"
import { MessageCircle, Reply, Heart } from "lucide-react"

interface Comment {
  id: string
  content: string
  author: {
    name: string
    email: string
    avatar?: string
  }
  createdAt: string
  likes: number
  liked: boolean
  replies: Comment[]
}

interface CommentSectionProps {
  blogId: string
}

// Mock comments data
const mockComments: Comment[] = [
  {
    id: "1",
    content:
      "Great article! Really helpful insights about the future of web development. I'm particularly excited about the AI integration possibilities.",
    author: {
      name: "John Doe",
      email: "john@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2024-01-16T10:30:00Z",
    likes: 5,
    liked: false,
    replies: [
      {
        id: "2",
        content: "I agree! The AI tools are already changing how I write code daily.",
        author: {
          name: "Jane Smith",
          email: "jane@example.com",
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: "2024-01-16T11:15:00Z",
        likes: 2,
        liked: false,
        replies: [],
      },
    ],
  },
  {
    id: "3",
    content: "Thanks for sharing this! Do you have any recommendations for getting started with WebAssembly?",
    author: {
      name: "Mike Johnson",
      email: "mike@example.com",
      avatar: "/placeholder.svg?height=32&width=32",
    },
    createdAt: "2024-01-16T14:20:00Z",
    likes: 3,
    liked: false,
    replies: [],
  },
]

export function CommentSection({ blogId }: CommentSectionProps) {
  const { toast } = useToast()
  const [comments, setComments] = useState<Comment[]>([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)

  // Form states
  const [newComment, setNewComment] = useState("")
  const [authorName, setAuthorName] = useState("")
  const [authorEmail, setAuthorEmail] = useState("")
  const [replyContent, setReplyContent] = useState("")

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setComments(mockComments)
      setLoading(false)
    }, 1000)
  }, [blogId])

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !authorName.trim() || !authorEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    setSubmitting(true)

    // Simulate API call
    setTimeout(() => {
      const comment: Comment = {
        id: Date.now().toString(),
        content: newComment,
        author: {
          name: authorName,
          email: authorEmail,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
        replies: [],
      }

      setComments([comment, ...comments])
      setNewComment("")
      setAuthorName("")
      setAuthorEmail("")
      setSubmitting(false)

      toast({
        title: "Success",
        description: "Comment posted successfully!",
      })
    }, 1000)
  }

  const handleSubmitReply = async (parentId: string) => {
    if (!replyContent.trim() || !authorName.trim() || !authorEmail.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    // Simulate API call
    setTimeout(() => {
      const reply: Comment = {
        id: Date.now().toString(),
        content: replyContent,
        author: {
          name: authorName,
          email: authorEmail,
          avatar: "/placeholder.svg?height=32&width=32",
        },
        createdAt: new Date().toISOString(),
        likes: 0,
        liked: false,
        replies: [],
      }

      setComments(
        comments.map((comment) =>
          comment.id === parentId ? { ...comment, replies: [...comment.replies, reply] } : comment,
        ),
      )

      setReplyContent("")
      setReplyingTo(null)

      toast({
        title: "Success",
        description: "Reply posted successfully!",
      })
    }, 1000)
  }

  const handleLikeComment = (commentId: string) => {
    setComments(
      comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            liked: !comment.liked,
            likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        // Handle replies
        return {
          ...comment,
          replies: comment.replies.map((reply) =>
            reply.id === commentId
              ? {
                  ...reply,
                  liked: !reply.liked,
                  likes: reply.liked ? reply.likes - 1 : reply.likes + 1,
                }
              : reply,
          ),
        }
      }),
    )
  }

  const CommentItem = ({ comment, isReply = false }: { comment: Comment; isReply?: boolean }) => (
    <div className={`space-y-3 ${isReply ? "ml-8 border-l-2 border-muted pl-4" : ""}`}>
      <div className="flex items-start space-x-3">
        <Avatar className="h-8 w-8">
          <AvatarImage src={comment.author.avatar || "/placeholder.svg"} />
          <AvatarFallback>{comment.author.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-1 space-y-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-medium text-sm">{comment.author.name}</span>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
              </span>
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>

          <div className="flex items-center space-x-4 text-xs">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleLikeComment(comment.id)}
              className="h-auto p-0 text-muted-foreground hover:text-primary"
            >
              <Heart className={`mr-1 h-3 w-3 ${comment.liked ? "fill-current text-red-500" : ""}`} />
              {comment.likes}
            </Button>

            {!isReply && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                className="h-auto p-0 text-muted-foreground hover:text-primary"
              >
                <Reply className="mr-1 h-3 w-3" />
                Reply
              </Button>
            )}
          </div>

          {replyingTo === comment.id && (
            <div className="space-y-3 mt-3 p-3 bg-muted/50 rounded-lg">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <Label htmlFor="reply-name">Name</Label>
                  <Input
                    id="reply-name"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <Label htmlFor="reply-email">Email</Label>
                  <Input
                    id="reply-email"
                    type="email"
                    value={authorEmail}
                    onChange={(e) => setAuthorEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="reply-content">Reply</Label>
                <Textarea
                  id="reply-content"
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  placeholder="Write a reply..."
                  rows={2}
                />
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={() => handleSubmitReply(comment.id)}>
                  Reply
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setReplyingTo(null)
                    setReplyContent("")
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>

      {comment.replies && comment.replies.length > 0 && (
        <div className="space-y-3">
          {comment.replies.map((reply) => (
            <CommentItem key={reply.id} comment={reply} isReply />
          ))}
        </div>
      )}
    </div>
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span>Comments ({comments.length})</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Comment Form */}
        <form onSubmit={handleSubmitComment} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                required
              />
            </div>
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={authorEmail}
                onChange={(e) => setAuthorEmail(e.target.value)}
                placeholder="your@email.com"
                required
              />
            </div>
          </div>
          <div>
            <Label htmlFor="comment">Comment *</Label>
            <Textarea
              id="comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Share your thoughts..."
              rows={4}
              required
            />
          </div>
          <Button type="submit" disabled={submitting}>
            {submitting ? "Posting..." : "Post Comment"}
          </Button>
        </form>

        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse flex items-start space-x-3">
                <div className="h-8 w-8 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-muted rounded w-1/4"></div>
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : comments.length > 0 ? (
          <div className="space-y-6">
            {comments.map((comment) => (
              <CommentItem key={comment.id} comment={comment} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MessageCircle className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No comments yet. Be the first to share your thoughts!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
