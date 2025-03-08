import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/header"
import { Footer } from "@/components/ui/footer"

export default function PricingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <section className="px-4 pt-32 pb-24 bg-gradient-to-b from-background to-primary/5">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">Simple, Transparent Pricing</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your print-on-demand business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mt-16">
            {[
              {
                name: "Free",
                price: "$0",
                period: "/mo",
                description: "Perfect for testing the waters",
                features: [
                  "Up to 5 Items/Supplier/Template",
                  "Up to 3 Templates",
                  "Upload up to 10 Designs/day",
                  "Ad Supported",
                ],
                cta: "Start Free",
                popular: false
              },
              {
                name: "Creator",
                price: "$1",
                period: "/mo",
                description: "For hobbyist creators",
                features: [
                  "Up to 10 Items/Supplier/Template",
                  "Up to 10 Templates",
                  "Unlimited Uploading",
                  "No Ads",
                ],
                cta: "Start Creator Plan",
                popular: false
              },
              {
                name: "Pro",
                price: "$9",
                period: "/mo",
                description: "For growing businesses",
                features: [
                  "Up to 30 Items/Supplier/Template",
                  "Up to 20 Templates",
                  "Unlimited Uploading",
                  "No Ads",
                ],
                cta: "Start Pro Plan",
                popular: true
              },
              {
                name: "Enterprise",
                price: "$29",
                period: "/mo",
                description: "For serious sellers",
                features: [
                  "Unlimited Items/Template",
                  "Unlimited Templates",
                  "Unlimited Uploading",
                  "No Ads",
                ],
                cta: "Get Enterprise",
                popular: false
              }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`
                  p-8 rounded-xl
                  ${plan.popular 
                    ? 'bg-primary text-primary-foreground scale-105 shadow-lg' 
                    : 'bg-card border'
                  }
                `}
              >
                <div className="mb-8">
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="mb-4">
                    <span className="text-4xl font-bold">{plan.price}</span>
                    {plan.period && <span className="text-muted-foreground">{plan.period}</span>}
                  </div>
                  <p className="text-sm opacity-90">{plan.description}</p>
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-center gap-2">
                      <span className="text-primary">✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full"
                  variant={plan.popular ? "secondary" : "outline"}
                >
                  {plan.cta}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-24 bg-background">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="grid gap-8 text-left">
            {[
              {
                q: "What happens after my trial ends?",
                a: "After your 14-day trial ends, you'll automatically switch to our Free plan unless you choose to upgrade. We'll notify you before the trial ends."
              },
              {
                q: "Can I upgrade or downgrade at any time?",
                a: "Yes, you can change your plan at any time. When upgrading, you'll only pay the prorated difference. When downgrading, the new rate starts at your next billing cycle."
              },
              {
                q: "Do you offer refunds?",
                a: "We offer a 30-day money-back guarantee if you're not satisfied with our service. Contact our support team for assistance."
              },
              {
                q: "What payment methods do you accept?",
                a: "We accept all major credit cards (Visa, MasterCard, American Express) and PayPal. Enterprise customers can arrange for wire transfers."
              }
            ].map((faq, i) => (
              <div key={i}>
                <h3 className="font-bold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
