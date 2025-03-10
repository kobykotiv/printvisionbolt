'use client';

import React from 'react';
import { useFeatures } from '../../contexts/FeatureContext';
import { FeatureGuard } from '../../components/FeatureGuard';
import { FeatureLimit } from '../../components/FeatureLimit';

export default function AdminDashboard() {
  const { currentTier } = useFeatures();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tier Status */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-2xl font-bold mb-4">
            Current Plan: {currentTier.name}
          </h2>
          
          {/* Feature Usage Limits */}
          <div className="space-y-4">
            <FeatureLimit feature="products" showWarningAt={75} />
            <FeatureLimit feature="storage" showWarningAt={80} />
          </div>
        </div>

        {/* Analytics Section */}
        <FeatureGuard feature="analytics">
          <div className="bg-white rounded-lg shadow p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Analytics</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Analytics Content */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Views</h3>
                <p className="text-2xl">1,234</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Orders</h3>
                <p className="text-2xl">56</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold mb-2">Revenue</h3>
                <p className="text-2xl">$7,890</p>
              </div>
            </div>
          </div>
        </FeatureGuard>

        {/* Advanced Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <FeatureGuard feature="customDomain">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Custom Domain</h3>
              <p className="text-gray-600 mb-4">
                Configure your custom domain settings.
              </p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                Manage Domain
              </button>
            </div>
          </FeatureGuard>

          <FeatureGuard feature="multiLanguage">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-xl font-bold mb-4">Language Settings</h3>
              <p className="text-gray-600 mb-4">
                Manage your store's languages and translations.
              </p>
              <button className="bg-indigo-600 text-white px-4 py-2 rounded">
                Configure Languages
              </button>
            </div>
          </FeatureGuard>
        </div>
      </div>
    </div>
  );
}