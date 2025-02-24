import React, { useState } from 'react';
import { useBlueprints } from '../../../src/features/blueprints/hooks/useBlueprints';
import { useDebugMode } from '../../../src/features/blueprints/hooks/useDebugMode';
import { BlueprintDetails } from '../../../src/features/blueprints/components/BlueprintDetails';
import { MonitoringDialog } from '../../../src/features/blueprints/components/MonitoringDialog';
import { BlueprintBreadcrumbs } from '../../../src/features/blueprints/components/BlueprintBreadcrumbs';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import { Card } from '../../../components/ui/Card';
import { Blueprint } from '../../../src/features/blueprints/types/blueprint';
import { PROVIDER_CONFIGS } from '../../../src/features/blueprints/config/providers';

const BlueprintsPage: React.FC = () => {
  const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
  const [selectedBlueprint, setSelectedBlueprint] = useState<Blueprint | null>(null);
  const [isMonitoringOpen, setIsMonitoringOpen] = useState(false);
  const { isDebugMode, toggleDebugMode } = useDebugMode();
  
  const {
    blueprints,
    isLoading,
    error,
    totalResults,
    hasNextPage,
    loadNextPage,
    updateSearch,
    availableProviders,
    isProviderEnabled,
    loadBlueprintDetails,
    isInitialized
  } = useBlueprints({
    providerId: selectedProvider ?? undefined,
    autoLoad: true,
    initialSearch: {
      limit: 12,
      sortBy: 'updatedAt',
      sortOrder: 'desc'
    }
  });

  const handleSearch = (query: string) => {
    updateSearch({ query });
  };

  const handleProviderSelect = (providerId: string) => {
    setSelectedProvider(providerId === selectedProvider ? null : providerId);
  };

  const handleViewDetails = async (blueprint: Blueprint) => {
    try {
      const details = await loadBlueprintDetails(blueprint.id, blueprint.providerId);
      setSelectedBlueprint(details);
    } catch (error) {
      console.error('Failed to load blueprint details:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h3 className="text-red-800 font-medium">Error loading blueprints</h3>
          <p className="text-red-600">{error.message}</p>
          <Button
            label="Try Again"
            variant="primary"
            onClick={() => updateSearch({})}
            className="mt-2"
          />
        </div>
      </div>
    );
  }

  const breadcrumbItems = [
    { label: 'App', href: '/app' },
    { label: selectedProvider || 'All Providers' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="px-6 py-4">
          <BlueprintBreadcrumbs items={breadcrumbItems} className="mb-4" />
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Print Blueprints</h1>
              <p className="text-sm text-gray-500 mt-1">
                Manage and monitor your print-on-demand product templates
              </p>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                label={isDebugMode ? "Disable Debug" : "Enable Debug"}
                onClick={toggleDebugMode}
                className={`flex items-center gap-2 ${isDebugMode ? 'bg-blue-50' : ''}`}
              >
                <svg 
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                  />
                </svg>
                {isDebugMode ? 'Debug Mode' : 'Debug'}
              </Button>

              <Button
                variant="outline"
                size="sm"
                label="View Monitoring"
                onClick={() => setIsMonitoringOpen(true)}
                className="flex items-center gap-2"
              >
                <svg 
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
                Monitor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Provider Selection */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-3">Print Providers</h2>
          <div className="flex gap-3">
            {Object.keys(PROVIDER_CONFIGS).map((providerId) => {
              const isEnabled = isProviderEnabled(providerId);
              const isAvailable = availableProviders.get(providerId) ?? false;

              return (
                <Button
                  key={providerId}
                  label={PROVIDER_CONFIGS[providerId].name}
                  variant={selectedProvider === providerId ? 'primary' : 'outline'}
                  onClick={() => handleProviderSelect(providerId)}
                  className={!isEnabled || !isAvailable ? 'opacity-50 cursor-not-allowed' : ''}
                  disabled={!isEnabled || !isAvailable}
                />
              );
            })}
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex justify-between items-center mb-6">
          <div className="w-96">
            <Input
              type="text"
              placeholder="Search blueprints..."
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex gap-2">
            <Button
              label="Sort by Latest"
              variant="outline"
              onClick={() => updateSearch({ sortBy: 'updatedAt', sortOrder: 'desc' })}
            />
            <Button
              label="Sort by Name"
              variant="outline"
              onClick={() => updateSearch({ sortBy: 'name', sortOrder: 'asc' })}
            />
          </div>
        </div>

        {/* Results Count */}
        <div className="text-sm text-gray-500 mb-4">
          {totalResults} blueprints found
        </div>

        {/* Blueprints Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {blueprints.map((blueprint) => (
            <Card
              key={`${blueprint.providerId}-${blueprint.id}`}
              className="p-4"
              hoverable
              shadow="sm"
            >
              <div className="aspect-w-1 aspect-h-1 mb-4">
                {blueprint.images[0] ? (
                  <img
                    src={blueprint.images[0].url}
                    alt={blueprint.name}
                    className="w-full h-full object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400">No preview</span>
                  </div>
                )}
              </div>
              
              <h3 className="text-lg font-semibold mb-2">{blueprint.name}</h3>
              <p className="text-gray-600 text-sm mb-4">{blueprint.description}</p>
              
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">
                  {blueprint.variants.length} variants
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  label="View Details"
                  onClick={() => handleViewDetails(blueprint)}
                />
              </div>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {hasNextPage && (
          <div className="mt-8 text-center">
            <Button
              label={isLoading ? 'Loading...' : 'Load More'}
              variant="outline"
              onClick={loadNextPage}
              disabled={isLoading}
            />
          </div>
        )}

        {/* Loading State */}
        {isLoading && blueprints.length === 0 && (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        )}
      </div>

      {/* Blueprint Details Modal */}
      {selectedBlueprint && (
        <BlueprintDetails
          blueprint={selectedBlueprint}
          isOpen={!!selectedBlueprint}
          onClose={() => setSelectedBlueprint(null)}
        />
      )}

      {/* Monitoring Dialog */}
      <MonitoringDialog
        isOpen={isMonitoringOpen}
        onClose={() => setIsMonitoringOpen(false)}
      />
    </div>
  );
};

export default BlueprintsPage;