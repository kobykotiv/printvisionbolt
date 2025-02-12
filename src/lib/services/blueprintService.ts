import { supabase } from '../supabase';
import type { Blueprint } from '../types/template';

export interface BlueprintSearchFilters {
  search?: string;
  providers?: string[];
  categories?: string[];
  tags?: string[];
  placeholderCount?: {
    min?: number;
    max?: number;
  };
  priceRange?: {
    min?: number;
    max?: number;
  };
  favorites?: boolean;
  recentlyUsed?: boolean;
}

interface BlueprintWithMeta extends Blueprint {
  isFavorite?: boolean;
  lastUsed?: string;
  category?: string;
  tags?: string[];
}

// Get user's favorite blueprints
export async function getFavoriteBlueprints(): Promise<string[]> {
  const { data, error } = await supabase
    .from('user_blueprint_preferences')
    .select('blueprint_id')
    .eq('type', 'favorite');

  if (error) throw new Error('Failed to fetch favorite blueprints');
  return data.map(item => item.blueprint_id);
}

// Get recently used blueprints
export async function getRecentBlueprints(): Promise<{ id: string, lastUsed: string }[]> {
  const { data, error } = await supabase
    .from('user_blueprint_preferences')
    .select('blueprint_id, last_used')
    .eq('type', 'recent')
    .order('last_used', { ascending: false })
    .limit(10);

  if (error) throw new Error('Failed to fetch recent blueprints');
  return data.map(item => ({
    id: item.blueprint_id,
    lastUsed: item.last_used
  }));
}

// Toggle blueprint favorite status
export async function toggleBlueprintFavorite(blueprintId: string, isFavorite: boolean): Promise<void> {
  const { error } = isFavorite
    ? await supabase
        .from('user_blueprint_preferences')
        .insert({
          blueprint_id: blueprintId,
          type: 'favorite'
        })
    : await supabase
        .from('user_blueprint_preferences')
        .delete()
        .eq('blueprint_id', blueprintId)
        .eq('type', 'favorite');

  if (error) throw new Error('Failed to update blueprint favorite status');
}

// Update blueprint last used timestamp
export async function updateBlueprintLastUsed(blueprintId: string): Promise<void> {
  const { error } = await supabase
    .from('user_blueprint_preferences')
    .upsert({
      blueprint_id: blueprintId,
      type: 'recent',
      last_used: new Date().toISOString()
    });

  if (error) throw new Error('Failed to update blueprint last used timestamp');
}

// Search blueprints with filters
export async function searchBlueprints(filters: BlueprintSearchFilters): Promise<BlueprintWithMeta[]> {
  let query = supabase.from('blueprints').select('*');

  // Apply search filter
  if (filters.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  // Apply provider filter
  if (filters.providers?.length) {
    query = query.in('provider_id', filters.providers);
  }

  // Apply category filter
  if (filters.categories?.length) {
    query = query.in('category', filters.categories);
  }

  // Apply tags filter
  if (filters.tags?.length) {
    query = query.contains('tags', filters.tags);
  }

  // Apply price range filter
  if (filters.priceRange) {
    if (filters.priceRange.min !== undefined) {
      query = query.gte('pricing->baseCost', filters.priceRange.min);
    }
    if (filters.priceRange.max !== undefined) {
      query = query.lte('pricing->baseCost', filters.priceRange.max);
    }
  }

  const { data: blueprints, error } = await query;
  if (error || !blueprints) throw new Error('Failed to search blueprints');

  // Fetch favorites
  const favorites = filters.favorites 
    ? await getFavoriteBlueprints() 
    : [];

  // Fetch recent
  const recent = filters.recentlyUsed
    ? await getRecentBlueprints()
    : [];

  // Merge metadata
  const results = blueprints.map(blueprint => ({
    ...blueprint,
    isFavorite: favorites.includes(blueprint.id),
    lastUsed: recent.find(r => r.id === blueprint.id)?.lastUsed
  }));

  // Filter by favorites/recent if requested
  if (filters.favorites) {
    return results.filter(b => b.isFavorite);
  }
  if (filters.recentlyUsed) {
    return results.filter(b => b.lastUsed).sort((a, b) => 
      new Date(b.lastUsed!).getTime() - new Date(a.lastUsed!).getTime()
    );
  }

  return results;
}

// Get available categories
export async function getBlueprintCategories(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blueprints')
    .select('category');

  if (error) throw new Error('Failed to fetch blueprint categories');
  return Array.from(new Set(data.map(b => b.category).filter(Boolean)));
}

// Get all available tags
export async function getBlueprintTags(): Promise<string[]> {
  const { data, error } = await supabase
    .from('blueprints')
    .select('tags');

  if (error) throw new Error('Failed to fetch blueprint tags');
  return Array.from(new Set(data.flatMap(b => b.tags || [])));
}