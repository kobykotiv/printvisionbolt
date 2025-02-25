import React from 'react';
import { BarChart, ShoppingBag, AlertCircle, CheckCircle2, Palette, FileStack, Crown } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { useAuth } from '../contexts/auth/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { FreeUsageWidget } from '../components/ui/FreeUsageWidget';
import { supabase } from '../lib/supabase';
import { TEST_MODE } from '../lib/test-mode';
import Tutorial from '../components/ui/Tutorial'; // Import Tutorial component

export function Dashboard() {
  const { currentShop } = useShop();
  const { isDemoFree, isDemoEnterprise } = useAuth();
  const { showToast } = useToast();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalDesigns: 0,
    activeTemplates: 0,
    totalCollections: 0,
    totalProducts: 0
  });
  const [showTutorial, setShowTutorial] = React.useState(false);

  React.useEffect(() => {
    const tutorialCompleted = localStorage.getItem('tutorialCompleted');
    if (!tutorialCompleted) {
      setShowTutorial(true);
    }
  }, []);

  const completeTutorial = () => {
    localStorage.setItem('tutorialCompleted', 'true');
    setShowTutorial(false);
  };

  React.useEffect(() => {
    if (isDemoFree) {
      showToast('Welcome to the free demo! Some features are limited.', 'info');
    } else if (isDemoEnterprise) {
      showToast('Welcome to the enterprise demo! Full access enabled.', 'info');
    }
  }, [isDemoFree, isDemoEnterprise, showToast]);

  React.useEffect(() => {
    if (currentShop?.id) {
      loadStats();
    }
  }, [currentShop]);

  const loadStats = async () => {
    try {
      if (TEST_MODE) {
        const mockStats = {
          totalDesigns: isDemoFree ? 5 : Math.floor(Math.random() * 100),
          activeTemplates: isDemoFree ? 2 : Math.floor(Math.random() * 20),
          totalCollections: isDemoFree ? 1 : Math.floor(Math.random() * 10),
          totalProducts: isDemoFree ? 10 : Math.floor(Math.random() * 300)
        };
        setStats(mockStats);
        setLoading(false);
        return;
      }

      if (!currentShop?.id) {
        throw new Error('No shop selected');
      }

      // Get real-time stats from Supabase
      const { data: shopData, error: shopError } = await supabase
        .from('shops')
        .select(`
          id,
          designs:designs(count),
          templates:pod_templates(count),
          collections:collections(count),
          sync_logs:sync_logs(count)
        `)
        .eq('id', currentShop.id)
        .single();

      if (shopError) throw shopError;

      setStats({
        totalDesigns: shopData.designs[0]?.count || 0,
        activeTemplates: shopData.templates[0]?.count || 0,
        totalCollections: shopData.collections[0]?.count || 0,
        totalProducts: shopData.sync_logs[0]?.count || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
      showToast('Failed to load dashboard statistics', 'error');
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      name: 'Total Designs',
      value: stats.totalDesigns,
      icon: Palette,
      limited: isDemoFree
    },
    {
      name: 'Active Templates',
      value: stats.activeTemplates,
      icon: FileStack,
      limited: isDemoFree
    },
    {
      name: 'Collections',
      value: stats.totalCollections,
      icon: BarChart,
      limited: isDemoFree
    },
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBag,
      limited: isDemoFree
    }
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-lg shadow animate-pulse">
            <div className="h-8 w-8 bg-gray-200 rounded-md mb-4" />
            <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-8 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div>
      {showTutorial && <Tutorial onComplete={completeTutorial} />} {/* Show tutorial if needed */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard{currentShop?.name ? ` - ${currentShop.name}` : ''}
        </h1>
        {isDemoFree && (
          <div className="flex items-center text-yellow-600">
            <Crown className="h-5 w-5 mr-2" />
            <span>Free Demo Mode</span>
          </div>
        )}
        {isDemoEnterprise && (
          <div className="flex items-center text-indigo-600">
            <Crown className="h-5 w-5 mr-2" />
            <span>Enterprise Demo Mode</span>
          </div>
        )}
      </div>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className={`relative overflow-hidden rounded-lg bg-white p-6 shadow
                ${stat.limited ? 'opacity-75' : ''}`}
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
                  {stat.limited && (
                    <span className="ml-2 text-xs text-yellow-600">(Limited)</span>
                  )}
                </p>
              </dt>
              <dd className="ml-16 flex items-baseline pb-6">
                <p className="text-2xl font-semibold text-gray-900">
                  {stat.value}
                </p>
              </dd>
            </div>
          );
        })}
      </div>

      {/* Feature Limitations Panel */}
      {isDemoFree && (
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-yellow-100 rounded-lg p-6">
          <h2 className="text-lg font-medium text-yellow-800 mb-4">Free Demo Limitations</h2>
          <ul className="space-y-2">
            <li className="flex items-center text-yellow-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Limited to 5 designs
            </li>
            <li className="flex items-center text-yellow-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              Basic analytics only
            </li>
            <li className="flex items-center text-yellow-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              No team collaboration features
            </li>
          </ul>
          <button 
            onClick={() => showToast('Contact sales for enterprise demo access', 'info')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
          >
            Upgrade to Enterprise
          </button>
        </div>
      )}

      {/* Free Tier Usage */}
      {!isDemoEnterprise && (
        <div className="mt-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <FreeUsageWidget />
            </div>
          </div>
        </div>
      )}

      {/* API Health Status */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Health Status</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Printify', status: 'healthy', latency: '120ms' },
            { name: 'Printful', status: 'healthy', latency: '89ms' },
            { name: 'Gooten', status: isDemoFree ? 'unavailable' : 'degraded', latency: '350ms' },
          ].map((api) => (
            <div
              key={api.name}
              className="bg-white rounded-lg shadow p-4 flex items-center justify-between"
            >
              <div>
                <h3 className="font-medium text-gray-900">{api.name}</h3>
                <p className="text-sm text-gray-500">Latency: {api.latency}</p>
              </div>
              {api.status === 'healthy' ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : api.status === 'degraded' ? (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
              ) : (
                <AlertCircle className="h-5 w-5 text-gray-400" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h2>
        <div className="rounded-lg bg-white shadow">
          <div className="p-6">
            <div className="flow-root">
              <ul role="list" className="-mb-8">
                <li className="relative pb-8">
                  <span
                    className="absolute left-4 top-4 -ml-px h-full w-0.5 bg-gray-200"
                    aria-hidden="true"
                  />
                  <div className="relative flex space-x-3">
                    <div>
                      <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center ring-8 ring-white">
                        <ShoppingBag className="h-5 w-5 text-white" />
                      </span>
                    </div>
                    <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                      <div>
                        <p className="text-sm text-gray-500">
                          New product <span className="font-medium text-gray-900">Summer Collection T-Shirt</span> created
                        </p>
                      </div>
                      <div className="whitespace-nowrap text-right text-sm text-gray-500">
                        3h ago
                      </div>
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
