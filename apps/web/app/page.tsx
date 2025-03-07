import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { SectionHeader } from "@/components/ui/section-header"
import { cn } from "@/lib/utils"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative px-4 pt-20 pb-32 overflow-hidden bg-gradient-to-b from-background to-primary/5">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        <div className="container relative mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center gap-6 animate-fade-in">
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Print on Demand
              <br />
              <span className="gradient-text">that scales.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl">
              Deploy instantly. Focus on Selling your art Online.
              Manual uploads are for losers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button size="lg" className="shadow-lg hover:shadow-xl transition-all">
                Start Now - It's Free
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="backdrop-blur-sm bg-background/50"
              >
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="px-4 py-24 bg-background" id="features">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader 
            title="You've been doing it wrong this whole time"
            description="There's an easier, smarter way that gets better results, and it's time to switch things up."
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Unified Dashboard",
                description: "Manage all your products, designs, and integrations from one slick interface—like a command center for your merch empire.",
                icon: "🎯"
              },
              {
                title: "API Integrations",
                description: "Seamlessly link Printify, Printful, (and more soon) to sync your products with the push of a button.",
                icon: "🔌"
              },
              {
                title: "Blueprint & Recipe Templates",
                description: "Build customizable product templates that are ready for any design. Like Legos, but for grown-up stuff.",
                icon: "📐"
              },
              {
                title: "Automatic Syncing",
                description: "Keep your products updated across multiple platforms—automatically. Set it and forget it.",
                icon: "🔄"
              },
              {
                title: "Design Uploads",
                description: "Upload and assign designs to multiple products in one go. No AI required, just good ol' drag-and-drop.",
                icon: "🎨"
              },
              {
                title: "Price & Variant Control",
                description: "Fine-tune your pricing and variants all from one tab, so you can focus on those sweet, sweet profits.",
                icon: "💰"
              },
            ].map((feature, i) => (
              <div 
                key={i} 
                className={cn(
                  "group p-8 rounded-xl",
                  "transform transition-all duration-300 hover:-translate-y-1",
                  "bg-accent/50 hover:bg-accent"
                )}
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground group-hover:text-foreground transition-colors">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="px-4 py-24 bg-muted/30" id="pricing">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader 
            title="Pick a Plan"
            description="Start with our free tier and scale as you grow"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                name: "Free",
                price: "0",
                features: [
                  "Up to 5 Items/Supplier/Template",
                  "Up to 3 Templates",
                  "Upload up to 10 Designs/day",
                  "Ad Supported"
                ]
              },
              {
                name: "Creator",
                price: "1",
                features: [
                  "Up to 10 items/Supplier/Template",
                  "Up to 10 Templates",
                  "Unlimited Uploading",
                  "No Ads"
                ]
              },
              {
                name: "Pro",
                price: "9",
                features: [
                  "Up to 30 items/Supplier/Template",
                  "Up to 20 Templates",
                  "Unlimited Uploading",
                  "No Ads"
                ]
              },
              {
                name: "Enterprise",
                price: "29",
                features: [
                  "Unlimited Items/Template",
                  "Unlimited Templates",
                  "Unlimited Uploading",
                  "No Ads"
                ]
              }
            ].map((plan, i) => (
              <div 
                key={i} 
                className={cn(
                  "flex flex-col p-8 rounded-xl",
                  "transform transition-all duration-300 hover:-translate-y-1",
                  "bg-card shadow-lg hover:shadow-xl"
                )}
              >
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="text-4xl font-bold mb-6">
                  ${plan.price}
                  <span className="text-lg text-muted-foreground">/mo</span>
                </div>
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-3">
                      <svg
                        className="w-5 h-5 text-primary"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button 
                  variant={i === 2 ? "default" : "outline"}
                  className="mt-auto"
                >
                  Get Started
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col items-center text-center gap-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              🚀 Bulk Publish Designs in Seconds
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl">
              You can finally focus on your art without the hassle of managing tedious product setups. 
              Our easy-to-use platform handles everything from syncing your designs with print providers 
              to managing product templates.
            </p>
            <Button 
              size="lg"
              variant="secondary"
              className="shadow-lg hover:shadow-xl transition-shadow"
            >
              Start now →
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-12 bg-background/50 border-t">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              {
                title: "Connect with us",
                links: ["Support", "Documentation", "FAQs", "Status"]
              },
              {
                title: "Company",
                links: ["About", "Contact us", "Privacy", "Terms"]
              }
            ].map((section, i) => (
              <div key={i}>
                <h3 className="font-semibold mb-4">{section.title}</h3>
                <ul className="space-y-2">
                  {section.links.map((link, j) => (
                    <li key={j}>
                      <a 
                        href="#" 
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t text-center text-muted-foreground">
            <p>© 2025 PrintVision.Cloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
