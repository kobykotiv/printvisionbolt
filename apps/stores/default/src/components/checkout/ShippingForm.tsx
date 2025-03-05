'use client';

import { useCheckout } from '@/contexts/CheckoutContext';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import { useState } from 'react';

export function ShippingForm() {
  const { formData, updateFormData, isStepComplete, goToNextStep } = useCheckout();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepComplete('shipping')) {
      goToNextStep();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    updateFormData({
      shippingAddress: {
        ...formData.shippingAddress,
        [name]: value
      }
    });
  };

  const handleBlur = (field: string) => {
    setTouched(prev => ({ ...prev, [field]: true }));
  };

  return (
    <GlassCard className="p-6 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.shippingAddress?.firstName || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('firstName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.shippingAddress?.lastName || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('lastName')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.shippingAddress?.email || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('email')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
            required
          />
        </div>

        <div>
          <label htmlFor="address1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address Line 1
          </label>
          <input
            type="text"
            id="address1"
            name="address1"
            value={formData.shippingAddress?.address1 || ''}
            onChange={handleChange}
            onBlur={() => handleBlur('address1')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
            required
          />
        </div>

        <div>
          <label htmlFor="address2" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Address Line 2 (Optional)
          </label>
          <input
            type="text"
            id="address2"
            name="address2"
            value={formData.shippingAddress?.address2 || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              City
            </label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.shippingAddress?.city || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('city')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              State/Province
            </label>
            <input
              type="text"
              id="state"
              name="state"
              value={formData.shippingAddress?.state || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('state')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.shippingAddress?.postalCode || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('postalCode')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
          <div>
            <label htmlFor="country" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Country
            </label>
            <input
              type="text"
              id="country"
              name="country"
              value={formData.shippingAddress?.country || ''}
              onChange={handleChange}
              onBlur={() => handleBlur('country')}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={!isStepComplete('shipping')}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Billing
          </button>
        </div>
      </form>
    </GlassCard>
  );
}