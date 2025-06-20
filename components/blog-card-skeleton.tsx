import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

interface BlogCardSkeletonProps {
  count?: number
}

export function BlogCardSkeleton({ count = 3 }: BlogCardSkeletonProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[...Array(count)].map((_, i) => (
        <Card key={i} className="h-full">
          <div className="h-48 bg-muted animate-pulse"></div>

          <CardHeader>
            <div className="flex items-center space-x-3 mb-3">
              <div className="h-8 w-8 bg-muted rounded-full animate-pulse"></div>
              <div className="space-y-1">
                <div className="h-3 w-20 bg-muted rounded animate-pulse"></div>
                <div className="h-2 w-16 bg-muted rounded animate-pulse"></div>
              </div>
            </div>
            <div className="h-5 w-3/4 bg-muted rounded animate-pulse"></div>
          </CardHeader>

          <CardContent>
            <div className="space-y-2 mb-4">
              <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-full bg-muted rounded animate-pulse"></div>
              <div className="h-3 w-2/3 bg-muted rounded animate-pulse"></div>
            </div>

            <div className="flex gap-1">
              <div className="h-5 w-12 bg-muted rounded animate-pulse"></div>
              <div className="h-5 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </CardContent>

          <CardFooter>
            <div className="flex justify-between items-center w-full">
              <div className="flex space-x-3">
                <div className="h-3 w-8 bg-muted rounded animate-pulse"></div>
                <div className="h-3 w-8 bg-muted rounded animate-pulse"></div>
              </div>
              <div className="h-3 w-16 bg-muted rounded animate-pulse"></div>
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
