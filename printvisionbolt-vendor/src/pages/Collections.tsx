import React, { useState, useEffect } from 'react';
import { CollectionService } from '../lib/services/CollectionService';
import { CollectionHierarchyNode } from '../lib/types/collection';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Loader2,
  Check,
  ChevronDown,
  CalendarRange,
  Clock
} from 'lucide-react';
import './Collections.css';

const collectionService = new CollectionService();

export default function Collections() {
  const queryClient = useQueryClient();
  const [collections, setCollections] = useState<CollectionHierarchyNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    tags: []
  });

  const { data, error } = useQuery({
    queryKey: ['collections-hierarchy'],
    queryFn: () => collectionService.getCollectionHierarchy(),
  });

  useEffect(() => {
    if (data) {
      const flatCollections = flattenHierarchy(data);
      setCollections(flatCollections);
      setLoading(false);
    }
  }, [data]);

  if (error) {
    return (
      <div className="error-state">
        <h2>Error Loading Collections</h2>
        <p>{error instanceof Error ? error.message : 'An unexpected error occurred'}</p>
        <button
          onClick={() => queryClient.invalidateQueries({ queryKey: ['collections-hierarchy'] })}
          className="retry-button"
        >
          Retry
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
          <p className="mt-2 text-sm text-gray-500">Loading collections...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="collections-page">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Collection
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search collections..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Filter Dropdown (to be implemented) */}
        <div className="relative" data-filter-dropdown>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
              Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'all')
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>

          {showFilters && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-4 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {['all', 'active', 'draft', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilters(f => ({ ...f, status: status }))}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.status === status
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Check
                          className={`inline h-4 w-4 mr-2 ${
                            filters.status === status ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter (example - adjust as needed) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Time', icon: CalendarRange },
                      { value: 'today', label: 'Today', icon: Clock },
                      { value: 'week', label: 'Past Week', icon: CalendarRange },
                      { value: 'month', label: 'Past Month', icon: CalendarRange }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setFilters(f => ({ ...f, dateRange: value }))}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.dateRange === value
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="inline h-4 w-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter (example - adjust as needed) */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {/* Add tags logic here if collections have tags */}
                    <p className="text-sm text-gray-500">No tags available for collections yet.</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          <div className="col-span-full flex justify-center">
            <Loader2 className="h-6 w-6 animate-spin" /> Loading Collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12 col-span-full">
            <p className="text-gray-500">No collections found. Create your first collection to get started.</p>
          </div>
        ) : (
          collections.map((collection) => (
            <div
              key={collection.id}
              className="relative group bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Edit Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => {/* handleEditClick(collection) */}}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  title="Edit Collection"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {collection.name}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {collection.description || 'No description'}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    {collection.designCount} designs
                  </div>
                </div>
                {/* Tags (if applicable) */}
                {collection.tags && collection.tags.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {collection.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          {/* <CollectionForm onSave={handleSave} /> */}
          <div>Collection Form (To be implemented)</div>
        </div>
      )}
    </div>
  );
}


function flattenHierarchy(hierarchy: CollectionHierarchyNode[]): CollectionHierarchyNode[] {
  return hierarchy.reduce<CollectionHierarchyNode[]>((acc, node) => {
    return acc.concat(node, flattenHierarchy(node.children || []));
  }, []);
}
