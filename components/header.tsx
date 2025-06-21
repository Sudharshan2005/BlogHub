"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { SearchBar } from "@/components/search-bar"
import { UserNav } from "@/components/user-nav"
import { PenTool, BookOpen, TrendingUp, Plus, LogIn } from "lucide-react"

export function Header() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const token = sessionStorage.getItem('token')
    setIsAuthenticated(!!token)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <PenTool className="h-6 w-6" />
            <span className="font-bold text-xl">BlogHub</span>
          </Link>
        </div>

        <div className="flex-1 max-w-md mx-8">
          <SearchBar />
        </div>

        <div className="flex items-center space-x-4">
          <Button asChild variant="ghost">
            <Link href="/explore">
              <BookOpen className="mr-2 h-4 w-4" />
              Explore
            </Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/trending">
              <TrendingUp className="mr-2 h-4 w-4" />
              Trending
            </Link>
          </Button>

          {isAuthenticated && (
            <Button asChild variant="ghost">
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Write
              </Link>
            </Button>
          )}

          <ModeToggle />

          {isAuthenticated ? (
            <UserNav />
          ) : (
            <Button asChild variant="ghost">
              <Link href="/auth/login">
                <LogIn className="mr-2 h-4 w-4" />
                Login
              </Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
