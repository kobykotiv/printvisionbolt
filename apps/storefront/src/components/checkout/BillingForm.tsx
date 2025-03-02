'use client';

import React from 'react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import { CheckoutButton } from './CheckoutButton';

export function BillingForm() {
  const { formData, updateFormData, isStepComplete, goToNextStep, goToPreviousStep } = useCheckout();
  const [sameAsShipping, setSameAsShipping] = React.useState(formData.billingAddress?.sameAsShipping ?? true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepComplete('billing')) {
      goToNextStep();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox' && name === 'sameAsShipping') {
      setSameAsShipping(checked);
      updateFormData({
        billingAddress: {
          ...formData.billingAddress,
          sameAsShipping: checked,
          ...(checked ? formData.shippingAddress : {})
        }
      });
    } else {
      updateFormData({
        billingAddress: {
          ...formData.billingAddress,
          [name]: value
        }
      });
    }
  };

  return (
    <GlassCard className="p-6 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="sameAsShipping"
            name="sameAsShipping"
            checked={sameAsShipping}
            onChange={handleChange}
            className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
          />
          <label htmlFor="sameAsShipping" className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Same as shipping address
          </label>
        </div>

        {!sameAsShipping && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.billingAddress?.firstName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
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
                  value={formData.billingAddress?.lastName || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
                />
              </div>
            </div>

            <div>
              <label htmlFor="address1" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Address Line 1
              </label>
              <input
                type="text"
                id="address1"
                name="address1"
                value={formData.billingAddress?.address1 || ''}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                required={!sameAsShipping}
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
                  value={formData.billingAddress?.city || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
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
                  value={formData.billingAddress?.state || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
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
                  value={formData.billingAddress?.postalCode || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
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
                  value={formData.billingAddress?.country || ''}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
                  required={!sameAsShipping}
                />
              </div>
            </div>
          </>
        )}

        <div className="flex justify-between pt-4">
          <CheckoutButton
            variant="secondary"
            onClick={goToPreviousStep}
            type="button"
          >
            Back to Shipping
          </CheckoutButton>
          <CheckoutButton
            type="submit"
            disabled={!isStepComplete('billing')}
          >
            Continue to Payment
          </CheckoutButton>
        </div>
      </form>
    </GlassCard>
  );
}