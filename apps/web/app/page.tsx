import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "@/components/ui/section-header"
import { StepGuide } from "@/components/ui/step-guide"
import { TestimonialCard } from "@/components/ui/testimonial-card"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="relative px-4 pt-32 pb-32 overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
            <span className="px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              🚀 Launch Your PoD Empire Today
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Automate Your Way to
              <br />
              <span className="rainbow-text">PoD Success</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Stop wasting time on manual uploads.
              <br />
              Start scaling your print-on-demand business automatically.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              {/* <Button 
                size="lg" 
                className="shadow-lg hover:shadow-xl transition-all"
                asChild
              >
                <Link href="/pricing">View Pricing</Link>
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="backdrop-blur-sm bg-background/50"
              >
                Watch Demo
              </Button> */}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Hero Section */}
      <section className="px-4 py-24 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">10x</div>
              <p className="text-muted-foreground">Faster Product Upload</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Automated Operations</p>
            </div>
            <div className="p-6">
              <div className="text-4xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Error-Free Uploads</p>
            </div>
          </div>
        </div>
      </section>

      {/* Value Proposition Hero */}
      <section className="px-4 py-24 bg-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-medium">WHY CHOOSE US</span>
              <h2 className="text-4xl font-bold mt-4 mb-6">
                Scale Your PoD Business Without The Headaches
              </h2>
              <ul className="space-y-4">
                {[
                  "Automate product creation across multiple platforms",
                  "Bulk upload designs in minutes, not hours",
                  "Synchronize inventory across all your stores",
                  "Eliminate manual errors and inconsistencies"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <span className="text-primary">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Button className="mt-8">Get Started Now</Button>
            </div>
            <div className="bg-background rounded-lg p-8 shadow-lg">
              <div className="text-4xl mb-4">📈</div>
              <h3 className="text-2xl font-bold mb-4">
                From 10 to 10,000 Products
              </h3>
              <p className="text-muted-foreground">
                Our customers typically scale their product listings by 1000% within the first month. 
                No more manual work. Just pure, automated growth.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 bg-background" id="features">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="📝 Getting Started is Easy"
            description="Follow these simple steps to start automating your print-on-demand business"
            centered
          />
          <div className="mt-16 max-w-3xl mx-auto">
            <StepGuide
              steps={[
                {
                  number: "1",
                  title: "Sign Up",
                  description: [
                    "Visit PrintVision.Cloud and sign up for the Free Tier.",
                    "Complete the registration process and log in to your dashboard."
                  ],
                  icon: "✨"
                },
                {
                  number: "2",
                  title: "Configure API Keys",
                  description: [
                    "Navigate to the Settings section in your dashboard.",
                    "Enter the API keys from your print providers (e.g., Printify, Printful)."
                  ],
                  icon: "🔑"
                },
                {
                  number: "3",
                  title: "Create Your First Recipe",
                  description: [
                    "Go to the Recipes tab and click on New Recipe.",
                    "Choose your Blueprints (base products) and customize your template."
                  ],
                  icon: "📦"
                },
                {
                  number: "4",
                  title: "Upload & Sync",
                  description: [
                    "Upload your designs and assign them to your recipes.",
                    "Sync with your preferred platforms and start selling!"
                  ],
                  icon: "🚀"
                }
              ]}
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-24 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="🚀 Features"
            description="Discover the powerful features that make PrintVision.Cloud the ultimate print-on-demand automation tool"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Automated Workflows",
                description: "Create recipes to automate your print-on-demand workflow. Sync with your favorite platforms and print providers.",
                icon: "🤖"
              },
              {
                title: "Template Customization",
                description: "Customize your designs with our intuitive editor. Add text, images, and effects to create unique products.",
                icon: "🎨"
              },
              {
                title: "API Integration",
                description: "Connect with popular print-on-demand services like Printify, Printful, and Gooten. Manage all your orders in one place.",
                icon: "🔌"
              }
            ].map((feature, i) => (
              <div key={i} className="p-8 bg-background/50 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {feature.icon}
                  </div>
                  <h4 className="text-xl font-bold">{feature.title}</h4>
                </div>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="px-4 py-16 bg-background border-t">
        <div className="container mx-auto max-w-xl text-center">
          <h3 className="text-2xl font-bold mb-4">Stay in the Loop</h3>
          <p className="text-muted-foreground mb-8">
            Get the latest updates about new features and print-on-demand tips.
          </p>
          <form className="flex gap-4">
            <Input
              type="email"
              placeholder="Enter your email"
              className="flex-1"
            />
            <Button>Subscribe</Button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  )
}
