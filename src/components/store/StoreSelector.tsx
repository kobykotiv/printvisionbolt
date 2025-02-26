import React from 'react';
import { ChevronDown, Store, AlertCircle, Lock, ArrowRight } from 'lucide-react';
import { useShop } from '../../contexts/ShopContext';
import { useNavigate } from 'react-router-dom';

export function StoreSelector() {
  const { currentShop, shops, setCurrentShop, loading, isAtShopLimit } = useShop();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleShopChange = async (shop: typeof currentShop) => {
    try {
      if (shop) {
        // Store selection in localStorage for persistence
        localStorage.setItem('selectedShopId', shop.id);
        setCurrentShop(shop);
      }
      setIsOpen(false);
      setError(null);
    } catch (err) {
      setError('Failed to switch shops. Please try again.');
      console.error('Error switching shops:', err);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse flex items-center h-10 px-4 py-2 bg-white rounded-lg shadow">
        <div className="h-4 w-32 bg-gray-200 rounded"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 px-4 py-2 rounded-lg">
        <AlertCircle className="h-4 w-4" />
        <span className="text-sm">{error}</span>
      </div>
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between w-full px-4 py-2 text-left bg-white rounded-lg shadow hover:bg-gray-50 ${
          isOpen ? 'ring-2 ring-indigo-500' : ''
        }`}
      >
        <div className="flex items-center gap-2">
          <Store className="h-4 w-4 text-gray-400" />
          <span className="text-sm font-medium text-gray-700">
            {currentShop?.name || 'Select a store'}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-gray-400 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && shops.length > 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg">
          <ul className="py-1 max-h-60 overflow-auto">
            {shops.map((shop) => (
              <li key={shop.id}>
                <button
                  onClick={() => handleShopChange(shop)}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-gray-100 ${
                    currentShop?.id === shop.id ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700'
                  }`}
                >
                  {shop.name}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {isAtShopLimit && (
        <div className="mt-2 bg-indigo-50 p-3 rounded-lg">
          <p className="text-sm text-indigo-700 mb-2">
            <Lock className="inline-block h-4 w-4 mr-1" />
            Free tier limited to 1 shop
          </p>
          <button
            onClick={() => navigate('/app/billing')}
            className="w-full flex items-center justify-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
          >
            Upgrade to Add More Shops
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      )}

      {isOpen && shops.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500">No stores available</p>
        </div>
      )}
    </div>
  );
}