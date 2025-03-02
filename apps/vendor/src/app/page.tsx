'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';

function StatsCard({ title, value, trend }: { title: string; value: string; trend?: number }) {
  return (
    <GlassCard className="p-6">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h3>
      <p className="mt-2 text-3xl font-bold">{value}</p>
      {trend !== undefined && (
        <p className={`mt-2 text-sm ${trend >= 0 ? 'text-green-600' : 'text-red-600'}`}>
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
        </p>
      )}
    </GlassCard>
  );
}

export default function DashboardPage() {
  // TODO: Replace with actual data from API
  const stats = [
    { title: 'Total Orders', value: '156', trend: 12 },
    { title: 'Revenue', value: '$12,426', trend: 8 },
    { title: 'Products', value: '45', trend: 0 },
    { title: 'Customers', value: '892', trend: 15 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-300">Welcome back! Here's your business at a glance.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <StatsCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              trend={stat.trend}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No orders to display yet.
            </p>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="text-lg font-semibold mb-4">Popular Products</h2>
            <p className="text-gray-600 dark:text-gray-300">
              No products to display yet.
            </p>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}