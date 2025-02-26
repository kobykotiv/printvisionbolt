import React, { useState } from 'react';
import { Calendar, Tag, Plus } from 'lucide-react';
import { PageTemplate } from '../../components/ui/PageTemplate';
import { Card } from '../../components/ui/Card';
import Button from '../../components/ui/Button';

interface ScheduledDrop {
  id: string;
  name: string;
  status: 'scheduled' | 'active' | 'completed' | 'cancelled';
  startDate: string;
  endDate: string;
  productCount: number;
  collections: string[];
}

const mockDrops: ScheduledDrop[] = [
  {
    id: '1',
    name: 'Spring Collection 2025',
    status: 'scheduled',
    startDate: '2025-03-01T00:00:00Z',
    endDate: '2025-05-31T23:59:59Z',
    productCount: 45,
    collections: ['Spring Designs', 'Floral Patterns']
  },
  {
    id: '2',
    name: 'Summer Limited Edition',
    status: 'active',
    startDate: '2025-02-15T00:00:00Z',
    endDate: '2025-08-31T23:59:59Z',
    productCount: 30,
    collections: ['Summer Vibes', 'Beach Collection']
  },
  {
    id: '3',
    name: 'Valentine\'s Special',
    status: 'completed',
    startDate: '2025-02-01T00:00:00Z',
    endDate: '2025-02-14T23:59:59Z',
    productCount: 20,
    collections: ['Love Theme']
  }
];

const DropsPage: React.FC = () => {
  const [isLoading] = useState(false);

  const actions = (
    <Button variant="primary" size="md">
      <Plus className="h-4 w-4 mr-2" />
      Schedule New Drop
    </Button>
  );

  const getStatusColor = (status: ScheduledDrop['status']) => {
    switch (status) {
      case 'scheduled':
        return 'text-blue-600 bg-blue-100';
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'completed':
        return 'text-gray-600 bg-gray-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
    }
  };

  const formatDateRange = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    return `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;
  };

  return (
    <PageTemplate
      title="Scheduled Drops"
      description="Manage your scheduled product releases and limited-time collections"
      actions={actions}
      isLoading={isLoading}
    >
      <div className="space-y-6">
        {mockDrops.map((drop) => (
          <Card key={drop.id} className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-medium text-gray-900">{drop.name}</h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {formatDateRange(drop.startDate, drop.endDate)}
                  </span>
                  <span className="flex items-center">
                    <Tag className="h-4 w-4 mr-1" />
                    {drop.productCount} products
                  </span>
                </div>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(drop.status)}`}>
                {drop.status}
              </span>
            </div>

            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-700">Collections</h4>
              <div className="mt-2 flex flex-wrap gap-2">
                {drop.collections.map((collection) => (
                  <span
                    key={collection}
                    className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-800"
                  >
                    {collection}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-6 flex space-x-3">
              <Button variant="secondary" size="sm" className="flex-1">
                View Details
              </Button>
              {drop.status === 'scheduled' && (
                <Button variant="secondary" size="sm" className="flex-1">
                  Edit Schedule
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </PageTemplate>
  );
};

export default DropsPage;