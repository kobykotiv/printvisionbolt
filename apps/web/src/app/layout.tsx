import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { GlassHeader } from '@printvisionbolt/shared-ui/components/glass'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'PrintVisionBolt - Print on Demand Platform',
  description: 'Advanced print on demand platform with powerful customization features',
}

interface NavigationItem {
  name: string;
  href: string;
}

interface ActionItem {
  name: string;
  href: string;
  variant: 'primary' | 'secondary';
}

const navigation: NavigationItem[] = [
  { name: 'Features', href: '#features' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

const actions: ActionItem[] = [
  { name: 'Log in', href: '/login', variant: 'secondary' },
  { name: 'Get started', href: '/register', variant: 'primary' },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} h-full bg-gradient-to-br from-primary-100 via-white to-primary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900`}>
        <div className="min-h-screen flex flex-col">
          <GlassHeader 
            className="backdrop-blur-glass border-b border-white/10"
            navigation={navigation}
            actions={actions}
          />
          <main className="flex-grow">
            {children}
          </main>
          <footer className="mt-auto py-8 px-4 backdrop-blur-glass border-t border-white/10">
            <div className="container mx-auto text-center text-sm text-gray-600 dark:text-gray-400">
              © 2025 PrintVisionBolt. All rights reserved.
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}