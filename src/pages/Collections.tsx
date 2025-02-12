import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TextSelection as Collection, Calendar, ArrowRight, Plus, RefreshCw, Edit, Trash2, Search, Filter } from 'lucide-react';
import { NewCollectionModal } from '../components/ui/NewCollectionModal';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import { cn } from '../lib/utils';
import type { Blueprint } from '../lib/types/template';

interface CollectionData {
  id: string;
  name: string;
  description: string | null;
  products: string[];
  scheduled_drops: any[];
  status: 'active' | 'draft';
  thumbnail?: string;
  productCount?: number;
  scheduledFor?: string;
  created_at: string;
  updated_at: string;
}

export function Collections() {
  const navigate = useNavigate();
  const { currentShop } = useShop();
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [collections, setCollections] = React.useState<CollectionData[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [statusFilter, setStatusFilter] = React.useState<'all' | 'active' | 'draft'>('all');
  const [selectedCollections, setSelectedCollections] = React.useState<string[]>([]);
  const [availableBlueprints] = React.useState<Blueprint[]>([
    {
      id: 'bp-1',
      title: 'Classic T-Shirt',
      provider: 'printify',
      providerId: 'pfy-1',
      variants: [],
      placeholders: [],
      pricing: { baseCost: 15, retailPrice: 29.99 }
    }
  ]);

  React.useEffect(() => {
    if (currentShop) {
      loadCollections();
    }
  }, [currentShop]);

  const loadCollections = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .select('*')
        .eq('shop_id', currentShop?.id);

      if (error) throw error;

      const collectionsWithThumbnails = data.map((collection, index) => ({
        ...collection,
        thumbnail: index % 2 === 0
          ? 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400'
          : 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=400',
        productCount: collection.products?.length || 0,
        scheduledFor: collection.scheduled_drops?.[0]?.scheduled_for
      }));

      setCollections(collectionsWithThumbnails);
    } catch (error) {
      console.error('Error loading collections:', error);
    } finally {
      setLoading(false);
    }
  };

  const createCollection = async () => {
    try {
      const { data, error } = await supabase
        .from('collections')
        .insert({
          name: 'New Collection',
          description: 'Add a description for your collection',
          shop_id: currentShop?.id,
          products: [],
          scheduled_drops: [],
          status: 'draft'
        })
        .select()
        .single();

      if (error) throw error;

      const newCollection = {
        ...data,
        thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=400',
        productCount: 0
      };

      setCollections(prev => [...prev, newCollection]);
      navigate(`/collections/${newCollection.id}`);
    } catch (error) {
      console.error('Error creating collection:', error);
    }
  };

  const deleteCollections = async () => {
    if (!selectedCollections.length) return;

    try {
      const { error } = await supabase
        .from('collections')
        .delete()
        .in('id', selectedCollections);

      if (error) throw error;

      setCollections(prev => prev.filter(c => !selectedCollections.includes(c.id)));
      setSelectedCollections([]);
    } catch (error) {
      console.error('Error deleting collections:', error);
    }
  };

  const toggleCollectionSelection = (id: string) => {
    setSelectedCollections(prev => 
      prev.includes(id) 
        ? prev.filter(cId => cId !== id)
        : [...prev, id]
    );
  };

  const filteredCollections = collections
    .filter(collection => 
      collection.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      collection.description?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter(collection => 
      statusFilter === 'all' ? true : collection.status === statusFilter
    );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Collections</h1>
        <div className="flex gap-2">
          {selectedCollections.length > 0 && (
            <button
              onClick={deleteCollections}
              className="inline-flex items-center px-4 py-2 border border-red-600 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Selected
            </button>
          )}
          <button
            onClick={() => setShowNewModal(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Collection className="h-5 w-5 mr-2" />
            New Collection
          </button>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search collections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'draft')}
          className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="draft">Draft</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : filteredCollections.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Collection className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No collections found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery || statusFilter !== 'all' 
              ? 'Try adjusting your search or filters'
              : 'Get started by creating a new collection.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Collection
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCollections.map((collection) => (
            <div
              key={collection.id}
              className={cn(
                "bg-white rounded-lg shadow overflow-hidden group relative",
                selectedCollections.includes(collection.id) && "ring-2 ring-indigo-500"
              )}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedCollections.includes(collection.id)}
                  onChange={() => toggleCollectionSelection(collection.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={cn(
                  "px-2 py-1 text-xs font-medium rounded-full",
                  collection.status === 'active' 
                    ? "bg-green-100 text-green-800" 
                    : "bg-gray-100 text-gray-800"
                )}>
                  {collection.status}
                </span>
              </div>

              <div className="h-48 w-full relative">
                <img
                  src={collection.thumbnail}
                  alt={collection.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <h3 className="text-xl font-bold text-white">
                    {collection.name}
                  </h3>
                  <p className="text-sm text-gray-200 line-clamp-2">
                    {collection.description}
                  </p>
                </div>
              </div>
              <div className="p-4 space-y-4">
                <div className="flex justify-between items-center text-sm text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-1" />
                    {collection.scheduledFor ? (
                      new Date(collection.scheduledFor).toLocaleDateString()
                    ) : (
                      'Not scheduled'
                    )}
                  </div>
                  <div>{collection.productCount} products</div>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/collections/${collection.id}`)}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 group"
                  >
                    View Details
                    <ArrowRight className="h-4 w-4 ml-2 transition-transform group-hover:translate-x-1" />
                  </button>
                  <button 
                    onClick={() => navigate(`/collections/${collection.id}/edit`)}
                    className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <NewCollectionModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={async (data) => {
          console.log('Saving collection:', data);
          await createCollection();
        }}
        availableBlueprints={availableBlueprints}
      />
    </div>
  );
}