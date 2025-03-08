/**
 * User profile and settings types
 */

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  companyName?: string;
  settings: UserSettings;
  subscription: SubscriptionInfo;
}

export interface UserSettings {
  notifications: NotificationSettings;
  defaultProvider?: string;
  theme?: 'light' | 'dark' | 'system';
  timezone?: string;
}

export interface NotificationSettings {
  emailUpdates: boolean;
  orderNotifications: boolean;
  productSyncAlerts: boolean;
  securityAlerts: boolean;
}

export interface SubscriptionInfo {
  customerId?: string;
  status: 'active' | 'inactive' | 'past_due' | 'canceled';
  plan?: string;
  periodEnd?: string;
}

/**
 * API Key management types
 */

export interface ApiKey {
  id: string;
  name: string;
  provider: string;
  lastUsed?: string;
  createdAt: string;
  expiresAt?: string;
  active: boolean;
}

export interface CreateApiKeyRequest {
  name: string;
  provider: string;
}

export interface ApiKeyResponse {
  key: string;  // Only returned on creation
  keyDetails: ApiKey;
}

/**
 * Store settings types
 */

export interface StoreSettings {
  id: string;
  storeName: string;
  providerConnections: ProviderConnection[];
  settings: StorePreferences;
}

export interface ProviderConnection {
  provider: string;
  active: boolean;
  apiKeyId: string;
  syncEnabled: boolean;
  defaultBehavior: {
    newProducts: 'auto_template' | 'notify' | 'ignore';
    discontinuedProducts: 'unpublish' | 'notify' | 'ignore';
  };
}

export interface StorePreferences {
  autoSync: boolean;
  syncFrequency: 'daily' | 'weekly' | 'manual';
  notifyOnSync: boolean;
  defaultProvider?: string;
}

/**
 * Security audit types
 */

export interface SecurityEvent {
  id: string;
  eventType: SecurityEventType;
  ipAddress?: string;
  userAgent?: string;
  timestamp: string;
  metadata: Record<string, unknown>;
}

export type SecurityEventType = 
  | 'api_key.created'
  | 'api_key.rotated'
  | 'api_key.deleted'
  | 'store.connected'
  | 'store.disconnected'
  | 'settings.updated'
  | 'profile.updated'
  | 'subscription.changed';

/**
 * Settings service response types
 */

export interface SettingsResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export type ProfileResponse = SettingsResponse<UserProfile>;
export type ApiKeyListResponse = SettingsResponse<ApiKey[]>;
export type StoreSettingsResponse = SettingsResponse<StoreSettings>;
export type SecurityEventsResponse = SettingsResponse<SecurityEvent[]>;