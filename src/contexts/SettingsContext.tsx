import React, { createContext, useState, useContext, ReactNode } from 'react';
import { 
  UserSettings, 
  TeamSettings, 
  AccessControlPolicy, 
  BackupConfiguration, 
  APIIntegrationSettings 
} from '../types/settings';
import { 
  DEFAULT_USER_SETTINGS, 
  DEFAULT_TEAM_SETTINGS, 
  DEFAULT_ACCESS_CONTROL, 
  DEFAULT_BACKUP_CONFIG, 
  DEFAULT_API_INTEGRATION_SETTINGS,
  validateSettings 
} from '../config/settingsConfig';

interface SettingsContextType {
  userSettings: UserSettings;
  teamSettings: TeamSettings;
  accessControl: AccessControlPolicy[];
  backupConfig: BackupConfiguration;
  apiIntegrationSettings: APIIntegrationSettings;
  updateUserSettings: (settings: Partial<UserSettings>) => void;
  updateTeamSettings: (settings: Partial<TeamSettings>) => void;
  updateAccessControl: (policies: AccessControlPolicy[]) => void;
  updateBackupConfig: (config: Partial<BackupConfiguration>) => void;
  updateAPIIntegrationSettings: (settings: Partial<APIIntegrationSettings>) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [userSettings, setUserSettings] = useState<UserSettings>(DEFAULT_USER_SETTINGS);
  const [teamSettings, setTeamSettings] = useState<TeamSettings>(DEFAULT_TEAM_SETTINGS);
  const [accessControl, setAccessControl] = useState<AccessControlPolicy[]>(DEFAULT_ACCESS_CONTROL);
  const [backupConfig, setBackupConfig] = useState<BackupConfiguration>(DEFAULT_BACKUP_CONFIG);
  const [apiIntegrationSettings, setAPIIntegrationSettings] = useState<APIIntegrationSettings>(DEFAULT_API_INTEGRATION_SETTINGS);

  const updateUserSettings = (settings: Partial<UserSettings>) => {
    setUserSettings(prev => validateSettings({ ...prev, ...settings }, DEFAULT_USER_SETTINGS));
  };

  const updateTeamSettings = (settings: Partial<TeamSettings>) => {
    setTeamSettings(prev => validateSettings({ ...prev, ...settings }, DEFAULT_TEAM_SETTINGS));
  };

  const updateAccessControl = (policies: AccessControlPolicy[]) => {
    setAccessControl(policies);
  };

  const updateBackupConfig = (config: Partial<BackupConfiguration>) => {
    setBackupConfig(prev => validateSettings({ ...prev, ...config }, DEFAULT_BACKUP_CONFIG));
  };

  const updateAPIIntegrationSettings = (settings: Partial<APIIntegrationSettings>) => {
    setAPIIntegrationSettings(prev => validateSettings({ ...prev, ...settings }, DEFAULT_API_INTEGRATION_SETTINGS));
  };

  const contextValue: SettingsContextType = {
    userSettings,
    teamSettings,
    accessControl,
    backupConfig,
    apiIntegrationSettings,
    updateUserSettings,
    updateTeamSettings,
    updateAccessControl,
    updateBackupConfig,
    updateAPIIntegrationSettings
  };

  return (
    <SettingsContext.Provider value={contextValue}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};