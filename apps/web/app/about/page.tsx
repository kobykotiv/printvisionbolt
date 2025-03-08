import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"
import { SectionHeader } from "@/components/ui/section-header"
import { Button } from "@/components/ui/button"

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      {/* Hero Section */}
      <section className="px-4 pt-32 pb-16 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Our Mission</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Empowering creators to build successful print-on-demand businesses through automation and innovation.
            </p>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="px-4 py-24 bg-background">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <SectionHeader
                title="Our Story"
                description="From a small side project to a comprehensive PoD automation platform"
              />
              <div className="mt-6 space-y-4 text-muted-foreground">
                <p>
                  PrintVision started in 2023 when our founder experienced the pain of manually
                  uploading thousands of designs to multiple print-on-demand platforms.
                </p>
                <p>
                  What began as a simple automation script evolved into a powerful platform
                  that helps creators focus on what they do best - creating amazing designs.
                </p>
              </div>
            </div>
            <div className="bg-primary/5 rounded-lg p-8">
              <div className="space-y-6">
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Our Vision</h3>
                    <p className="text-muted-foreground">
                      To become the industry standard for print-on-demand automation and scaling.
                    </p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    💪
                  </div>
                  <div>
                    <h3 className="font-bold mb-2">Our Values</h3>
                    <p className="text-muted-foreground">
                      Innovation, reliability, and customer success drive everything we do.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="px-4 py-24 bg-background/50">
        <div className="container mx-auto max-w-6xl">
          <SectionHeader
            title="Meet Our Team"
            description="The people behind PrintVision"
            centered
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
            {[
              {
                name: "Alex Chen",
                role: "Founder & CEO",
                image: "👨‍💼",
                bio: "10+ years in e-commerce automation"
              },
              {
                name: "Sarah Johnson",
                role: "Head of Product",
                image: "👩‍💼",
                bio: "Print-on-demand veteran"
              },
              {
                name: "Mike Roberts",
                role: "Lead Developer",
                image: "👨‍💻",
                bio: "API integration specialist"
              }
            ].map((member, i) => (
              <div key={i} className="text-center p-6 bg-background rounded-lg shadow-sm">
                <div className="w-20 h-20 mx-auto mb-4 text-4xl flex items-center justify-center bg-primary/10 rounded-full">
                  {member.image}
                </div>
                <h3 className="font-bold text-xl mb-1">{member.name}</h3>
                <p className="text-primary mb-2">{member.role}</p>
                <p className="text-muted-foreground">{member.bio}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-4 py-24 bg-primary/5">
        <div className="container mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to Transform Your PoD Business?</h2>
          <p className="text-muted-foreground mb-8">
            Join thousands of creators who are scaling their print-on-demand business with PrintVision.
          </p>
          <Button size="lg">Start Your Free Trial</Button>
        </div>
      </section>

      <Footer />
    </div>
  )
}
