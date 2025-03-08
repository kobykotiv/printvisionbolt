import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { Button } from "@/components/ui/button"
import { SectionHeader } from "@/components/ui/section-header"

export default function FeaturesPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="px-4 pt-32 pb-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Product Features</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to scale your print-on-demand business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
            {[
              {
                title: "Automated Workflows",
                description: "Set up once, run forever. Create automated workflows that handle product creation, updates, and syncing across multiple platforms.",
                icon: "🤖",
                details: [
                  "Bulk product creation",
                  "Automated syncing",
                  "Custom workflow rules",
                  "Error handling"
                ]
              },
              {
                title: "Multi-Platform Support",
                description: "Connect and manage your products across all major print-on-demand platforms from a single dashboard.",
                icon: "🔌",
                details: [
                  "Printify integration",
                  "Printful support",
                  "Gooten connection",
                  "Custom API support"
                ]
              },
              {
                title: "Design Management",
                description: "Powerful tools to manage and organize your design assets across all your products and platforms.",
                icon: "🎨",
                details: [
                  "Design library",
                  "Version control",
                  "Bulk editing",
                  "Asset organization"
                ]
              },
              {
                title: "Inventory Sync",
                description: "Keep your stock levels and product details synchronized across all connected platforms automatically.",
                icon: "📦",
                details: [
                  "Real-time sync",
                  "Stock alerts",
                  "Price updates",
                  "Description sync"
                ]
              },
              {
                title: "Analytics & Reports",
                description: "Get detailed insights into your product performance and automation efficiency.",
                icon: "📊",
                details: [
                  "Performance metrics",
                  "Success rates",
                  "Error reports",
                  "Optimization tips"
                ]
              },
              {
                title: "Template System",
                description: "Create and manage product templates to maintain consistency across your catalog.",
                icon: "📝",
                details: [
                  "Custom templates",
                  "Bulk application",
                  "Variable support",
                  "Template sharing"
                ]
              }
            ].map((feature, i) => (
              <div key={i} className="bg-background/50 rounded-lg p-8 border">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-none w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-2xl">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold">{feature.title}</h3>
                </div>
                <p className="text-muted-foreground mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-primary">•</span>
                      <span className="text-sm text-muted-foreground">{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Get Started?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators already using PrintVision to scale their business.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg">Start Free Trial</Button>
            <Button size="lg" variant="outline">View Pricing</Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
