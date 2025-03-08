import { 
  UserSettings, 
  TeamSettings, 
  AccessControlPolicy, 
  BackupConfiguration, 
  APIIntegrationSettings 
} from '../types/settings';

export const DEFAULT_USER_SETTINGS: UserSettings = {
  theme: {
    mode: 'light',
    primaryColor: '#007bff',
    secondaryColor: '#6c757d',
    fontFamily: 'Inter, sans-serif'
  },
  notifications: {
    email: true,
    push: false,
    frequency: 'daily'
  },
  language: 'en',
  timezone: 'UTC'
};

export const DEFAULT_TEAM_SETTINGS: TeamSettings = {
  name: 'My Team',
  description: '',
  members: [],
  roles: [
    {
      id: 'admin',
      name: 'Administrator',
      permissions: ['full_access']
    },
    {
      id: 'member',
      name: 'Team Member',
      permissions: ['read_only']
    }
  ]
};

export const DEFAULT_ACCESS_CONTROL: AccessControlPolicy[] = [
  {
    role: 'admin',
    permissions: {
      dashboard: true,
      settings: true,
      userManagement: true,
      billing: true
    }
  },
  {
    role: 'member',
    permissions: {
      dashboard: true,
      settings: false,
      userManagement: false,
      billing: false
    }
  }
];

export const DEFAULT_BACKUP_CONFIG: BackupConfiguration = {
  frequency: 'daily',
  type: 'incremental',
  storageLocation: 's3://backups',
  maxBackups: 7
};

export const DEFAULT_API_INTEGRATION_SETTINGS: APIIntegrationSettings = {
  providers: {
    printify: { enabled: false },
    printful: { enabled: false },
    gooten: { enabled: false }
  },
  rateLimits: {
    requestsPerMinute: 60,
    requestsPerHour: 1000
  }
};

// Utility function to validate settings
export function validateSettings<T>(settings: T, defaultSettings: T): T {
  return { ...defaultSettings, ...settings };
}