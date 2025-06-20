import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp, Users, Eye, Heart } from "lucide-react"

interface StatsCardsProps {
  stats: {
    totalBlogs: number
    totalViews: number
    totalLikes: number
    totalComments: number
  }
  loading: boolean
}

export function StatsCards({ stats, loading }: StatsCardsProps) {
  const cards = [
    {
      title: "Total Posts",
      value: stats.totalBlogs,
      icon: TrendingUp,
      description: "Published blog posts",
    },
    {
      title: "Total Views",
      value: stats.totalViews,
      icon: Eye,
      description: "Across all posts",
    },
    {
      title: "Total Likes",
      value: stats.totalLikes,
      icon: Heart,
      description: "From readers",
    },
    {
      title: "Comments",
      value: stats.totalComments,
      icon: Users,
      description: "Reader engagement",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <card.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? <div className="h-8 w-16 bg-muted animate-pulse rounded"></div> : card.value.toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
