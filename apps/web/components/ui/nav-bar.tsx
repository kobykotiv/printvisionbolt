'use client'

import { Button } from './button'
import { cn } from '@/lib/utils'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export function NavBar() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isScrolled, setIsScrolled] = useState(false)

  async function signInWithDemo() {
    await supabase.auth.signInWithPassword({
      email: 'demo@printvision.cloud',
      password: 'demo1234'
    })
    router.refresh()
  }

  return (
    <nav 
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled 
          ? 'bg-background/80 backdrop-blur-md shadow-md py-4' 
          : 'bg-transparent py-6'
      )}
    >
      <div className="container mx-auto max-w-6xl px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="/" className="font-bold text-xl">
            PrintVision.Cloud
          </a>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <a 
              href="#features" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </a>
            <a 
              href="#pricing" 
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </a>
            <Button 
              variant="outline" 
              className="backdrop-blur-sm bg-background/50"
              onClick={signInWithDemo}
            >
              Try Demo
            </Button>
            <Button 
              variant="ghost"
              onClick={() => router.push('/login')}
            >
              Sign In
            </Button>
            <Button 
              onClick={() => router.push('/signup')}
            >
              Sign Up
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2 hover:bg-accent rounded-lg">
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
        </div>
      </div>
    </nav>
  )
}