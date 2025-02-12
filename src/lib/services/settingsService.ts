import { supabase } from '../supabase';

export interface UserSettings {
  autoSave: boolean;
  theme: 'light' | 'dark' | 'system';
  previewMode: 'live' | 'draft';
  gridSize: number;
  notifications: {
    email: boolean;
    push: boolean;
    desktop: boolean;
  };
  recent: {
    templates?: string[];
    designs?: string[];
    blueprints?: string[];
  };
  favorites: {
    templates: string[];
    designs: string[];
    blueprints: string[];
  };
}

const DEFAULT_SETTINGS: UserSettings = {
  autoSave: true,
  theme: 'system',
  previewMode: 'live',
  gridSize: 12,
  notifications: {
    email: true,
    push: true,
    desktop: true
  },
  recent: {
    templates: [], designs: [], blueprints: []
  },
  favorites: {
    templates: [], designs: [], blueprints: []
  }
};

// Local storage key for guest settings
const GUEST_SETTINGS_KEY = 'guest_settings';

// Get settings from local storage
function getLocalSettings(): UserSettings {
  const stored = localStorage.getItem(GUEST_SETTINGS_KEY);
  if (!stored) return DEFAULT_SETTINGS;
  
  try {
    return JSON.parse(stored);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

// Save settings to local storage
function saveLocalSettings(settings: UserSettings): void {
  localStorage.setItem(GUEST_SETTINGS_KEY, JSON.stringify(settings));
}

// Get authenticated user settings from Supabase
export async function getUserSettings(): Promise<UserSettings> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    return getLocalSettings();
  }

  const { data, error } = await supabase
    .from('user_settings')
    .select('settings')
    .eq('user_id', session.user.id)
    .single();

  if (error || !data) {
    // If no settings exist, create default settings
    const { error: createError } = await supabase
      .from('user_settings')
      .insert({
        user_id: session.user.id,
        settings: DEFAULT_SETTINGS
      });

    if (createError) {
      console.error('Failed to create user settings:', createError);
      return DEFAULT_SETTINGS;
    }

    return DEFAULT_SETTINGS;
  }

  return data.settings;
}

// Update authenticated user settings
export async function updateUserSettings(
  settings: Partial<UserSettings>
): Promise<UserSettings> {
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session?.user) {
    const currentSettings = getLocalSettings();
    const newSettings = { ...currentSettings, ...settings };
    saveLocalSettings(newSettings);
    return newSettings;
  }

  const { data, error } = await supabase
    .from('user_settings')
    .update({
      settings: settings,
      updated_at: new Date().toISOString()
    })
    .eq('user_id', session.user.id)
    .select('settings')
    .single();

  if (error) {
    throw new Error('Failed to update settings');
  }

  return data.settings;
}

// Add item to recent/favorites list
export async function addToList(
  type: 'recent' | 'favorites',
  itemType: 'templates' | 'designs' | 'blueprints',
  id: string,
  maxItems = 10
): Promise<void> {
  const settings = await getUserSettings();

  const list = settings[type][itemType] || [];
  const newList = [
    id,
    ...list.filter(existingId => existingId !== id)
  ].slice(0, maxItems);

  await updateUserSettings({
    [type]: {
      ...settings[type],
      [itemType]: newList
    }
  });
}

// Remove item from recent/favorites list
export async function removeFromList(
  type: 'recent' | 'favorites',
  itemType: 'templates' | 'designs' | 'blueprints',
  id: string
): Promise<void> {
  const settings = await getUserSettings();
  
  const list = settings[type][itemType] || [];
  const newList = list.filter(existingId => existingId !== id);

  await updateUserSettings({
    [type]: {
      ...settings[type],
      [itemType]: newList
    }
  });
}

// Clear guest settings
export function clearGuestSettings(): void {
  localStorage.removeItem(GUEST_SETTINGS_KEY);
}