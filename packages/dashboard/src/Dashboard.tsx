import React from 'react';
import { Bell, Settings } from 'react-icons/fa';

const Dashboard = ({ currentShop, designs, isAdmin }) => {
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
      <div>
        <h2 className="text-xl font-semibold text-gray-900">Total Designs</h2>
        <p className="text-lg text-gray-700">{totalDesigns}</p>
      </div>
    </div>
  );
};

export default Dashboard;
