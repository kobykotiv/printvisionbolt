import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_TOKEN } from '../lib/test-mode';
import {
  Palette, 
  Layers,
  Zap,
  Globe,
  ShoppingBag,
  Users,
  CheckCircle,
  ArrowRight,
  RefreshCw,
  Loader
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { Modal } from '../components/ui/Modal';

interface DemoStep {
  title: string;
  description: string;
  duration: number;
}

const demoSteps: DemoStep[] = [
  {
    title: 'Connecting to Printify API',
    description: 'Establishing secure connection and retrieving product catalog...',
    duration: 1500
  },
  {
    title: 'Syncing with Printful',
    description: 'Loading templates and product variants...',
    duration: 2000
  },
  {
    title: 'Loading Gooten Integration',
    description: 'Fetching available products and pricing...',
    duration: 1800
  },
  {
    title: 'Preparing Demo Data',
    description: 'Setting up mock products and collections...',
    duration: 1200
  }
];

const features = [
  {
    icon: Palette,
    title: 'Design Management',
    description: 'Upload and manage your designs with version control and metadata tracking.'
  },
  {
    icon: Layers,
    title: 'Template System',
    description: 'Create and customize product templates for multiple print providers.'
  },
  {
    icon: Zap,
    title: 'Automated Sync',
    description: 'Automatically sync your designs and products with print-on-demand providers.'
  },
  {
    icon: Globe,
    title: 'Multi-Platform',
    description: 'Connect with multiple print providers and e-commerce platforms.'
  },
  {
    icon: ShoppingBag,
    title: 'Product Management',
    description: 'Manage your products across all connected platforms from one place.'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Work together with your team using role-based access control.'
  }
];

const pricingPlans = [
  {
    name: 'Free',
    price: 0,
    features: [
      'Up to 5 Items/Supplier/Template',
      'Up to 3 Templates',
      'Upload up to 10 Designs/day',
      'Basic Analytics',
      'Email Support'
    ]
  },
   {
    name: 'Creator',
    price: 19,
    features: [
      'Up to 10 Items/Supplier',
      'Up to 10 Templates',
      'Upload up to 100 Designs/day',
      // 'Advanced Analytics',
      // 'Priority Support',
      'API Access',
      'Custom Branding'
    ],
    popular: true
  },
  {
    name: 'Pro',
    price: 29,
    features: [
      'Unlimited Items/Supplier',
      'Unlimited Templates',
      'Upload up to 100 Designs/day',
      'Advanced Analytics',
      'Priority Support',
      'API Access',
      'Custom Branding'
    ],
  },
  {
    name: 'Enterprise',
    price: 99,
    features: [
      'Everything in Pro',
      'Unlimited Designs',
      'Custom Integration',
      'Dedicated Support',
      // 'SLA Guarantee',
      'Custom Features',
      // 'Training Sessions'
    ]
  }
];

export function Landing() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showDemoModal, setShowDemoModal] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [currentStep, setCurrentStep] = React.useState(0);
  const [stepProgress, setStepProgress] = React.useState(0);

  const runDemoSequence = async () => {
    setShowDemoModal(true);
    setCurrentStep(0);
    setStepProgress(0);

    for (let i = 0; i < demoSteps.length; i++) {
      setCurrentStep(i);
      const step = demoSteps[i];
      
      // Simulate progress within each step
      for (let progress = 0; progress <= 100; progress += 5) {
        setStepProgress(progress);
        await new Promise(resolve => setTimeout(resolve, step.duration / 20));
      }
    }

    // Complete the demo sequence
    try {
      await signIn('demo@example.com', 'demo123');
      setShowDemoModal(false);
      navigate('/app/dashboard');
    } catch (error) {
      console.error('Error logging in:', error);
      setShowDemoModal(false);
    }
  };

  const handleDemoLogin = async () => {
    setLoading(true);
    try {
      await runDemoSequence();
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PrintVision.Cloud</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => window.location.href = `/demo-login?token=${DEMO_TOKEN}`}
                disabled={loading}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
              >
                Try Demo
              </button>
              <button
                onClick={() => navigate('/login')}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
              <span className="block">Streamline Your</span>
              <span className="block text-indigo-600">Print-on-Demand Business</span>
            </h1>
            <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
              Manage your designs, products, and print-on-demand operations across multiple platforms from a single dashboard.
            </p>
            <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
              <div className="rounded-md shadow">
                <button
                  onClick={() => navigate('/signup')}
                  className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10"
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* API Integration Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Seamless Integration with Print-on-Demand Providers
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Connect your business with leading print-on-demand services through our powerful API integrations.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src="https://printify.com/wp-content/themes/printify/images/logo.svg" alt="Printify" className="h-8" />
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Printify Integration</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Automatic product sync</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Real-time inventory updates</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Bulk product creation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src="https://www.printful.com/static/images/layout/printful-logo.svg" alt="Printful" className="h-8" />
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Printful Integration</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Automated order routing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Design template sync</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Shipping rate calculator</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="px-6 py-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <img src="https://www.gooten.com/wp-content/uploads/2020/10/gooten-logo-2x.png" alt="Gooten" className="h-8" />
                  </div>
                </div>
                <div className="mt-5">
                  <h3 className="text-lg font-medium text-gray-900">Gooten Integration</h3>
                  <ul className="mt-4 space-y-3">
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Global production network</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Smart order routing</span>
                    </li>
                    <li className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                      <span className="ml-3 text-gray-500">Quality control automation</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Everything you need to scale your POD business
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Powerful features to help you manage and grow your print-on-demand business efficiently.
            </p>
          </div>

          <div className="mt-20">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="pt-6">
                    <div className="flow-root bg-white rounded-lg px-6 pb-8">
                      <div className="-mt-6">
                        <div>
                          <span className="inline-flex items-center justify-center p-3 bg-indigo-500 rounded-md shadow-lg">
                            <Icon className="h-6 w-6 text-white" />
                          </span>
                        </div>
                        <h3 className="mt-8 text-lg font-medium text-gray-900 tracking-tight">
                          {feature.title}
                        </h3>
                        <p className="mt-5 text-base text-gray-500">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Section */}
      <div className="bg-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 text-lg text-gray-500">
              Choose the plan that best fits your needs. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {pricingPlans.map((plan) => (
              <div
                key={plan.name}
                className={`relative flex flex-col rounded-2xl border ${
                  plan.popular ? 'border-indigo-600' : 'border-gray-200'
                } p-8 shadow-sm`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 right-8">
                    <span className="inline-flex items-center rounded-full bg-indigo-100 px-4 py-1 text-xs font-medium text-indigo-600">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                  <p className="mt-4">
                    <span className="text-4xl font-bold tracking-tight text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-base font-medium text-gray-500">/month</span>
                  </p>
                </div>

                <ul className="space-y-4 flex-1">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-indigo-500 shrink-0" />
                      <span className="ml-3 text-base text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate('/signup')}
                  className={`mt-8 w-full rounded-md px-4 py-2 text-sm font-semibold shadow-sm ${
                    plan.popular
                      ? 'bg-indigo-600 text-white hover:bg-indigo-500'
                      : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
                  }`}
                >
                  Get started
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Ready to get started?</h2>
            <p className="mt-4 text-lg text-gray-500">
              Join thousands of print-on-demand businesses using PrintVision.Cloud to streamline their operations.
            </p>
            <div className="mt-8">
              <button
                onClick={() => navigate('/signup')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Palette className="h-8 w-8 text-indigo-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">PrintVision.Cloud</span>
            </div>
            <p className="text-base text-gray-500">
              &copy; {new Date().getFullYear()} PrintVision.Cloud. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Demo Loading Modal */}
      <Modal
        isOpen={showDemoModal}
        onClose={() => {}}
        title="Setting Up Demo Environment"
      >
        <div className="space-y-6">
          {demoSteps.map((step, index) => (
            <div
              key={index}
              className={`${
                index === currentStep
                  ? 'text-gray-900'
                  : index < currentStep
                  ? 'text-green-600'
                  : 'text-gray-400'
              }`}
            >
              <div className="flex items-center">
                {index < currentStep ? (
                  <CheckCircle className="h-5 w-5 mr-2" />
                ) : index === currentStep ? (
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                ) : (
                  <div className="h-5 w-5 mr-2" />
                )}
                <span className="font-medium">{step.title}</span>
              </div>
              {index === currentStep && (
                <div className="mt-2">
                  <p className="text-sm text-gray-500">{step.description}</p>
                  <div className="mt-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 transition-all duration-500"
                      style={{ width: `${stepProgress}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
}
