import { createClient } from '@supabase/supabase-js';
import { FeatureLimit, UserTier } from '../types/features';
import { getTierById } from '../config/features';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface FeatureService {
  getUserTier(userId: string): Promise<UserTier>;
  checkFeatureAccess(userId: string, featureName: string): Promise<boolean>;
  incrementFeatureUsage(userId: string, featureName: string): Promise<void>;
  getFeatureUsage(userId: string, featureName: string): Promise<number>;
  resetFeatureUsage(userId: string, featureName: string): Promise<void>;
}

class SupabaseFeatureService implements FeatureService {
  async getUserTier(userId: string): Promise<UserTier> {
    const { data: user, error } = await supabase
      .from('users')
      .select('tier_id')
      .eq('id', userId)
      .single();

    if (error || !user) {
      return getTierById(1); // Default to free tier
    }

    return getTierById(user.tier_id);
  }

  async checkFeatureAccess(userId: string, featureName: string): Promise<boolean> {
    const userTier = await this.getUserTier(userId);
    
    // Check if feature exists in tier features
    const feature = userTier.features[featureName as keyof typeof userTier.features];
    if (typeof feature === 'boolean') {
      return feature;
    }

    // Check feature limits
    const limit = userTier.limits.find(l => l.name === featureName);
    if (!limit) {
      return false;
    }

    const usage = await this.getFeatureUsage(userId, featureName);
    return usage < limit.limit;
  }

  async incrementFeatureUsage(userId: string, featureName: string): Promise<void> {
    const { data: existingUsage, error: fetchError } = await supabase
      .from('feature_usage')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .single();

    if (fetchError) {
      // Create new usage record if it doesn't exist
      await supabase.from('feature_usage').insert({
        user_id: userId,
        feature_name: featureName,
        usage_count: 1,
        last_used: new Date().toISOString()
      });
    } else {
      // Update existing usage record
      await supabase
        .from('feature_usage')
        .update({
          usage_count: (existingUsage?.usage_count || 0) + 1,
          last_used: new Date().toISOString()
        })
        .eq('user_id', userId)
        .eq('feature_name', featureName);
    }
  }

  async getFeatureUsage(userId: string, featureName: string): Promise<number> {
    const { data: usage, error } = await supabase
      .from('feature_usage')
      .select('usage_count')
      .eq('user_id', userId)
      .eq('feature_name', featureName)
      .single();

    if (error || !usage) {
      return 0;
    }

    return usage.usage_count;
  }

  async resetFeatureUsage(userId: string, featureName: string): Promise<void> {
    await supabase
      .from('feature_usage')
      .update({
        usage_count: 0,
        reset_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .eq('feature_name', featureName);
  }

  // Additional helper methods
  async upgradeUserTier(userId: string, newTierId: number): Promise<void> {
    await supabase
      .from('users')
      .update({ tier_id: newTierId })
      .eq('id', userId);
  }

  async getFeatureLimits(userId: string): Promise<FeatureLimit[]> {
    const userTier = await this.getUserTier(userId);
    const limits = [...userTier.limits];

    // Fetch current usage for each limit
    for (const limit of limits) {
      limit.currentUsage = await this.getFeatureUsage(userId, limit.name);
    }

    return limits;
  }
}

// Export singleton instance
export const featureService = new SupabaseFeatureService();
