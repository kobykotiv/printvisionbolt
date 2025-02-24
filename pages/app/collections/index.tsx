import React, { useState } from 'react';
import { Card } from '../../../components/ui/Card';
import { Button } from '../../../components/ui/Button';
import { Input } from '../../../components/ui/Input';
import { logger } from '../../../src/features/blueprints/utils/logger';

interface Collection {
  id: string;
  name: string;
  description?: string;
  productCount: number;
  parentId?: string;
  children?: Collection[];
  status: 'active' | 'draft' | 'archived';
}

const mockCollections: Collection[] = [
  {
    id: '1',
    name: 'Summer Collection 2025',
    description: 'Fresh and vibrant designs for summer',
    productCount: 12,
    status: 'active',
    children: [
      {
        id: '1-1',
        name: 'Beach Vibes',
        productCount: 5,
        status: 'active'
      },
      {
        id: '1-2',
        name: 'Tropical Prints',
        productCount: 7,
        status: 'active'
      }
    ]
  },
  {
    id: '2',
    name: 'Winter Essentials',
    description: 'Cozy and warm winter designs',
    productCount: 8,
    status: 'draft',
    children: [
      {
        id: '2-1',
        name: 'Holiday Sweaters',
        productCount: 4,
        status: 'draft'
      }
    ]
  }
];

const CollectionCard: React.FC<{ collection: Collection }> = ({ collection }) => {
  const getStatusColor = (status: Collection['status']) => {
    switch (status) {
      case 'active':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'draft':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'archived':
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-medium text-gray-900">{collection.name}</h3>
          {collection.description && (
            <p className="text-sm text-gray-500 mt-1">{collection.description}</p>
          )}
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium capitalize border ${getStatusColor(collection.status)}`}>
          {collection.status}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500">
            {collection.productCount} products
          </span>
          {collection.children && (
            <span className="text-sm text-gray-500">
              {collection.children.length} subcollections
            </span>
          )}
        </div>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            label="Edit"
            onClick={() => {
              logger.debug('Edit collection clicked', { collectionId: collection.id });
            }}
          />
          <Button
            variant="outline"
            size="sm"
            label="View"
            onClick={() => {
              logger.debug('View collection clicked', { collectionId: collection.id });
            }}
          />
        </div>
      </div>

      {collection.children && collection.children.length > 0 && (
        <div className="mt-4 pl-4 border-l border-gray-200">
          {collection.children.map(child => (
            <div key={child.id} className="mt-4 first:mt-0">
              <CollectionCard collection={child} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

const CollectionsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
              <p className="mt-1 text-sm text-gray-500">
                Organize your products into collections
              </p>
            </div>
            <Button
              variant="primary"
              label="New Collection"
              onClick={() => {
                logger.debug('New collection button clicked');
                // TODO: Implement collection creation
              }}
            />
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6">
          <div className="flex space-x-4">
            <Input
              type="text"
              placeholder="Search collections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-md"
            />
            <Button
              variant="outline"
              label="Filter"
              onClick={() => {
                logger.debug('Filter clicked', { searchQuery });
              }}
            />
          </div>
        </div>

        {/* Collections Grid */}
        <div className="space-y-6">
          {mockCollections.map(collection => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>

        {/* Empty State */}
        {mockCollections.length === 0 && (
          <Card className="p-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No collections</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new collection
            </p>
            <div className="mt-6">
              <Button
                variant="primary"
                label="New Collection"
                onClick={() => {
                  logger.debug('New collection button clicked (empty state)');
                  // TODO: Implement collection creation
                }}
              />
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CollectionsPage;