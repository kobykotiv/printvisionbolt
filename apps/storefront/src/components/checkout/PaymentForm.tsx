'use client';

import React from 'react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import { CheckoutButton } from './CheckoutButton';

export function PaymentForm() {
  const { formData, updateFormData, isStepComplete, goToNextStep, goToPreviousStep } = useCheckout();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isStepComplete('payment')) {
      goToNextStep();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      updateFormData({
        payment: {
          ...formData.payment,
          cardNumber: formatted
        }
      });
      return;
    }

    // Format expiry date
    if (name === 'expiryDate') {
      const formatted = value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d{0,2})/, '$1/$2')
        .slice(0, 5);
      updateFormData({
        payment: {
          ...formData.payment,
          expiryDate: formatted
        }
      });
      return;
    }

    updateFormData({
      payment: {
        ...formData.payment,
        [name]: value
      }
    });
  };

  return (
    <GlassCard className="p-6 w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Card Number
          </label>
          <input
            type="text"
            id="cardNumber"
            name="cardNumber"
            value={formData.payment?.cardNumber || ''}
            onChange={handleChange}
            placeholder="0000 0000 0000 0000"
            maxLength={19}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Expiry Date
            </label>
            <input
              type="text"
              id="expiryDate"
              name="expiryDate"
              value={formData.payment?.expiryDate || ''}
              onChange={handleChange}
              placeholder="MM/YY"
              maxLength={5}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
          <div>
            <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              CVV
            </label>
            <input
              type="text"
              id="cvv"
              name="cvv"
              value={formData.payment?.cvv || ''}
              onChange={handleChange}
              placeholder="123"
              maxLength={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Name on Card
          </label>
          <input
            type="text"
            id="nameOnCard"
            name="nameOnCard"
            value={formData.payment?.nameOnCard || ''}
            onChange={handleChange}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 bg-white/50 dark:bg-gray-800/50"
            required
          />
        </div>

        <div className="flex justify-between pt-4">
          <CheckoutButton
            variant="secondary"
            onClick={goToPreviousStep}
            type="button"
          >
            Back to Billing
          </CheckoutButton>
          <CheckoutButton
            type="submit"
            disabled={!isStepComplete('payment')}
          >
            Review Order
          </CheckoutButton>
        </div>
      </form>
    </GlassCard>
  );
}