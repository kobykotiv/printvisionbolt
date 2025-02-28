import React from 'react';
import { Link } from 'react-router-dom';
import { LandingLayout } from '../components/layout/LandingLayout';

export default function Landing() {
  const plans = [
    {
      name: 'Free',
      price: '0',
      description: 'Perfect for getting started',
      features: ['Limited items/templates', 'Basic sync features', 'Community support', 'Ad-supported'],
    },
    {
      name: 'Creator',
      price: '1',
      description: 'Great for small creators',
      features: ['Additional templates', 'No ads', 'Email support'],
    },
    {
      name: 'Pro',
      price: '9',
      description: 'Built for growing businesses',
      features: ['Increased item limits', 'Priority support', 'Advanced API access'],
    },
    {
      name: 'Enterprise',
      price: '29',
      description: 'For large-scale operations',
      features: ['Unlimited everything', 'Custom integrations', 'Dedicated support', 'Full API access'],
    },
  ];

  const testimonials = [
    {
      quote: "PrintVision.Cloud has completely transformed how I manage my POD business. The automation features save me hours every week.",
      author: "Sarah J.",
      role: "Independent Creator",
    },
    {
      quote: "The template system is a game-changer. I can create and publish new designs across multiple platforms in minutes.",
      author: "Mike R.",
      role: "E-commerce Store Owner",
    },
    {
      quote: "Their API integration helped us scale our operations from hundreds to thousands of products effortlessly.",
      author: "Christina L.",
      role: "Print Shop Manager",
    },
  ];

  return (
    <LandingLayout>
      {/* Hero Section */}
      <section className="relative bg-white dark:bg-secondary-900 overflow-hidden">
        <div className="max-w-7xl mx-auto pt-20 pb-16 px-4 sm:pt-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-secondary-900 dark:text-white sm:text-5xl md:text-6xl">
              <span className="block">Effortlessly Automate Your</span>
              <span className="block text-primary-600 dark:text-primary-500">Print-on-Demand Business</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-secondary-500 dark:text-secondary-400 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Seamlessly sync, manage, and expand your product listings across multiple platforms—all from one intuitive dashboard.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <Link to="/signup" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 md:py-4 md:text-lg md:px-10 dark:bg-primary-500 dark:hover:bg-primary-600">
                  Start for Free
                </Link>
              </div>
              <div className="mt-3 rounded-md shadow sm:mt-0 sm:ml-3">
                <a href="#features" className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-secondary-50 md:py-4 md:text-lg md:px-10 dark:bg-secondary-800 dark:text-primary-400 dark:hover:bg-secondary-700">
                  Explore Features
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">How It Works</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500 dark:text-secondary-400">
              Get started in minutes with our simple setup process
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: 'Connect your supplier',
                description: 'Integrate with Printify, Printful, Gooten, and more',
                icon: '🔌',
              },
              {
                title: 'Create templates',
                description: 'Design and customize your product templates',
                icon: '🎨',
              },
              {
                title: 'Sync products',
                description: 'Push to Shopify, Amazon, TikTok Shop, and beyond',
                icon: '🔄',
              },
              {
                title: 'Automate drops',
                description: 'Schedule releases and manage inventory automatically',
                icon: '⚡',
              },
            ].map((step, index) => (
              <div key={index} className="relative bg-white dark:bg-secondary-900 p-6 rounded-lg shadow-sm">
                <div className="text-4xl mb-4">{step.icon}</div>
                <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{step.title}</h3>
                <p className="mt-2 text-base text-secondary-500 dark:text-secondary-400">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-16 bg-secondary-50 dark:bg-secondary-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">Simple, Transparent Pricing</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500 dark:text-secondary-400">
              Choose the plan that best fits your business needs
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan, index) => (
              <div key={index} className="bg-white dark:bg-secondary-900 rounded-lg shadow-sm divide-y divide-secondary-200 dark:divide-secondary-700">
                <div className="p-6">
                  <h3 className="text-lg font-medium text-secondary-900 dark:text-white">{plan.name}</h3>
                  <p className="mt-2 text-sm text-secondary-500 dark:text-secondary-400">{plan.description}</p>
                  <p className="mt-4">
                    <span className="text-4xl font-extrabold text-secondary-900 dark:text-white">${plan.price}</span>
                    <span className="text-base font-medium text-secondary-500 dark:text-secondary-400">/mo</span>
                  </p>
                  <Link to="/signup" className="mt-8 block w-full bg-primary-600 dark:bg-primary-500 text-white rounded-md py-2 text-sm font-semibold text-center hover:bg-primary-700 dark:hover:bg-primary-600">
                    Start {plan.name} Plan
                  </Link>
                </div>
                <div className="px-6 pt-6 pb-8">
                  <h4 className="text-sm font-medium text-secondary-900 dark:text-white">What's included</h4>
                  <ul className="mt-6 space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex">
                        <span className="text-green-500">✓</span>
                        <span className="ml-3 text-sm text-secondary-500 dark:text-secondary-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white dark:bg-secondary-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl">
              Trusted by Print-on-Demand Creators
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-secondary-500 dark:text-secondary-400">
              See what our users are saying about PrintVision.Cloud
            </p>
          </div>
          <div className="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-secondary-50 dark:bg-secondary-800 rounded-lg p-8">
                <p className="text-lg text-secondary-900 dark:text-white">"{testimonial.quote}"</p>
                <div className="mt-6">
                  <p className="text-base font-medium text-secondary-900 dark:text-white">{testimonial.author}</p>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="bg-primary-600 dark:bg-primary-500">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:py-16 lg:px-8 lg:flex lg:items-center lg:justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            <span className="block">Ready to get started?</span>
            <span className="block text-primary-200">Start automating your print-on-demand business today.</span>
          </h2>
          <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
            <div className="inline-flex rounded-md shadow">
              <Link to="/signup" className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-primary-600 bg-white hover:bg-primary-50 dark:bg-secondary-800 dark:text-primary-400 dark:hover:bg-secondary-700">
                Get started
              </Link>
            </div>
          </div>
        </div>
      </section>
    </LandingLayout>
  );
}
