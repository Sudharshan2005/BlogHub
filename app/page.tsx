"use client";

import { Suspense, useEffect, useState } from "react"
import { Header } from "@/components/header"
import { HeroSection } from "@/components/hero-section"
import { FeaturedBlogs } from "@/components/featured-blogs"
import { RecentBlogs } from "@/components/recent-blogs"
import { Footer } from "@/components/footer"
import { BlogCardSkeleton } from "@/components/blog-card-skeleton"

export default function HomePage() {

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <section className="py-12">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Featured Blogs</h2>
            <Suspense fallback={<BlogCardSkeleton count={3} />}>
              <FeaturedBlogs />
            </Suspense>
          </div>
        </section>
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-8">Recent Posts</h2>
            <Suspense fallback={<BlogCardSkeleton count={6} />}>
              <RecentBlogs />
            </Suspense>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
