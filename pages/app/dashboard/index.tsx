import React from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';

const DashboardPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of your print-on-demand business
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <Card className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Total Products</h3>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">24</p>
              <span className="text-green-600 text-sm font-medium">+12%</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Active Blueprints</h3>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">18</p>
              <span className="text-blue-600 text-sm font-medium">5 new</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Collections</h3>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">6</p>
              <span className="text-gray-500 text-sm font-medium">Active</span>
            </div>
          </Card>

          <Card className="p-5">
            <h3 className="text-sm font-medium text-gray-500">Providers</h3>
            <div className="mt-1 flex items-baseline justify-between">
              <p className="text-2xl font-semibold text-gray-900">2</p>
              <span className="text-green-600 text-sm font-medium">All healthy</span>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-medium text-gray-900">Recent Activity</h2>
              <Button variant="ghost" size="sm" label="View all" />
            </div>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">New blueprint added</p>
                  <p className="text-sm text-gray-500">Summer Collection T-Shirt</p>
                  <p className="text-xs text-gray-400 mt-1">2 hours ago</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">Provider sync completed</p>
                  <p className="text-sm text-gray-500">Printful inventory updated</p>
                  <p className="text-xs text-gray-400 mt-1">5 hours ago</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                label="Create Blueprint"
                onClick={() => window.location.href = '/app/blueprints/new'}
                className="w-full justify-center"
              />
              <Button
                variant="outline"
                label="Add Collection"
                onClick={() => window.location.href = '/app/collections/new'}
                className="w-full justify-center"
              />
              <Button
                variant="outline"
                label="Add Provider"
                onClick={() => window.location.href = '/app/settings/providers'}
                className="w-full justify-center"
              />
              <Button
                variant="outline"
                label="View Analytics"
                onClick={() => window.location.href = '/app/analytics'}
                className="w-full justify-center"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;