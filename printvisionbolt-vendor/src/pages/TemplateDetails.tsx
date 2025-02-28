import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Upload, RefreshCw } from 'lucide-react';
import { templateService } from '../lib/services/templateService';
import type { Template, TemplateDesign } from '../lib/types/template';
import { BlueprintSelectorModal } from '../components/templates/BlueprintSelectorModal';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { LoadingError } from '../components/ui/LoadingError';
import { DesignUploader } from '../components/designs/DesignUploader';
import { cn } from '../lib/utils';

export function TemplateDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [template, setTemplate] = React.useState<Template | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showBlueprintModal, setShowBlueprintModal] = React.useState(false);
  const [showDesignUploader, setShowDesignUploader] = React.useState(false);

  React.useEffect(() => {
    if (id) {
      loadTemplate();
    }
  }, [id]);

  const loadTemplate = async () => {
    if (!id) return;
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.getTemplate(id);
      setTemplate(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleSyncTemplate = async () => {
    if (!template) return;
    try {
      setIsSyncing(true);
      await templateService.syncTemplate(template.id);
      
      // Poll for sync completion
      const interval = setInterval(async () => {
        const status = await templateService.getTemplateSyncStatus(template.id);
        if (status.status !== 'syncing') {
          clearInterval(interval);
          setIsSyncing(false);
          await loadTemplate();
        }
      }, 2000);
    } catch (err) {
      setIsSyncing(false);
      console.error('Sync error:', err);
    }
  };

  const handleAddDesigns = async (designs: Array<Partial<TemplateDesign>>) => {
    if (!template) return;
    try {
      await templateService.addDesignsToTemplate(template.id, designs);
      await loadTemplate();
      setShowDesignUploader(false);
    } catch (err) {
      console.error('Error adding designs:', err);
    }
  };

  const handleUpdateDesignMapping = async (design: TemplateDesign) => {
    if (!template) return;
    try {
      await templateService.updateTemplate(template.id, {
        ...template,
        designs: template.designs.map(d => 
          d.id === design.id ? design : d
        )
      });
      await loadTemplate();
    } catch (err) {
      console.error('Error updating design mapping:', err);
    }
  };

  const handleRemoveDesign = async (designId: string) => {
    if (!template) return;
    if (!window.confirm('Are you sure you want to remove this design?')) return;

    try {
      await templateService.updateTemplate(template.id, {
        ...template,
        designs: template.designs.filter(d => d.id !== designId)
      });
      await loadTemplate();
    } catch (err) {
      console.error('Error removing design:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !template) {
    return (
      <LoadingError
        message={error || 'Template not found'}
        onRetry={loadTemplate}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <button
              onClick={() => navigate('/templates')}
              className="mr-4 text-gray-400 hover:text-gray-500"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{template.title}</h1>
              <p className="mt-1 text-sm text-gray-500">{template.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleSyncTemplate}
              disabled={isSyncing}
              className={cn(
                "inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md",
                isSyncing
                  ? "bg-gray-300 cursor-not-allowed"
                  : "text-white bg-indigo-600 hover:bg-indigo-700"
              )}
            >
              <RefreshCw className={cn("h-4 w-4 mr-2", isSyncing && "animate-spin")} />
              {isSyncing ? 'Syncing...' : 'Sync Template'}
            </button>
          </div>
        </div>

        {/* Sync Status */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">Sync Status</h2>
          <div className="grid grid-cols-4 gap-4">
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Status</p>
              <p className={cn(
                "mt-1 font-medium capitalize",
                template.syncState?.status === 'error' && "text-red-600",
                template.syncState?.status === 'syncing' && "text-blue-600",
                template.syncState?.status === 'idle' && "text-green-600"
              )}>
                {template.syncState?.status || 'Not synced'}
              </p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Last Sync</p>
              <p className="mt-1 font-medium">
                {template.syncState?.lastSyncAt 
                  ? new Date(template.syncState.lastSyncAt).toLocaleString()
                  : 'Never'}
              </p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Designs</p>
              <p className="mt-1 font-medium">{template.designs.length}</p>
            </div>
            <div className="border rounded-md p-4">
              <p className="text-sm text-gray-500">Blueprints</p>
              <p className="mt-1 font-medium">{template.blueprints.length}</p>
            </div>
          </div>
        </div>

        {/* Designs */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-gray-900">Designs</h2>
            <button
              onClick={() => setShowDesignUploader(true)}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              <Upload className="h-4 w-4 mr-2" />
              Add Designs
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {template.designs.map((design) => (
              <div key={design.id} className="relative group">
                <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
                  <img
                    src={design.thumbnailUrl || ''}
                    alt={design.name || 'Design thumbnail'}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-opacity" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleRemoveDesign(design.id)}
                      className="p-2 text-white hover:text-red-500"
                    >
                      <Trash2 className="h-6 w-6" />
                    </button>
                  </div>
                </div>
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {design.name || 'Untitled Design'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {design.placeholders?.length || 0} placements
                  </p>
                </div>
              </div>
            ))}
          </div>

          {template.designs.length === 0 && (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-gray-500">No designs added yet</p>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <BlueprintSelectorModal
        isOpen={showBlueprintModal}
        onClose={() => setShowBlueprintModal(false)}
        onSelect={(blueprints) => {
          if (!template) return;
          templateService.updateTemplate(template.id, {
            ...template,
            blueprints: [...template.blueprints, ...blueprints]
          });
          setShowBlueprintModal(false);
          loadTemplate();
        }}
      />

      {showDesignUploader && (
        <DesignUploader
          onClose={() => setShowDesignUploader(false)}
          onUploadComplete={handleAddDesigns}
          allowedTypes={['image/png', 'image/jpeg']}
          maxFileSize={5 * 1024 * 1024} // 5MB
        />
      )}
    </div>
  );
}