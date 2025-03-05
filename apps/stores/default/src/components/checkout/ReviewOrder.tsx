'use client';

import React from 'react';
import { useCheckout } from '@/contexts/CheckoutContext';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';
import { CheckoutButton } from './CheckoutButton';

export function ReviewOrder() {
  const { formData, orderSummary, goToPreviousStep } = useCheckout();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement order submission
    console.log('Submitting order:', { formData, orderSummary });
  };

  const formatAddress = (prefix: string) => {
    const address = prefix === 'shipping' ? formData.shippingAddress : formData.billingAddress;
    if (!address) return null;

    return (
      <div className="space-y-1">
        <p>{address.firstName} {address.lastName}</p>
        <p>{address.address1}</p>
        {address.address2 && <p>{address.address2}</p>}
        <p>{address.city}, {address.state} {address.postalCode}</p>
        <p>{address.country}</p>
        {prefix === 'shipping' && formData.shippingAddress?.phone && (
          <p>Phone: {formData.shippingAddress.phone}</p>
        )}
      </div>
    );
  };

  const formatCard = () => {
    const payment = formData.payment;
    if (!payment?.cardNumber) return null;

    const last4 = payment.cardNumber.slice(-4);
    return `•••• •••• •••• ${last4}`;
  };

  return (
    <div className="space-y-6">
      <GlassCard className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Shipping Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
            {formatAddress('shipping')}
          </div>

          {/* Billing Information */}
          <div>
            <h3 className="text-lg font-medium mb-4">Billing Address</h3>
            {formData.billingAddress?.sameAsShipping ? (
              <p className="text-gray-600">Same as shipping address</p>
            ) : (
              formatAddress('billing')
            )}
          </div>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-medium mb-4">Payment Method</h3>
        <div className="space-y-2">
          <p>Card: {formatCard()}</p>
          <p>Expiry: {formData.payment?.expiryDate}</p>
          <p>Name on Card: {formData.payment?.nameOnCard}</p>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h3 className="text-lg font-medium mb-4">Order Summary</h3>
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

      <div className="flex justify-between pt-4">
        <CheckoutButton
          variant="secondary"
          onClick={goToPreviousStep}
          type="button"
        >
          Back to Payment
        </CheckoutButton>
        <CheckoutButton
          onClick={handleSubmit}
          type="button"
        >
          Place Order
        </CheckoutButton>
      </div>
    </div>
  );
}