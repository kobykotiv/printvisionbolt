'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckoutFormData, PartialCheckoutFormData, CheckoutStep, OrderSummary } from '../types/checkout';

interface CheckoutContextType {
  step: CheckoutStep;
  formData: PartialCheckoutFormData;
  orderSummary: OrderSummary;
  setStep: (step: CheckoutStep) => void;
  updateFormData: (data: PartialCheckoutFormData) => void;
  updateOrderSummary: (summary: Partial<OrderSummary>) => void;
  isStepComplete: (step: CheckoutStep) => boolean;
  goToNextStep: () => void;
  goToPreviousStep: () => void;
}

const CheckoutContext = createContext<CheckoutContextType | undefined>(undefined);

const CHECKOUT_STEPS: CheckoutStep[] = ['shipping', 'billing', 'payment', 'review'];

const initialFormData: PartialCheckoutFormData = {
  billingAddress: {
    sameAsShipping: true
  },
  payment: {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    nameOnCard: ''
  }
};

export function CheckoutProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState<CheckoutStep>('shipping');
  const [formData, setFormData] = useState<PartialCheckoutFormData>(initialFormData);
  const [orderSummary, setOrderSummary] = useState<OrderSummary>({
    subtotal: 0,
    shipping: 0,
    tax: 0,
    total: 0
  });

  const updateFormData = (data: PartialCheckoutFormData) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      billingAddress: {
        ...prev.billingAddress,
        ...data.billingAddress,
        sameAsShipping: data.billingAddress?.sameAsShipping ?? prev.billingAddress?.sameAsShipping ?? true
      }
    }));
  };

  const updateOrderSummary = (summary: Partial<OrderSummary>) => {
    setOrderSummary(prev => ({
      ...prev,
      ...summary,
      total: (summary.subtotal ?? prev.subtotal) + 
             (summary.shipping ?? prev.shipping) + 
             (summary.tax ?? prev.tax)
    }));
  };

  const isStepComplete = (checkStep: CheckoutStep): boolean => {
    switch (checkStep) {
      case 'shipping':
        return Boolean(
          formData.shippingAddress?.firstName &&
          formData.shippingAddress?.lastName &&
          formData.shippingAddress?.email &&
          formData.shippingAddress?.address1 &&
          formData.shippingAddress?.city &&
          formData.shippingAddress?.state &&
          formData.shippingAddress?.postalCode &&
          formData.shippingAddress?.country
        );
      case 'billing':
        if (formData.billingAddress?.sameAsShipping) return true;
        return Boolean(
          formData.billingAddress?.firstName &&
          formData.billingAddress?.lastName &&
          formData.billingAddress?.address1 &&
          formData.billingAddress?.city &&
          formData.billingAddress?.state &&
          formData.billingAddress?.postalCode &&
          formData.billingAddress?.country
        );
      case 'payment':
        return Boolean(
          formData.payment?.cardNumber &&
          formData.payment?.expiryDate &&
          formData.payment?.cvv &&
          formData.payment?.nameOnCard
        );
      case 'review':
        return isStepComplete('shipping') &&
               isStepComplete('billing') &&
               isStepComplete('payment');
      default:
        return false;
    }
  };

  const goToNextStep = () => {
    const currentIndex = CHECKOUT_STEPS.indexOf(step);
    if (currentIndex < CHECKOUT_STEPS.length - 1) {
      setStep(CHECKOUT_STEPS[currentIndex + 1]);
    }
  };

  const goToPreviousStep = () => {
    const currentIndex = CHECKOUT_STEPS.indexOf(step);
    if (currentIndex > 0) {
      setStep(CHECKOUT_STEPS[currentIndex - 1]);
    }
  };

  return (
    <CheckoutContext.Provider
      value={{
        step,
        formData,
        orderSummary,
        setStep,
        updateFormData,
        updateOrderSummary,
        isStepComplete,
        goToNextStep,
        goToPreviousStep
      }}
    >
      {children}
    </CheckoutContext.Provider>
  );
}

export function useCheckout() {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error('useCheckout must be used within a CheckoutProvider');
  }
  return context;
}