'use client'

import { Button } from "@/components/ui/button"
import { MobileNav } from "@/components/ui/mobile-nav"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { useState, useEffect } from "react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        isScrolled 
          ? "bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
          : "bg-background/0"
      )}>
        <div className="container flex h-16 max-w-6xl items-center">
          <div className="flex flex-1 items-center justify-between space-x-4">
            <nav className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-2">
                <span className="font-bold sm:inline-block">
                  PrintVision.Cloud
                </span>
              </Link>
              <div className="hidden gap-6 md:flex">
                <Link 
                  href="/features" 
                  className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Features
                </Link>
                <Link 
                  href="#pricing"
                  className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Pricing
                </Link>
                <Link 
                  href="https://blog.printvision.cloud"
                  className="flex items-center text-lg font-medium text-muted-foreground transition-colors hover:text-foreground"
                >
                  Blog
                </Link>
              </div>
            </nav>
            <nav className="flex items-center space-x-2">
              <div className="hidden md:flex items-center space-x-2">
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/login">
                    Sign In
                  </Link>
                </Button>
                <Button size="sm" asChild>
                  <Link href="/signup">
                    Get Started
                  </Link>
                </Button>
              </div>
              {/* Mobile menu button */}
              <button
                className="md:hidden p-2 -mr-2 hover:bg-accent rounded-lg"
                onClick={() => setIsMobileMenuOpen(true)}
                aria-label="Open menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </>
  )
}