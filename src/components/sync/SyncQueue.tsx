import React from 'react';
import { RefreshCw, AlertCircle, CheckCircle } from 'lucide-react';
import { SyncTask } from '../../types/pod';

interface SyncQueueProps {
  tasks: SyncTask[];
  onRetry: (taskId: string) => void;
  onCancel: (taskId: string) => void;
}

export function SyncQueue({ tasks, onRetry, onCancel }: SyncQueueProps) {
  const statusIcons = {
    pending: <RefreshCw className="w-4 h-4 text-yellow-500" />,
    processing: <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />,
    completed: <CheckCircle className="w-4 h-4 text-green-500" />,
    failed: <AlertCircle className="w-4 h-4 text-red-500" />
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Entity
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Stores
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Created At
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {statusIcons[task.status]}
                  <span className="ml-2 text-sm text-gray-900">
                    {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                  </span>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.entity} ({task.entityId})
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.stores.join(', ')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {new Date(task.createdAt).toLocaleString()}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {task.status === 'failed' && (
                  <button
                    onClick={() => onRetry(task.id)}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    Retry
                  </button>
                )}
                {task.status === 'pending' && (
                  <button
                    onClick={() => onCancel(task.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
