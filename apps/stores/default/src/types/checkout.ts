export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
}

export interface BillingAddress {
  sameAsShipping: boolean;
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
}

export interface PaymentDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  nameOnCard: string;
}

export interface CheckoutFormData {
  shippingAddress: ShippingAddress;
  billingAddress: BillingAddress;
  payment: PaymentDetails;
}

export type PartialCheckoutFormData = {
  shippingAddress?: Partial<ShippingAddress>;
  billingAddress?: Partial<BillingAddress>;
  payment?: Partial<PaymentDetails>;
}

export interface OrderSummary {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export type CheckoutStep = 'shipping' | 'billing' | 'payment' | 'review';