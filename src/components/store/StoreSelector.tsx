import React from 'react';
import { ChevronDown, Store, AlertCircle } from 'lucide-react';
import { useShop } from '../../contexts/ShopContext';

export function StoreSelector() {
  const { currentShop, shops, setCurrentShop, loading } = useShop();
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

      {isOpen && shops.length === 0 && (
        <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg p-4">
          <p className="text-sm text-gray-500">No stores available</p>
        </div>
      )}
    </div>
  );
}