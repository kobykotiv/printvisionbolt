import React from 'react';
import { Search, Filter, Check, Package, AlertCircle, ChevronDown } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { useShop } from '../../contexts/ShopContext';
import { blueprintValidationService } from '../../lib/services/blueprintValidationService';
import type { Blueprint } from '../../lib/types/template';
import type { PodProvider } from '../../lib/types/pod';
import { cn } from '../../lib/utils';

interface BlueprintSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (blueprints: Blueprint[]) => void;
  selectedBlueprints?: Blueprint[];
  defaultProvider?: PodProvider;
}

interface BlueprintGroup {
  provider: PodProvider;
  blueprints: Blueprint[];
}

export function BlueprintSearchModal({
  isOpen,
  onClose,
  onSelect,
  selectedBlueprints = [],
  defaultProvider
}: BlueprintSearchModalProps) {
  const { currentShop } = useShop();
  const [loading, setLoading] = React.useState(true);
  const [search, setSearch] = React.useState('');
  const [selectedProvider, setSelectedProvider] = React.useState<PodProvider | undefined>(defaultProvider);
  const [blueprintGroups, setBlueprintGroups] = React.useState<BlueprintGroup[]>([]);
  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(selectedBlueprints.map(b => b.id))
  );
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({});
  const [usageStats, setUsageStats] = React.useState<any>(null);
  const [showFilters, setShowFilters] = React.useState(false);
  const [filters, setFilters] = React.useState({
    priceRange: { min: 0, max: 100 },
    printAreas: [] as string[],
    variants: [] as string[]
  });

  React.useEffect(() => {
    loadBlueprints();
  }, []);

  const loadBlueprints = async () => {
    setLoading(true);
    try {
      // In a real app, fetch from API
      const response = await fetch('/api/blueprints');
      const data = await response.json();
      
      // Group blueprints by provider
      const groups = data.reduce((acc: BlueprintGroup[], blueprint: Blueprint) => {
        const group = acc.find(g => g.provider === blueprint.provider);
        if (group) {
          group.blueprints.push(blueprint);
        } else {
          acc.push({
            provider: blueprint.provider,
            blueprints: [blueprint]
          });
        }
        return acc;
      }, []);

      setBlueprintGroups(groups);
      
      // Update usage stats
      if (currentShop?.settings?.tier) {
        const stats = blueprintValidationService.getUsageStats(
          selectedBlueprints,
          currentShop.settings.tier
        );
        setUsageStats(stats);
      }
    } catch (error) {
      console.error('Failed to load blueprints:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGroups = React.useMemo(() => {
    return blueprintGroups
      .map(group => ({
        ...group,
        blueprints: group.blueprints.filter(blueprint => {
          // Search filter
          if (search && !blueprint.title.toLowerCase().includes(search.toLowerCase())) {
            return false;
          }

          // Provider filter
          if (selectedProvider && blueprint.provider !== selectedProvider) {
            return false;
          }

          // Price range filter
          const price = blueprint.pricing.baseCost;
          if (price < filters.priceRange.min || price > filters.priceRange.max) {
            return false;
          }

          // Print areas filter
          if (filters.printAreas.length > 0) {
            const hasMatchingArea = blueprint.placeholders.some(p => 
              filters.printAreas.includes(p.name)
            );
            if (!hasMatchingArea) return false;
          }

          // Variants filter
          if (filters.variants.length > 0) {
            const hasMatchingVariant = blueprint.variants.some(v =>
              filters.variants.includes(v.title)
            );
            if (!hasMatchingVariant) return false;
          }

          return true;
        })
      }))
      .filter(group => group.blueprints.length > 0);
  }, [blueprintGroups, search, selectedProvider, filters]);

  const toggleBlueprint = (blueprint: Blueprint) => {
    if (!currentShop?.settings?.tier) return;

    if (selected.has(blueprint.id)) {
      // Remove blueprint
      const newSelected = new Set(selected);
      newSelected.delete(blueprint.id);
      setSelected(newSelected);
      
      // Clear validation error
      const newErrors = { ...validationErrors };
      delete newErrors[blueprint.id];
      setValidationErrors(newErrors);
    } else {
      // Validate addition
      const validation = blueprintValidationService.validateBlueprintAddition(
        blueprint,
        selectedBlueprints,
        currentShop.settings.tier
      );

      if (validation.isValid) {
        setSelected(new Set([...selected, blueprint.id]));
      } else {
        setValidationErrors({
          ...validationErrors,
          [blueprint.id]: validation.error || 'Invalid selection'
        });
      }
    }

    // Update usage stats
    const stats = blueprintValidationService.getUsageStats(
      [...selectedBlueprints, blueprint],
      currentShop.settings.tier
    );
    setUsageStats(stats);
  };

  const handleConfirm = () => {
    const selectedItems = blueprintGroups
      .flatMap(g => g.blueprints)
      .filter(b => selected.has(b.id));
    onSelect(selectedItems);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Search Blueprints"
      size="lg"
    >
      <div className="space-y-6">
        {/* Usage Stats */}
        {usageStats && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Plan Usage</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Blueprints</p>
                <div className="flex items-center mt-1">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        usageStats.blueprints.remaining === 0
                          ? "bg-red-500"
                          : usageStats.blueprints.remaining < 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      )}
                      style={{
                        width: usageStats.blueprints.total === -1
                          ? "0%"
                          : `${(usageStats.blueprints.used / usageStats.blueprints.total) * 100}%`
                      }}
                    />
                  </div>
                  <span className="ml-2 text-sm text-gray-600">
                    {usageStats.blueprints.total === -1
                      ? "Unlimited"
                      : `${usageStats.blueprints.used}/${usageStats.blueprints.total}`}
                  </span>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-600">Print Areas</p>
                <p className="mt-1 text-sm font-medium text-gray-900">
                  {usageStats.printAreas.max === -1
                    ? "Unlimited"
                    : `Max ${usageStats.printAreas.max} per blueprint`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Search and Filter */}
        <div className="flex space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search blueprints..."
              className="pl-10 w-full border-gray-300 rounded-md shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
          </div>
          
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              <Filter className="h-5 w-5 mr-2" />
              Filter
              <ChevronDown className={cn(
                "ml-2 h-4 w-4 transition-transform",
                showFilters && "transform rotate-180"
              )} />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-10">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Provider</label>
                    <select
                      value={selectedProvider || ''}
                      onChange={e => setSelectedProvider(e.target.value as PodProvider || undefined)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    >
                      <option value="">All Providers</option>
                      {blueprintGroups.map(group => (
                        <option key={group.provider} value={group.provider}>
                          {group.provider}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Price Range</label>
                    <div className="mt-1 grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        value={filters.priceRange.min}
                        onChange={e => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, min: Number(e.target.value) }
                        }))}
                        placeholder="Min"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                      <input
                        type="number"
                        value={filters.priceRange.max}
                        onChange={e => setFilters(prev => ({
                          ...prev,
                          priceRange: { ...prev.priceRange, max: Number(e.target.value) }
                        }))}
                        placeholder="Max"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Blueprint Grid */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="space-y-6">
            {filteredGroups.map(group => (
              <div key={group.provider}>
                <h3 className="text-lg font-medium text-gray-900 mb-4 capitalize">
                  {group.provider}
                </h3>
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
                  {group.blueprints.map(blueprint => (
                    <div
                      key={blueprint.id}
                      onClick={() => toggleBlueprint(blueprint)}
                      className={cn(
                        "relative cursor-pointer rounded-lg border p-4 hover:bg-gray-50",
                        selected.has(blueprint.id) && "border-indigo-500 bg-indigo-50"
                      )}
                    >
                      {selected.has(blueprint.id) && (
                        <div className="absolute top-2 right-2">
                          <Check className="h-5 w-5 text-indigo-600" />
                        </div>
                      )}
                      <div className="aspect-w-1 aspect-h-1 bg-gray-100 rounded-md overflow-hidden mb-3">
                        <Package className="h-8 w-8 text-gray-400 m-auto" />
                      </div>
                      {validationErrors[blueprint.id] && (
                        <div className="absolute inset-0 flex items-center justify-center bg-red-50 bg-opacity-90">
                          <div className="flex items-center text-red-600 p-2">
                            <AlertCircle className="h-4 w-4 mr-1" />
                            <p className="text-xs">{validationErrors[blueprint.id]}</p>
                          </div>
                        </div>
                      )}
                      <h4 className="text-sm font-medium text-gray-900 truncate">
                        {blueprint.title}
                      </h4>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-xs text-gray-500">
                          {blueprint.variants.length} variants
                        </p>
                        <p className="text-xs font-medium text-gray-900">
                          ${blueprint.pricing.baseCost}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {filteredGroups.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No blueprints found</p>
              </div>
            )}
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
            Add {selected.size} Blueprint{selected.size !== 1 ? 's' : ''}
          </button>
        </div>
      </div>
    </Modal>
  );
}