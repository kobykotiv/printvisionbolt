'use client'

import { Button } from './button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface MobileNavProps {
  isOpen: boolean
  onClose: () => void
}

export function MobileNav({ isOpen, onClose }: MobileNavProps) {
  // Prevent scrolling when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        className={cn(
          'fixed inset-0 bg-background/80 backdrop-blur-sm z-50 transition-opacity duration-300',
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Mobile menu panel */}
      <div
        className={cn(
          'fixed inset-y-0 right-0 w-full max-w-xs bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
          'border-l p-6 shadow-lg z-50',
          'transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex justify-end mb-8">
            <button
              onClick={onClose}
              className="p-2 -mr-2 hover:bg-accent rounded-lg"
              aria-label="Close menu"
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
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <nav className="flex-1 space-y-6">
            <Link
              href="/features"
              onClick={onClose}
              className="block text-lg font-medium hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#pricing"
              onClick={onClose}
              className="block text-lg font-medium hover:text-primary transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="https://blog.printvision.cloud"
              onClick={onClose}
              className="block text-lg font-medium hover:text-primary transition-colors"
            >
              Blog
            </Link>
          </nav>

          <div className="pt-6 border-t space-y-4">
            <Button
              variant="outline"
              className="w-full justify-center"
              onClick={() => {
                onClose()
                window.location.href = '/login'
              }}
            >
              Sign In
            </Button>
            <Button
              className="w-full justify-center"
              onClick={() => {
                onClose()
                window.location.href = '/signup'
              }}
            >
              Get Started
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}