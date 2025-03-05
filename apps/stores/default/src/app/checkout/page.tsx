'use client';

import React from 'react';
import { CheckoutProvider } from '@/contexts/CheckoutContext';
import { ShippingForm } from '@/components/checkout/ShippingForm';
import { BillingForm } from '@/components/checkout/BillingForm';
import { PaymentForm } from '@/components/checkout/PaymentForm';
import { ReviewOrder } from '@/components/checkout/ReviewOrder';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import { useCheckout } from '@/contexts/CheckoutContext';

function CheckoutSteps() {
  const { step } = useCheckout();

  const steps = [
    { key: 'shipping', label: 'Shipping' },
    { key: 'billing', label: 'Billing' },
    { key: 'payment', label: 'Payment' },
    { key: 'review', label: 'Review' }
  ];

  const currentStepIndex = steps.findIndex(s => s.key === step);

  return (
    <GlassCard className="mb-8">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>
      <div className="flex items-center space-x-4">
        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-500 transition-all duration-300"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        <span className="text-sm text-gray-500">
          Step {currentStepIndex + 1} of {steps.length}
        </span>
      </div>
    </GlassCard>
  );
}

export default function CheckoutPage() {
  return (
    <CheckoutProvider>
      <div className="container mx-auto px-4 py-8">
        <CheckoutSteps />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CheckoutContent />
          </div>
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </CheckoutProvider>
  );
}

function CheckoutContent() {
  const { step } = useCheckout();

  switch (step) {
    case 'shipping':
      return <ShippingForm />;
    case 'billing':
      return <BillingForm />;
    case 'payment':
      return <PaymentForm />;
    case 'review':
      return <ReviewOrder />;
    default:
      return null;
  }
}

function OrderSummary() {
  const { orderSummary } = useCheckout();

  return (
    <GlassCard className="p-6 sticky top-4">
      <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
      <div className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${orderSummary.subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span>${orderSummary.shipping.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>Tax</span>
          <span>${orderSummary.tax.toFixed(2)}</span>
        </div>
        <div className="border-t pt-4">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${orderSummary.total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}