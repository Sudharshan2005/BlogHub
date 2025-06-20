"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { formatDistanceToNow } from "date-fns"
import { Search, MoreHorizontal, Edit, Trash2, Eye, Calendar, Filter } from "lucide-react"
import Link from "next/link"

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

interface BlogManagementProps {
  blogs: Blog[]
  filter: "all" | "published" | "draft" | "scheduled"
  setFilter: (filter: "all" | "published" | "draft" | "scheduled") => void
}

export function BlogManagement({ blogs, filter, setFilter }: BlogManagementProps) {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "draft":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "scheduled":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Manage Posts</CardTitle>
          <Button asChild>
            <Link href="/create">Create New Post</Link>
          </Button>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                {filter === "all" ? "All Posts" : filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setFilter("all")}>All Posts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("published")}>Published</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("draft")}>Drafts</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setFilter("scheduled")}>Scheduled</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <p>No posts found matching your criteria.</p>
            </div>
          ) : (
            filteredBlogs.map((blog) => (
              <div key={blog.id} className="border rounded-lg p-4 hover:bg-muted/50 transition-colors">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-semibold text-lg">{blog.title}</h3>
                      <Badge className={getStatusColor(blog.status)}>{blog.status}</Badge>
                    </div>

                    <p className="text-muted-foreground text-sm mb-3 line-clamp-2">{blog.excerpt}</p>

                    <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                      <span>{formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}</span>
                      <span className="flex items-center">
                        <Eye className="mr-1 h-3 w-3" />
                        {blog.views} views
                      </span>
                      <span>{blog.likes} likes</span>
                      <span>{blog.comments} comments</span>
                      {blog.scheduledFor && (
                        <span className="flex items-center">
                          <Calendar className="mr-1 h-3 w-3" />
                          Scheduled for {formatDistanceToNow(new Date(blog.scheduledFor), { addSuffix: true })}
                        </span>
                      )}
                    </div>
                  </div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/blog/${blog.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          View
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/edit/${blog.id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
