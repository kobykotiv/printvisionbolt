import React, { useState } from 'react';
import { BlueprintMonitor } from '../BlueprintMonitor';
import { MetricsDisplay } from '../MetricsDisplay';
import { Button } from '../../../../../components/ui/Button';

interface MonitoringDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

type TabType = 'logs' | 'metrics';

export function MonitoringDialog({ isOpen, onClose }: MonitoringDialogProps) {
  const [activeTab, setActiveTab] = useState<TabType>('logs');

  if (!isOpen) return null;

  const tabStyle = (tab: TabType) => `
    px-4 py-2 text-sm font-medium rounded-md transition-colors
    ${activeTab === tab
      ? 'bg-blue-50 text-blue-700 border border-blue-200'
      : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
    }
  `;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      <div className="absolute inset-4 lg:inset-16 bg-white rounded-lg shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b bg-gray-50">
          <h2 className="text-xl font-semibold text-gray-900">Integration Monitor</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <svg
              className="w-5 h-5 text-gray-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b px-4">
          <div className="flex space-x-4 -mb-px">
            <button
              className={tabStyle('logs')}
              onClick={() => setActiveTab('logs')}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16m-7 6h7"
                  />
                </svg>
                <span>Activity Logs</span>
              </div>
            </button>
            <button
              className={tabStyle('metrics')}
              onClick={() => setActiveTab('metrics')}
            >
              <div className="flex items-center space-x-2">
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                <span>Performance</span>
              </div>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4">
            {activeTab === 'logs' ? (
              <BlueprintMonitor />
            ) : (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-1">Provider Performance</h3>
                  <p className="text-sm text-gray-500">
                    Monitor the health and performance metrics of your print providers
                  </p>
                </div>
                <MetricsDisplay />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t bg-gray-50 px-4 py-3">
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              size="sm"
              label="Refresh"
              onClick={() => window.location.reload()}
            />
            <Button
              variant="outline"
              size="sm"
              label="Close"
              onClick={onClose}
            />
          </div>
        </div>
      </div>
    </div>
  );
}