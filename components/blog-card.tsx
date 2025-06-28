import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Eye, Heart, Clock } from "lucide-react"

interface BlogCardProps {
  blog: {
    _id: string
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
}

export function BlogCard({ blog }: BlogCardProps) {
  return (
    <Card className="h-full hover:shadow-lg transition-shadow overflow-hidden">
      {blog.image && (
        <div className="relative h-48 w-full">
          <Image src={blog.image || "/placeholder.svg"} alt={blog.title} fill className="object-cover" />
        </div>
      )}

      <CardHeader>
        <div className="flex items-center space-x-3 mb-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={blog.author.avatar || "/placeholder.svg"} />
            <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-medium">{blog.author.name}</p>
            <p className="text-xs text-muted-foreground">
              {formatDistanceToNow(new Date(blog.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>
        <Link href={`/blog/${blog._id}`}>
          <h3 className="text-lg font-semibold hover:text-primary cursor-pointer line-clamp-2">{blog.title}</h3>
        </Link>
      </CardHeader>

      <CardContent>
        <p className="text-muted-foreground text-sm line-clamp-3 mb-4">{blog.excerpt}</p>

        <div className="flex flex-wrap gap-1">
          {blog.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex justify-between items-center text-xs text-muted-foreground">
        <div className="flex items-center space-x-3">
          <span className="flex items-center">
            <Eye className="mr-1 h-3 w-3" />
            {blog.views}
          </span>
          <span className="flex items-center">
            <Heart className="mr-1 h-3 w-3" />
            {blog.likes}
          </span>
        </div>
        <span className="flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          {blog.readTime} min read
        </span>
      </CardFooter>
    </Card>
  )
}
