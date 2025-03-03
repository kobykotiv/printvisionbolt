import React from 'react';
import { useShop } from '../contexts/ShopContext';
import { CreditCard, Check, ArrowRight, Shield } from 'lucide-react';

export interface Feature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  name: string;
  price: number;
  features: Feature[];
  current?: boolean;
}

const plans: PricingPlan[] = [
  {
    name: "Free",
    price: 0,
    features: [
      { name: "1 Shop Endpoint", included: true },
      { name: "3 Templates", included: true },
      { name: "10 Daily Uploads", included: true },
      { name: "Community Support", included: true },
      { name: "Multiple Shops", included: false },
      { name: "API Access", included: false },
    ],
  },
  {
    name: "Creator",
    price: 1,
    features: [
      { name: "1 Shop Endpoint", included: true },
      { name: "10 Templates", included: true },
      { name: "100 Daily Uploads", included: true },
      { name: "Community Support", included: true },
    ],
  },
  {
<<<<<<< HEAD
    name: "Pro",
=======
    name: "Creator",
>>>>>>> parent of 2d55731 (Revert "implementing cms")
    price: 9,
    features: [
      { name: "Up to 3 Shops", included: true },
      { name: "30 Templates", included: true },
      { name: "100 Daily Uploads", included: true },
      { name: "Priority Support", included: true },
      { name: "API Access", included: true },
      { name: "Custom Branding", included: true },
    ],
  },
  {
    name: "Enterprise",
    price: 29,
    features: [
      { name: "Up to 10 Shops", included: true },
      { name: "Unlimited Templates", included: true },
      { name: "Unlimited Uploads", included: true },
      { name: "Dedicated Support", included: true },
      { name: "API Access", included: true },
      // { name: "White Label", included: true },
    ],
  },
];

export function Billing() {
  useShop();
  const [selectedPlan, setSelectedPlan] = React.useState<string | null>(null);

  // In production, fetch this from your backend
  const currentPlan = 'free';
  const billingPeriod = 'monthly';
  const nextBillingDate = new Date();
  nextBillingDate.setMonth(nextBillingDate.getMonth() + 1);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Current Plan Summary */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Billing & Subscription</h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your {selectedPlan} subscription and payment details
            </p>
          </div>
          <CreditCard className="h-8 w-8 text-gray-400" />
        </div>

        <div className="mt-6 border-t border-gray-200 pt-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
            <div>
              <dt className="text-sm font-medium text-gray-500">Current Plan</dt>
              <dd className="mt-1 text-lg font-medium text-gray-900 capitalize">{currentPlan}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Billing Period</dt>
              <dd className="mt-1 text-lg font-medium text-gray-900 capitalize">{billingPeriod}</dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Next Billing Date</dt>
              <dd className="mt-1 text-lg font-medium text-gray-900">
                {nextBillingDate.toLocaleDateString()}
              </dd>
            </div>
            <div>
              <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
              <dd className="mt-1">
                <button className="inline-flex items-center px-3 py-1 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                  Update Payment Method
                </button>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900">Usage Overview</h3>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Active Shops</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">1</p>
            <div className="mt-1 text-xs text-gray-500">of 1 included</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Design Uploads</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">45</p>
            <div className="mt-1 text-xs text-gray-500">of 100 daily</div>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm font-medium text-gray-500">Storage Used</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">2.1 GB</p>
            <div className="mt-1 text-xs text-gray-500">of 5 GB included</div>
          </div>
        </div>
      </div>

      {/* Available Plans */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-gray-900">Available Plans</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-lg border ${
                plan.name.toLowerCase() === currentPlan
                  ? 'border-indigo-600'
                  : 'border-gray-300'
              } bg-white p-6 shadow-sm hover:border-indigo-600 transition-colors`}
            >
              {plan.name.toLowerCase() === currentPlan && (
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2">
                  <span className="inline-flex items-center rounded-full bg-indigo-100 px-3 py-0.5 text-sm font-medium text-indigo-800">
                    Current Plan
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">{plan.name}</h3>
                <Shield className="h-5 w-5 text-gray-400" />
              </div>
              <p className="mt-4">
                <span className="text-4xl font-bold tracking-tight text-gray-900">
                  ${plan.price}
                </span>
                <span className="text-base font-medium text-gray-500">/month</span>
              </p>
              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li key={feature.name} className="flex items-start">
                    <div className="flex-shrink-0">
                      <Check
                        className={`h-5 w-5 ${
                          feature.included ? 'text-indigo-500' : 'text-gray-300'
                        }`}
                      />
                    </div>
                    <p
                      className={`ml-3 text-sm ${
                        feature.included ? 'text-gray-700' : 'text-gray-400'
                      }`}
                    >
                      {feature.name}
                    </p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <button
                  onClick={() => setSelectedPlan(plan.name)}
                  className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium ${
                    plan.name.toLowerCase() === currentPlan
                      ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100'
                      : 'text-white bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {plan.name.toLowerCase() === currentPlan ? (
                    'Current Plan'
                  ) : (
                    <>
                      Upgrade
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}