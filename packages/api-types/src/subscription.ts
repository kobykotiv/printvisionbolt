import { Money } from './common';

/**
 * Subscription and billing types
 */

export interface UserTier {
  id: string;
  name: string;
  description: string;
  price: Money;
  billing_period: BillingPeriod;
  features: TierFeatures;
  limits: TierLimits;
  metadata: Record<string, unknown>;
}

export interface TierFeatures {
  custom_domain: boolean;
  analytics: boolean;
  api_access: boolean;
  priority_support: boolean;
  white_label: boolean;
  support_level: SupportLevel;
  custom_branding: boolean;
  advanced_analytics: boolean;
  bulk_operations: boolean;
  webhooks: boolean;
  api_rate_limit: number;
}

export interface TierLimits {
  stores: number;
  products: number;
  orders: number;
  storage: number; // In GB
  bandwidth: number; // In GB
  api_requests: number;
  team_members: number;
  concurrent_tasks: number;
}

export interface TierConfig extends UserTier {
  is_custom: boolean;
  is_enterprise: boolean;
  trial_days: number;
  setup_fee?: Money;
  available_addons: string[];
}

export interface Subscription {
  id: string;
  user_id: string;
  tier_id: string;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  trial_end?: string;
  billing_info: BillingInfo;
  metadata: Record<string, unknown>;
}

export interface BillingInfo {
  customer_id: string;
  payment_method_id?: string;
  payment_method_type?: string;
  card_last4?: string;
  card_brand?: string;
  card_exp_month?: number;
  card_exp_year?: number;
  billing_email: string;
  billing_name: string;
  billing_address: BillingAddress;
}

export interface BillingAddress {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
}

export type BillingPeriod = 'monthly' | 'yearly' | 'quarterly';

export type SupportLevel = 'basic' | 'priority' | '24/7';

export type SubscriptionStatus = 
  | 'active'
  | 'trialing'
  | 'past_due'
  | 'canceled'
  | 'incomplete'
  | 'incomplete_expired'
  | 'unpaid';

// Input types for creating/updating
export type TierInput = Omit<UserTier, 'id'>;
export type SubscriptionInput = Omit<Subscription, 'id'>;

// Response types
export interface SubscriptionWithTier extends Subscription {
  tier: UserTier;
}

export interface InvoiceItem {
  description: string;
  amount: Money;
  period_start?: string;
  period_end?: string;
  proration?: boolean;
  quantity?: number;
}

export interface Invoice {
  id: string;
  subscription_id: string;
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible';
  currency: string;
  subtotal: number;
  tax: number;
  total: number;
  items: InvoiceItem[];
  created_at: string;
  due_date: string;
  paid_at?: string;
  invoice_pdf?: string;
  metadata: Record<string, unknown>;
}

// Usage tracking
export interface UsageRecord {
  subscription_id: string;
  metric: keyof TierLimits;
  value: number;
  timestamp: string;
}

export interface UsageSummary {
  subscription_id: string;
  period_start: string;
  period_end: string;
  metrics: Record<keyof TierLimits, {
    used: number;
    limit: number;
    percentage: number;
  }>;
}