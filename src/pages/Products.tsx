import React from 'react';
import { Package, Search, Filter, Plus, RefreshCw } from 'lucide-react';
import { NewProductModal } from '../components/ui/NewProductModal';
import { ProductCard } from '../components/products/ProductCard';
import { productService } from '../lib/services/productService';
import type { Product } from '../lib/types/product';
import type { Blueprint } from '../lib/types/template';
import { useShop } from '../contexts/ShopContext';
import { cn } from '../lib/utils';

export function Products() {
  const { currentShop } = useShop();
  const [showNewModal, setShowNewModal] = React.useState(false);
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState({
    status: [] as string[],
    provider: [] as string[],
    inStock: false
  });
  const [page, setPage] = React.useState(1);
  const [totalPages, setTotalPages] = React.useState(1);

  const [blueprints] = React.useState<Blueprint[]>([
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
      loadProducts();
    }
  }, [currentShop, searchQuery, filters, page]);

  const loadProducts = async () => {
    if (!currentShop) return;
    
    try {
      setLoading(true);
      const result = await productService.searchProducts(
        currentShop.id,
        searchQuery,
        filters,
        page
      );
      setProducts(result.data);
      setTotalPages(result.pagination.totalPages);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (product: Product) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    // Implement delete logic
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <button
          onClick={() => setShowNewModal(true)}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Package className="h-5 w-5 mr-2" />
          New Product
        </button>
      </div>

      {/* Search and Filters */}
      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        
        <button
          onClick={() => {}} // Implement filter modal
          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          <Filter className="h-5 w-5 mr-2" />
          Filter
        </button>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <RefreshCw className="h-8 w-8 text-gray-400 animate-spin" />
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-gray-400 mx-auto" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No products</h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating a new product.
          </p>
          <div className="mt-6">
            <button
              onClick={() => setShowNewModal(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Plus className="h-5 w-5 mr-2" />
              New Product
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onEdit={() => {}} // Implement edit
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                onClick={() => setPage(i + 1)}
                className={cn(
                  "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                  page === i + 1
                    ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                    : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                )}
              >
                {i + 1}
              </button>
            ))}
          </nav>
        </div>
      )}

      <NewProductModal
        isOpen={showNewModal}
        onClose={() => setShowNewModal(false)}
        onSave={async (data) => {
          console.log('Saving product:', data);
          // TODO: Implement save logic using productService
        }}
        blueprints={blueprints}
      />
    </div>
  );
}