import { supabase } from '../supabase';

export interface DashboardStats {
  totalDesigns: number;
  activeProducts: number;
}

export async function fetchDashboardStats(shopId: string): Promise<DashboardStats> {
  try {
    // Fetch designs count
    const { count: designsCount, error: designsError } = await supabase
      .from('designs')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId);

    if (designsError) throw new Error('Failed to load designs data');

    // Fetch active products count
    const { count: productsCount, error: productsError } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .eq('shop_id', shopId)
      .eq('status', 'active');

    if (productsError) throw new Error('Failed to load products data');

    // DO NOT Implement sales and customers tracking
    return {
      totalDesigns: designsCount || 0,
      activeProducts: productsCount || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
}

export interface APIHealthStatus {
  name: string;
  status: 'healthy' | 'degraded' | 'down';
  latency: number;
}

export async function fetchAPIHealth(): Promise<APIHealthStatus[]> {
  // TODO: Implement real API health checks
  // For now, returning mock data
  return [
    { name: 'Printify', status: 'healthy', latency: 120 },
    { name: 'Printful', status: 'healthy', latency: 89 },
    { name: 'Gooten', status: 'degraded', latency: 350 },
  ];
}