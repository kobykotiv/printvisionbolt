import React, { createContext, useContext, useEffect, useState } from 'react';
import type { UserSettings } from '../lib/services/settingsService';
import { getUserSettings, updateUserSettings, clearGuestSettings } from '../lib/services/settingsService';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  settings: UserSettings;
  isLoading: boolean;
  error: string | null;
  updateSettings: (updates: Partial<UserSettings>) => Promise<void>;
  resetSettings: () => Promise<void>;
}

const SettingsContext = createContext<SettingsContextType | null>(null);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}

interface SettingsProviderProps {
  children: React.ReactNode;
}

export function SettingsProvider({ children }: SettingsProviderProps) {
  const { user } = useAuth();
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load settings when user changes
  useEffect(() => {
    loadSettings();
  }, [user?.id]);

  // Clear guest settings on user login/logout
  useEffect(() => {
    if (user) {
      clearGuestSettings();
    }
  }, [user]);

  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const userSettings = await getUserSettings();
      setSettings(userSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load settings');
      console.error('Error loading settings:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateSettings = async (updates: Partial<UserSettings>) => {
    if (!settings) return;

    try {
      setError(null);
      const updatedSettings = await updateUserSettings(updates);
      setSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    }
  };

  const resetSettings = async () => {
    try {
      setError(null);
      await updateUserSettings({});
      await loadSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset settings');
      throw err;
    }
  };

  // Don't render children until we have settings
  if (!settings) {
    return null;
  }

  const value: SettingsContextType = {
    settings,
    isLoading,
    error,
    updateSettings,
    resetSettings
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}

// Hook for auto-save functionality
export function useAutoSave<T>(
  value: T,
  onSave: (value: T) => Promise<void>,
  delay = 1000
) {
  const { settings } = useSettings();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Only auto-save if it's enabled in settings
  useEffect(() => {
    if (!settings.autoSave) return;

    const timer = setTimeout(async () => {
      try {
        setSaving(true);
        setError(null);
        await onSave(value);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to auto-save');
      } finally {
        setSaving(false);
      }
    }, delay);

    return () => clearTimeout(timer);
  }, [value, onSave, delay, settings.autoSave]);

  return { saving, error };
}

// Helper hook for managing recent items
export function useRecentItems(type: 'templates' | 'designs' | 'blueprints') {
  const { settings, updateSettings } = useSettings();

  const addRecent = async (id: string) => {
    const current = settings.recent[type] || [];
    const updated = [id, ...current.filter(i => i !== id)].slice(0, 10);

    await updateSettings({
      recent: {
        ...settings.recent,
        [type]: updated
      }
    });
  };

  const clearRecent = async () => {
    await updateSettings({
      recent: {
        ...settings.recent,
        [type]: []
      }
    });
  };

  return {
    recentItems: settings.recent[type] || [],
    addRecent,
    clearRecent
  };
}

// Helper hook for managing favorites
export function useFavorites(type: 'templates' | 'designs' | 'blueprints') {
  const { settings, updateSettings } = useSettings();

  const toggleFavorite = async (id: string) => {
    const current = settings.favorites[type];
    const updated = current.includes(id)
      ? current.filter(i => i !== id)
      : [...current, id];

    await updateSettings({
      favorites: {
        ...settings.favorites,
        [type]: updated
      }
    });
  };

  const isFavorite = (id: string) => {
    return settings.favorites[type].includes(id);
  };

  return {
    favorites: settings.favorites[type],
    toggleFavorite,
    isFavorite
  };
}