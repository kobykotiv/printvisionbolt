import React from 'react';
import { useNavigate } from 'react-router-dom';
import PricingCard from '../components/ui/PricingCard';

const PRICING_PLANS = [
  {
    name: 'Free',
    price: '$0',
    description: 'Perfect for getting started',
    features: [
      { name: 'Limited items/templates', included: true },
      { name: 'Basic sync features', included: true },
      { name: 'Community support', included: true },
      { name: 'Ad-supported', included: true },
      { name: 'Email support', included: false },
      { name: 'Priority support', included: false },
      { name: 'Advanced API access', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Creator',
    price: '$1',
    description: 'Great for small creators',
    features: [
      { name: 'Limited items/templates', included: true },
      { name: 'Basic sync features', included: true },
      { name: 'Community support', included: true },
      { name: 'Additional templates', included: true },
      { name: 'No ads', included: true },
      { name: 'Email support', included: true },
      { name: 'Priority support', included: false },
      { name: 'Custom integrations', included: false },
    ],
  },
  {
    name: 'Pro',
    price: '$9',
    description: 'Built for growing businesses',
    features: [
      { name: 'Limited items/templates', included: true },
      { name: 'Basic sync features', included: true },
      { name: 'Community support', included: true },
      { name: 'Additional templates', included: true },
      { name: 'No ads', included: true },
      { name: 'Increased item limits', included: true },
      { name: 'Priority support', included: true },
      { name: 'Advanced API access', included: true },
    ],
  },
  {
    name: 'Enterprise',
    price: '$29',
    description: 'For large-scale operations',
    features: [
      { name: 'Unlimited everything', included: true },
      { name: 'Basic sync features', included: true },
      { name: 'Community support', included: true },
      { name: 'Additional templates', included: true },
      { name: 'No ads', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated support', included: true },
      { name: 'Full API access', included: true },
    ],
  },
];

const Pricing = () => {
  const navigate = useNavigate();

  const handleSelectPlan = (planName: string) => {
    navigate('/signup', { state: { selectedPlan: planName } });
  };

  return (
    <div className="bg-secondary-50 dark:bg-secondary-800 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-secondary-900 dark:text-white sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-xl text-secondary-500 dark:text-secondary-400 max-w-3xl mx-auto">
            Choose the plan that best fits your business needs
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="mt-20 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {PRICING_PLANS.map((plan, index) => (
            <PricingCard
              key={plan.name}
              name={plan.name}
              price={plan.price}
              description={plan.description}
              features={plan.features}
              highlighted={index === 2} // Highlight the Pro plan
              onSelect={() => handleSelectPlan(plan.name)}
            />
          ))}
        </div>

        {/* FAQ Section */}
        <div className="mt-24 text-center">
          <h3 className="text-2xl font-bold text-secondary-900 dark:text-white">
            Frequently Asked Questions
          </h3>
          <div className="mt-8 max-w-3xl mx-auto">
            <dl className="space-y-8">
              <div>
                <dt className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Can I switch plans later?
                </dt>
                <dd className="mt-2 text-secondary-500 dark:text-secondary-400">
                  Yes, you can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-secondary-900 dark:text-white">
                  What payment methods do you accept?
                </dt>
                <dd className="mt-2 text-secondary-500 dark:text-secondary-400">
                  We accept all major credit cards and PayPal. For Enterprise plans, we also support wire transfers.
                </dd>
              </div>
              <div>
                <dt className="text-lg font-semibold text-secondary-900 dark:text-white">
                  Is there a free trial?
                </dt>
                <dd className="mt-2 text-secondary-500 dark:text-secondary-400">
                  Yes, you can start with our Free plan and upgrade whenever you're ready. No credit card required.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pricing;