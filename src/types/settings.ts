// Settings & Configuration Types

export interface UserSettings {
  theme: {
    mode: 'light' | 'dark';
    primaryColor: string;
    secondaryColor: string;
    fontFamily: string;
  };
  notifications: {
    email: boolean;
    push: boolean;
    frequency: 'immediate' | 'daily' | 'weekly';
  };
  language: string;
  timezone: string;
}

export interface TeamSettings {
  name: string;
  description?: string;
  members: TeamMember[];
  roles: TeamRole[];
}

export interface TeamMember {
  id: string;
  email: string;
  name: string;
  role: string;
  joinedAt: Date;
  status: 'active' | 'invited' | 'suspended';
}

export interface TeamRole {
  id: string;
  name: string;
  permissions: string[];
}

export interface AccessControlPolicy {
  role: string;
  permissions: {
    dashboard: boolean;
    settings: boolean;
    userManagement: boolean;
    billing: boolean;
  };
}

export interface BackupConfiguration {
  frequency: 'daily' | 'weekly' | 'monthly';
  type: 'full' | 'incremental';
  storageLocation: string;
  maxBackups: number;
  lastBackup?: Date;
}

export interface APIIntegrationSettings {
  providers: {
    [key: string]: {
      enabled: boolean;
      apiKey?: string;
      endpoint?: string;
    }
  };
  webhookSecret?: string;
  rateLimits: {
    requestsPerMinute: number;
    requestsPerHour: number;
  };
}