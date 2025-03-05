import React from 'react';
import { AlertCircle, CheckCircle2, Palette, FileStack, Calendar, Settings, Bell, RefreshCw, UploadCloud } from 'lucide-react';
import { useShop } from '@/contexts/ShopContext';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/contexts/ToastContext';
import { supabase } from '@/lib/supabase';
import { Card } from '@printvision/ui/components/Card';
import { LoadingState } from '@printvision/ui/components/LoadingState';
import { useDesigns } from '@/hooks/useDesigns';
import { ErrorBoundary } from '@/components/ErrorBoundary';

interface SyncStatus {
  status: 'pending' | 'success' | 'failed';
  count: number;
}

interface DashboardStats {
  totalDesigns: number;
  activeTemplates: number;
  totalCollections: number;
  totalProducts: number;
  pendingSync: number;
  scheduledDrops: number;
  syncSuccess: number;
  syncFailed: number;
}

const QUICK_ACTIONS = [
  { name: 'Upload Design', icon: UploadCloud, link: '/upload', adminOnly: false },
  { name: 'Sync Now', icon: RefreshCw, link: '/sync', adminOnly: false },
  { name: 'Schedule Drop', icon: Calendar, link: '/drops', adminOnly: false },
  { name: 'Manage Settings', icon: Settings, link: '/settings', adminOnly: true },
];

const INITIAL_STATS: DashboardStats = {
  totalDesigns: 0,
  activeTemplates: 0,
  totalCollections: 0,
  totalProducts: 0,
  pendingSync: 0,
  scheduledDrops: 0,
  syncSuccess: 0,
  syncFailed: 0
};

function DashboardContent() {
  const { currentShop } = useShop();
  const { user, isAdmin } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState<DashboardStats>(INITIAL_STATS);

  // Get designs data
  const { designs, isLoading: designsLoading, error: designsError } = useDesigns(
    currentShop ? { shop_id: currentShop.id } : {}
  );

  React.useEffect(() => {
    if (designsError) {
      showToast('Error loading designs: ' + designsError, 'error');
    }
  }, [designsError, showToast]);

  React.useEffect(() => {
    showToast(`Welcome ${isAdmin ? 'Admin' : 'User'}: ${user?.name}`, 'info');
  }, [isAdmin, user, showToast]);

  // Set up real-time subscriptions
  React.useEffect(() => {
    if (!currentShop?.id) return;

    let subscriptions: RealtimeChannel[] = [];

    const setupSubscriptions = async () => {
      // Subscribe to designs changes
      const designsChannel = supabase
        .channel('designs-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'designs',
            filter: `shop_id=eq.${currentShop.id}`
          },
          () => loadStats()
        )
        .subscribe();

      // Subscribe to sync status changes
      const syncChannel = supabase
        .channel('sync-changes')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'sync_logs',
            filter: `shop_id=eq.${currentShop.id}`
          },
          () => loadStats()
        )
        .subscribe();

      subscriptions = [designsChannel, syncChannel];
    };

    setupSubscriptions();

    return () => {
      subscriptions.forEach(subscription => {
        supabase.removeChannel(subscription);
      });
    };
  }, [currentShop?.id]);

  React.useEffect(() => {
    if (currentShop?.id) {
      loadStats();
    }
  }, [currentShop]);

  const loadStats = async () => {
    try {
      if (!currentShop?.id) {
        throw new Error('No shop selected');
      }

      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select(`
          id,
          designs:designs(count),
          templates:pod_templates(count),
          collections:collections(count),
          products:products(count),
          sync_status:sync_logs(
            status,
            count
          ),
          drops:scheduled_drops(count)
        `)
        .eq('id', currentShop.id)
        .single();

      if (shopError) throw shopError;

      // Process sync status counts
      const syncStats = (shopData.sync_status as SyncStatus[]).reduce<Record<string, number>>((acc, curr) => ({
        ...acc,
        [curr.status]: curr.count
      }), { pending: 0, success: 0, failed: 0 });

      setStats({
        totalDesigns: shopData.designs[0]?.count || 0,
        activeTemplates: shopData.templates[0]?.count || 0,
        totalCollections: shopData.collections[0]?.count || 0,
        totalProducts: shopData.products[0]?.count || 0,
        pendingSync: syncStats.pending || 0,
        scheduledDrops: shopData.drops[0]?.count || 0,
        syncSuccess: syncStats.success || 0,
        syncFailed: syncStats.failed || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const isLoadingAny = loading || designsLoading;

  if (isLoadingAny) {
    return (
      <LoadingState
        type="skeleton"
        count={4}
        columns={4}
        message="Loading dashboard..."
      />
    );
  }

  if (!currentShop) {
    return (
      <div className="flex flex-col items-center justify-center p-8">
        <AlertCircle className="h-12 w-12 text-yellow-500 mb-4" />
        <h2 className="text-xl font-semibold mb-2">No Shop Selected</h2>
        <p className="text-gray-600">Please select a shop to view the dashboard</p>
      </div>
    );
  }

  // Update total designs count from the useDesigns hook
  const totalDesigns = designs.length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            PrintVision Dashboard
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Current Shop: {currentShop.name}
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <button className="p-2 text-gray-400 hover:text-gray-500">
            <Bell className="h-6 w-6" />
          </button>
          {isAdmin && (
            <button className="p-2 text-gray-400 hover:text-gray-500">
              <Settings className="h-6 w-6" />
            </button>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <dt>
            <div className="absolute rounded-md bg-indigo-500 p-3">
              <Palette className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Total Designs</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6">
            <p className="text-2xl font-semibold text-gray-900">{totalDesigns}</p>
          </dd>
        </Card>

        <Card className="p-6">
          <dt>
            <div className="absolute rounded-md bg-green-500 p-3">
              <FileStack className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Active Collections</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6">
            <p className="text-2xl font-semibold text-gray-900">{stats.totalCollections}</p>
          </dd>
        </Card>

        <Card className="p-6">
          <dt>
            <div className="absolute rounded-md bg-yellow-500 p-3">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Scheduled Drops</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6">
            <p className="text-2xl font-semibold text-gray-900">{stats.scheduledDrops}</p>
          </dd>
        </Card>

        <Card className="p-6">
          <dt>
            <div className="absolute rounded-md bg-blue-500 p-3">
              <RefreshCw className="h-6 w-6 text-white" />
            </div>
            <p className="ml-16 truncate text-sm font-medium text-gray-500">Pending Sync</p>
          </dt>
          <dd className="ml-16 flex items-baseline pb-6">
            <p className="text-2xl font-semibold text-gray-900">{stats.pendingSync}</p>
          </dd>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            {QUICK_ACTIONS
              .filter(action => !action.adminOnly || isAdmin)
              .map(action => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.name}
                    onClick={() => window.location.href = action.link}
                    className="flex items-center justify-center space-x-2 bg-white border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <Icon className="h-5 w-5 text-gray-600" />
                    <span>{action.name}</span>
                  </button>
                );
              })}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Sync Status</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Successful</span>
              <span className="text-sm font-medium text-green-600">{stats.syncSuccess}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Failed</span>
              <span className="text-sm font-medium text-red-600">{stats.syncFailed}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500">Pending</span>
              <span className="text-sm font-medium text-yellow-600">{stats.pendingSync}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Provider Status */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Provider Status</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            { name: 'Printify', status: 'healthy' as const, latency: '120ms' },
            { name: 'Printful', status: 'healthy' as const, latency: '89ms' },
            { name: 'Gooten', status: 'degraded' as const, latency: '350ms' },
          ].map((provider) => (
            <div
              key={provider.name}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div>
                <h4 className="font-medium">{provider.name}</h4>
                <p className="text-sm text-gray-500">Latency: {provider.latency}</p>
              </div>
              {provider.status === 'healthy' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Admin Tools */}
      {isAdmin && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => window.location.href = '/settings'}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-5 w-5 text-gray-600" />
              <span>System Settings</span>
            </button>
            <button 
              onClick={() => window.location.href = '/audit-logs'}
              className="flex items-center justify-center space-x-2 bg-white border border-gray-200 p-3 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <AlertCircle className="h-5 w-5 text-gray-600" />
              <span>View Audit Logs</span>
            </button>
          </div>
        </Card>
      )}
    </div>
  );
}

export function Dashboard() {
  return (
    <ErrorBoundary>
      <DashboardContent />
    </ErrorBoundary>
  );
}
