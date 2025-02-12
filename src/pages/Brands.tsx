import React from 'react';
import { Tags, Plus, Edit, Trash2, Search, Palette, RefreshCw, Eye } from 'lucide-react';
import { useShop } from '../contexts/ShopContext';
import { supabase } from '../lib/supabase';
import { TEST_MODE, MOCK_BRANDS } from '../lib/test-mode';
import { cn } from '../lib/utils';
import { Modal } from '../components/ui/Modal';
import { ConfirmationModal } from '../components/ui/ConfirmationModal';
import { BrandForm } from '../components/brands/BrandForm';
import type { Brand } from '../lib/types/brand';

type ModalType = 'create' | 'edit' | 'view' | 'delete' | null;

export function Brands() {
  const { currentShop } = useShop();
  const [brands, setBrands] = React.useState<Brand[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedBrands, setSelectedBrands] = React.useState<string[]>([]);
  const [currentBrand, setCurrentBrand] = React.useState<Brand | null>(null);
  const [modalType, setModalType] = React.useState<ModalType>(null);

  React.useEffect(() => {
    if (currentShop) {
      loadBrands();
    }
  }, [currentShop]);

  const loadBrands = async () => {
    try {
      if (TEST_MODE) {
        setBrands(MOCK_BRANDS);
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .eq('shop_id', currentShop?.id);

      if (error) throw error;
      setBrands(data);
    } catch (error) {
      console.error('Error loading brands:', error);
    } finally {
      setLoading(false);
    }
  };

  const createBrand = async () => {
    try {
      if (TEST_MODE) {
        const newBrand = {
          id: `brand-${brands.length + 1}`,
          shop_id: currentShop?.id || '',
          name: 'New Brand',
          description: 'Add a description for your brand',
          logo_url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&q=80&w=200',
          color_scheme: {
            primary: '#6366F1',
            secondary: '#8B5CF6'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        setBrands(prev => [...prev, newBrand]);
        return;
      }

      const { data, error } = await supabase
        .from('brands')
        .insert({
          shop_id: currentShop?.id,
          name: 'New Brand',
          description: 'Add a description for your brand',
          color_scheme: {
            primary: '#6366F1',
            secondary: '#8B5CF6'
          }
        })
        .select()
        .single();

      if (error) throw error;
      setBrands(prev => [...prev, data]);
    } catch (error) {
      console.error('Error creating brand:', error);
    }
  };

  const handleSave = async (data: Brand) => {
    setSubmitting(true);
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (modalType === 'create') {
          setBrands(prev => [...prev, { ...data, id: `brand-${Date.now()}` }]);
        } else {
          setBrands(prev => prev.map(b => b.id === currentBrand?.id ? { ...b, ...data } : b));
        }
        setModalType(null);
        return;
      }

      const { error } = await supabase
        .from('brands')
        .upsert({
          ...data,
          id: currentBrand?.id,
          shop_id: currentShop?.id
        });

      if (error) throw error;
      await loadBrands();
      setModalType(null);
    } catch (error) {
      console.error('Error saving brand:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBrands(prev => prev.filter(b => !selectedBrands.includes(b.id!)));
        setSelectedBrands([]);
        return;
      }

      const { error } = await supabase
        .from('brands')
        .delete()
        .in('id', selectedBrands);

      if (error) throw error;
      await loadBrands();
      setSelectedBrands([]);
    } catch (error) {
      console.error('Error deleting brands:', error);
    }
  };

  const toggleBrandSelection = (id: string) => {
    setSelectedBrands(prev => 
      prev.includes(id) 
        ? prev.filter(bId => bId !== id)
        : [...prev, id]
    );
  };

  const filteredBrands = brands.filter(brand => 
    brand.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    brand.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Brands</h1>
        <div className="flex gap-2">
          {selectedBrands.length > 0 && (
            <button
              onClick={handleDelete}
              className="inline-flex items-center px-4 py-2 border border-red-600 shadow-sm text-sm font-medium rounded-md text-red-600 bg-white hover:bg-red-50"
            >
              <Trash2 className="h-5 w-5 mr-2" />
              Delete Selected
            </button>
          )}
          <button
            onClick={() => {
              setCurrentBrand(null);
              setModalType('create');
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
          >
            <Plus className="h-5 w-5 mr-2" />
            New Brand
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search brands..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <Tags className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No brands found</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search'
              : 'Get started by creating a new brand.'}
          </p>
          <div className="mt-6">
            <button
              onClick={() => {
                setCurrentBrand(null);
                setModalType('create');
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Brand
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredBrands.map((brand) => (
            <div
              key={brand.id}
              className={cn(
                "bg-white rounded-lg shadow overflow-hidden group relative",
                selectedBrands.includes(brand.id) && "ring-2 ring-indigo-500"
              )}
            >
              {/* Selection Checkbox */}
              <div className="absolute top-4 left-4 z-10">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand.id)}
                  onChange={() => toggleBrandSelection(brand.id)}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
              </div>

              <div className="h-32 w-full relative bg-gradient-to-r"
                style={{
                  backgroundImage: brand.color_scheme 
                    ? `linear-gradient(to right, ${brand.color_scheme.primary}, ${brand.color_scheme.secondary})`
                    : 'linear-gradient(to right, #6366F1, #8B5CF6)'
                }}
              >
                {brand.logo_url && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <img
                      src={brand.logo_url}
                      alt={brand.name}
                      className="h-16 w-16 object-cover rounded-full border-2 border-white shadow-md"
                    />
                  </div>
                )}
              </div>

              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{brand.name}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{brand.description}</p>
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => {
                      setCurrentBrand(brand);
                      setModalType('edit');
                    }}
                    className="flex-1 flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Brand
                  </button>
                  <button
                    onClick={() => {
                      setCurrentBrand(brand);
                      setModalType('view');
                    }}
                    className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentBrand(brand);
                      setModalType('delete');
                    }}
                    className="flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <Palette className="h-4 w-4" />
                  </button>
                </div>

                {brand.color_scheme && (
                  <div className="mt-4 flex gap-2">
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Primary</div>
                      <div className="h-6 rounded" style={{ backgroundColor: brand.color_scheme.primary }} />
                    </div>
                    <div className="flex-1">
                      <div className="text-xs text-gray-500 mb-1">Secondary</div>
                      <div className="h-6 rounded" style={{ backgroundColor: brand.color_scheme.secondary }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal
        isOpen={modalType === 'create' || modalType === 'edit'}
        onClose={() => setModalType(null)}
        title={modalType === 'create' ? 'Create Brand' : 'Edit Brand'}
      >
        <BrandForm
          brand={currentBrand || undefined}
          onSubmit={handleSave}
          isSubmitting={submitting}
        />
      </Modal>

      {/* View Modal */}
      <Modal
        isOpen={modalType === 'view'}
        onClose={() => setModalType(null)}
        title="Brand Details"
      >
        {currentBrand && (
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="mt-1 text-sm text-gray-900">{currentBrand.name}</p>
            </div>
            {currentBrand.description && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Description</h3>
                <p className="mt-1 text-sm text-gray-900">{currentBrand.description}</p>
              </div>
            )}
            {currentBrand.logo_url && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Logo</h3>
                <img
                  src={currentBrand.logo_url}
                  alt={currentBrand.name}
                  className="mt-1 h-32 w-32 object-cover rounded-lg"
                />
              </div>
            )}
            {currentBrand.color_scheme && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Color Scheme</h3>
                <div className="mt-1 flex gap-4">
                  <div>
                    <div className="text-xs text-gray-500">Primary</div>
                    <div
                      className="h-8 w-16 rounded mt-1"
                      style={{ backgroundColor: currentBrand.color_scheme.primary }}
                    />
                  </div>
                  <div>
                    <div className="text-xs text-gray-500">Secondary</div>
                    <div
                      className="h-8 w-16 rounded mt-1"
                      style={{ backgroundColor: currentBrand.color_scheme.secondary }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={modalType === 'delete'}
        onClose={() => setModalType(null)}
        onConfirm={handleDelete}
        title="Delete Brand"
        message="Are you sure you want to delete this brand? This action cannot be undone."
        confirmLabel="Delete"
        isDestructive
      />
    </div>
  );
}
