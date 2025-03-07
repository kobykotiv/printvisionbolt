import "./globals.css"
import { Inter as FontSans } from "next/font/google"
import type { Metadata } from "next"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "PrintVisionBolt - Smart CMS for Clothing Brands",
  description: "A powerful content management system for clothing brands with integrated print-on-demand services and automated store management.",
  keywords: [
    "CMS",
    "Clothing",
    "Print on Demand",
    "E-commerce",
    "Store Management",
    "API Integration"
  ]
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={fontSans.variable}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <main className="relative flex min-h-screen flex-col">
          {children}
        </main>
      </body>
    </html>
  )
}
