"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { BlogCard } from "@/components/blog-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Code, Palette, Briefcase, Cpu, Smartphone, Globe } from "lucide-react"

interface Category {
  id: string
  name: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  count: number
  color: string
}

const categories: Category[] = [
  {
    id: "programming",
    name: "Programming",
    description: "Code tutorials, best practices, and programming languages",
    icon: Code,
    count: 45,
    color: "bg-blue-500",
  },
  {
    id: "design",
    name: "Design",
    description: "UI/UX design, visual design, and design systems",
    icon: Palette,
    count: 32,
    color: "bg-purple-500",
  },
  {
    id: "career",
    name: "Career",
    description: "Career advice, interviews, and professional development",
    icon: Briefcase,
    count: 28,
    color: "bg-green-500",
  },
  {
    id: "ai",
    name: "AI & ML",
    description: "Artificial Intelligence and Machine Learning insights",
    icon: Cpu,
    count: 24,
    color: "bg-orange-500",
  },
  {
    id: "mobile",
    name: "Mobile",
    description: "Mobile app development and mobile technologies",
    icon: Smartphone,
    count: 19,
    color: "bg-pink-500",
  },
  {
    id: "web",
    name: "Web Development",
    description: "Frontend, backend, and full-stack web development",
    icon: Globe,
    count: 38,
    color: "bg-cyan-500",
  },
]

// Mock blog data for categories
const mockCategoryBlogs = {
  programming: [
    {
      id: "1",
      title: "Understanding TypeScript: A Comprehensive Guide",
      excerpt: "Dive deep into TypeScript and learn how it can improve your JavaScript development experience.",
      author: { name: "David Kim", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-14T16:20:00Z",
      readTime: 10,
      tags: ["TypeScript", "JavaScript", "Programming"],
      likes: 203,
      views: 1340,
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "2",
      title: "Building Scalable React Applications: Best Practices",
      excerpt: "Learn how to structure and build React applications that can scale with your business needs.",
      author: { name: "Michael Chen", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-12T14:30:00Z",
      readTime: 12,
      tags: ["React", "JavaScript", "Architecture"],
      likes: 189,
      views: 980,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  design: [
    {
      id: "3",
      title: "The Psychology of User Experience Design",
      excerpt: "Understanding how users think and behave can dramatically improve your design decisions.",
      author: { name: "Maria Garcia", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-09T15:10:00Z",
      readTime: 11,
      tags: ["UX Design", "Psychology", "Design"],
      likes: 134,
      views: 567,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
  web: [
    {
      id: "4",
      title: "The Future of Web Development: Trends to Watch in 2024",
      excerpt:
        "Explore the latest trends shaping the future of web development, from AI integration to new frameworks.",
      author: { name: "Sarah Johnson", avatar: "/placeholder.svg?height=40&width=40" },
      createdAt: "2024-01-15T10:00:00Z",
      readTime: 8,
      tags: ["Web Development", "Technology", "AI"],
      likes: 245,
      views: 1520,
      image: "/placeholder.svg?height=200&width=400",
    },
  ],
}

export default function CategoriesPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Browse by Category</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover content organized by topics that interest you most
            </p>
          </div>

          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Category Overview</TabsTrigger>
              <TabsTrigger value="browse">Browse Content</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((category) => {
                  const IconComponent = category.icon
                  return (
                    <Card key={category.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                      <CardHeader>
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 rounded-lg ${category.color} flex items-center justify-center`}>
                            <IconComponent className="h-5 w-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{category.name}</CardTitle>
                            <Badge variant="secondary">{category.count} articles</Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-muted-foreground text-sm mb-4">{category.description}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedCategory(category.id)
                            // Switch to browse tab
                            const browseTab = document.querySelector('[value="browse"]') as HTMLElement
                            browseTab?.click()
                          }}
                        >
                          Browse {category.name}
                        </Button>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </TabsContent>

            <TabsContent value="browse" className="mt-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Browse Articles</h2>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedCategory(null)}
                  >
                    All Categories
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {selectedCategory
                  ? mockCategoryBlogs[selectedCategory as keyof typeof mockCategoryBlogs]?.map((blog) => (
                      <BlogCard key={blog.id} blog={blog} />
                    )) || (
                      <div className="col-span-full text-center py-12">
                        <p className="text-muted-foreground">No articles found in this category yet.</p>
                      </div>
                    )
                  : // Show all blogs when no category is selected
                    Object.values(mockCategoryBlogs)
                      .flat()
                      .map((blog) => <BlogCard key={blog.id} blog={blog} />)}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}
