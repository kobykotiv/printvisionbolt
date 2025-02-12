import React from 'react';
import { BarChart, Users, ShoppingBag, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';

export function Dashboard() {
  const { currentShop } = useShop();
  const [loading, setLoading] = React.useState(true);

  const stats = [
    {
      name: 'Total Designs',
      value: '89',
      icon: BarChart,
      change: '+4.75%',
      changeType: 'positive',
    },
    {
      name: 'Active Products',
      value: '243',
      icon: ShoppingBag,
      change: '+21.5%',
      changeType: 'positive',
    },
    {
      name: 'Total Sales',
      value: '$12,789',
      icon: TrendingUp,
      change: '+10.18%',
      changeType: 'positive',
    },
    {
      name: 'Total Customers',
      value: '573',
      icon: Users,
      change: '+12.3%',
      changeType: 'positive',
    },
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
        {stats.map((stat) => {
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
                <p
                  className={`ml-2 flex items-baseline text-sm font-semibold ${
                    stat.changeType === 'positive'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {stat.change}
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
