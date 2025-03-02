'use client'

import Card from '../components/Card'

interface Feature {
  title: string;
  description: string;
  icon: string;
}

const features: Feature[] = [
  {
    title: 'Print On Demand',
    description: 'Automate your print-on-demand business with our advanced platform.',
    icon: '🖨️'
  },
  {
    title: 'Multiple Providers',
    description: 'Connect with leading print providers worldwide through a single interface.',
    icon: '🌐'
  },
  {
    title: 'Smart Routing',
    description: 'Automatically route orders to the best provider based on location and cost.',
    icon: '🎯'
  },
  {
    title: 'Real-time Analytics',
    description: 'Track your business performance with detailed analytics and insights.',
    icon: '📊'
  }
];

const pricingTiers = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      'Basic print-on-demand',
      'Up to 100 products',
      'Standard analytics',
      'Email support'
    ]
  },
  {
    name: 'Creator',
    price: '$29',
    description: 'For growing businesses',
    features: [
      'Advanced print-on-demand',
      'Up to 1000 products',
      'Enhanced analytics',
      'Priority support'
    ]
  },
  {
    name: 'Pro',
    price: '$99',
    description: 'For professional sellers',
    features: [
      'Enterprise print-on-demand',
      'Unlimited products',
      'Custom analytics',
      '24/7 support'
    ]
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col gap-24 py-16">
      {/* Hero Section */}
      <section className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-8">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
            Print On Demand, Reimagined
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
            Streamline your print-on-demand business with our powerful platform. Connect multiple providers, automate routing, and scale your business effortlessly.
          </p>
          <div className="flex gap-4">
            <a href="/register" className="px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              Get Started Free
            </a>
            <a href="#features" className="px-6 py-3 border border-gray-300 dark:border-gray-700 rounded-lg hover:border-primary-600 transition-colors">
              Learn More
            </a>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="p-6">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600 dark:text-gray-300">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Pricing</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {pricingTiers.map((tier) => (
            <Card key={tier.name} className="p-8">
              <h3 className="text-2xl font-semibold mb-2">{tier.name}</h3>
              <p className="text-4xl font-bold mb-4">{tier.price}<span className="text-lg font-normal">/month</span></p>
              <p className="text-gray-600 dark:text-gray-300 mb-6">{tier.description}</p>
              <ul className="space-y-4 mb-8">
                {tier.features.map((feature) => (
                  <li key={feature} className="flex items-center">
                    <svg className="w-5 h-5 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>
              <a href="/register" className="block w-full text-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                Get Started
              </a>
            </Card>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">About PrintVisionBolt</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            PrintVisionBolt is the next generation print-on-demand platform, designed to help creators and businesses scale their operations effortlessly. Our platform combines cutting-edge technology with seamless integration to provide you with the tools you need to succeed.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-6">Get in Touch</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Have questions about PrintVisionBolt? Our team is here to help you get started and make the most of our platform.
          </p>
          <a href="mailto:support@printvisionbolt.com" className="inline-flex items-center px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Contact Us
          </a>
        </div>
      </section>
    </div>
  )
}