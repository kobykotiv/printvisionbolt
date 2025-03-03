'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { GlassCard } from '@printvisionbolt/shared-ui/components/glass';

function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      {children}
    </GlassCard>
  );
}

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-gray-600 dark:text-gray-300">Manage your store preferences and account settings</p>
        </div>

        <div className="grid gap-6">
          <SettingsSection title="Store Information">
            <div className="space-y-4">
              <div>
                <label htmlFor="storeName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Name
                </label>
                <input
                  type="text"
                  id="storeName"
                  name="storeName"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue="My Print Store"
                />
              </div>
              
              <div>
                <label htmlFor="storeDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Store Description
                </label>
                <textarea
                  id="storeDescription"
                  name="storeDescription"
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  defaultValue="Custom print-on-demand products for everyone."
                />
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Appearance">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Theme
                </label>
                <div className="mt-2 space-x-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      className="form-radio"
                      defaultChecked
                    />
                    <span className="ml-2">Light</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      className="form-radio"
                    />
                    <span className="ml-2">Dark</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="theme"
                      value="system"
                      className="form-radio"
                    />
                    <span className="ml-2">System</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Accent Color
                </label>
                <div className="mt-2 flex items-center space-x-4">
                  <input
                    type="color"
                    id="accentColor"
                    name="accentColor"
                    defaultValue="#3B82F6"
                    className="h-8 w-8 rounded-full overflow-hidden"
                  />
                  <span className="text-sm text-gray-500">Select primary brand color</span>
                </div>
              </div>
            </div>
          </SettingsSection>

          <SettingsSection title="Notifications">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Email Notifications
                </label>
                <div className="mt-2 space-y-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="notifications"
                      value="newOrders"
                      className="form-checkbox"
                      defaultChecked
                    />
                    <span className="ml-2">New orders</span>
                  </label>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="notifications"
                        value="lowInventory"
                        className="form-checkbox"
                        defaultChecked
                      />
                      <span className="ml-2">Low inventory alerts</span>
                    </label>
                  </div>
                  <div>
                    <label className="inline-flex items-center">
                      <input
                        type="checkbox"
                        name="notifications"
                        value="reviews"
                        className="form-checkbox"
                        defaultChecked
                      />
                      <span className="ml-2">Customer reviews</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </SettingsSection>

          <div className="flex justify-end pt-4">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}