import React from 'react';
import { Search, Tag, Check, Clock } from 'lucide-react';
import type { Design } from '../../lib/types/design';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { cn } from '../../lib/utils';
import { mockDesigns } from '../../lib/types/design';

interface DesignSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (designs: Design[]) => void;
  selectedDesigns?: Design[];
}

export function DesignSearchModal({
  isOpen,
  onClose,
  onSelect,
  selectedDesigns = []
}: DesignSearchModalProps) {
  const [search, setSearch] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState<Design[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(selectedDesigns.map(d => d.id))
  );
  const [activeFilters, setActiveFilters] = React.useState({
    category: '',
    status: 'active' as const
  });

  // Debounced search
  const searchTimeout = React.useRef<NodeJS.Timeout>();
  
  React.useEffect(() => {
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }

    searchTimeout.current = setTimeout(() => {
      performSearch();
    }, 300);

    return () => {
      if (searchTimeout.current) {
        clearTimeout(searchTimeout.current);
      }
    };
  }, [search, activeFilters]);

  const performSearch = async () => {
    setLoading(true);
    try {
      // In a real app, this would be an API call
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay

      const filtered = mockDesigns.filter(design => {
        if (activeFilters.category && design.category !== activeFilters.category) {
          return false;
        }
        if (activeFilters.status && design.status !== activeFilters.status) {
          return false;
        }
        if (search) {
          const searchLower = search.toLowerCase();
          return (
            design.name.toLowerCase().includes(searchLower) ||
            design.tags.some(tag => tag.toLowerCase().includes(searchLower))
          );
        }
        return true;
      });

      setResults(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUniqueCategories = () => {
    const categories = new Set(mockDesigns.map(d => d.category));
    return Array.from(categories);
  };

  const toggleDesign = (design: Design) => {
    const newSelected = new Set(selected);
    if (newSelected.has(design.id)) {
      newSelected.delete(design.id);
    } else {
      newSelected.add(design.id);
    }
    setSelected(newSelected);
  };

  const handleConfirm = () => {
    const selectedItems = results.filter(d => selected.has(d.id));
    onSelect(selectedItems);
    onClose();
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Designs"
      size="lg"
    >
      <div className="space-y-6">
        {/* Search and Filters */}
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search designs by name or tags..."
              className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex space-x-4">
            <select
              value={activeFilters.category}
              onChange={e => setActiveFilters(prev => ({ ...prev, category: e.target.value }))}
              className="border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">All Categories</option>
              {getUniqueCategories().map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map(design => (
              <div
                key={design.id}
                onClick={() => toggleDesign(design)}
                className={cn(
                  "relative cursor-pointer rounded-lg border overflow-hidden group",
                  selected.has(design.id) && "ring-2 ring-indigo-500"
                )}
              >
                <div className="aspect-w-1 aspect-h-1">
                  <img
                    src={design.thumbnailUrl}
                    alt={design.name}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
                  {selected.has(design.id) && (
                    <div className="absolute top-2 right-2">
                      <div className="bg-indigo-500 rounded-full p-1">
                        <Check className="h-4 w-4 text-white" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h4 className="text-sm font-medium text-gray-900 truncate">
                    {design.name}
                  </h4>
                  <div className="mt-1 flex items-center text-xs text-gray-500">
                    <Clock className="h-3 w-3 mr-1" />
                    {formatDate(design.updatedAt)}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {design.tags.slice(0, 2).map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        <Tag className="h-3 w-3 mr-1" />
                        {tag}
                      </span>
                    ))}
                    {design.tags.length > 2 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{design.tags.length - 2}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No designs found matching your search.</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            disabled={selected.size === 0}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add {selected.size} Design{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </Modal>
  );
}