import React from 'react';
import { BarChart, Users, ShoppingBag, TrendingUp, AlertCircle, CheckCircle2, Palette, FileStack } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { FreeUsageWidget } from '../components/ui/FreeUsageWidget';
import { supabase } from '../lib/supabase';
import { TEST_MODE } from '../lib/test-mode';

export function Dashboard() {
  const { currentShop } = useShop();
  const [loading, setLoading] = React.useState(true);
  const [stats, setStats] = React.useState({
    totalDesigns: 0,
    activeTemplates: 0,
    totalCollections: 0,
    totalProducts: 0
  });

  React.useEffect(() => {
    if (currentShop) {
      loadStats();
    }
  }, [currentShop]);

  const loadStats = async () => {
    try {
      if (TEST_MODE) {
        const mockStats = {
          totalDesigns: Math.floor(Math.random() * 100),
          activeTemplates: Math.floor(Math.random() * 20),
          totalCollections: Math.floor(Math.random() * 10),
          totalProducts: Math.floor(Math.random() * 300)
        };
        setStats(mockStats);
        setLoading(false);
        return;
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
    } finally {
      setLoading(false);
    }
  };

  const dashboardStats = [
    {
      name: 'Total Designs',
      value: stats.totalDesigns,
      icon: Palette
    },
    {
      name: 'Active Templates',
      value: stats.activeTemplates,
      icon: FileStack
    },
    {
      name: 'Collections',
      value: stats.totalCollections,
      icon: BarChart
    },
    {
      name: 'Total Products',
      value: stats.totalProducts,
      icon: ShoppingBag
    }
  ];

  React.useEffect(() => {
    // Simulate loading data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

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
      <h1 className="text-2xl font-bold text-gray-900 mb-8">
        Dashboard - {currentShop?.name}
      </h1>
      
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.name}
              className="relative overflow-hidden rounded-lg bg-white p-6 shadow"
            >
              <dt>
                <div className="absolute rounded-md bg-indigo-500 p-3">
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <p className="ml-16 truncate text-sm font-medium text-gray-500">
                  {stat.name}
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



      {/* API Health Status */}
      <div className="mt-8">
        <h2 className="text-lg font-medium text-gray-900 mb-4">API Health Status</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { name: 'Printify', status: 'healthy', latency: '120ms' },
            { name: 'Printful', status: 'healthy', latency: '89ms' },
            { name: 'Gooten', status: 'degraded', latency: '350ms' },
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
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-500" />
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
                {/* Add more activity items as needed */}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
