import React from 'react';
import { StoreSelector } from '../components/store/StoreSelector';

const ShopSelector: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Select Your Shop
        </h1>
        
        {/* Description */}
        <p className="text-gray-600 mb-8">
          Choose the shop you want to manage. You can switch between shops at any time.
        </p>

        {/* Shop Selection Component */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <StoreSelector />
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </h2>
            <div className="space-y-3">
              {/* Placeholder for recent activity */}
              <p className="text-gray-600">No recent activity</p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition duration-150 ease-in-out">
                Create New Shop
              </button>
              <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded transition duration-150 ease-in-out">
                Import Existing Shop
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShopSelector;