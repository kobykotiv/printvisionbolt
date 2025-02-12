import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, RefreshCw } from 'lucide-react';
import { templateService } from '../../lib/services/templateService';
import type { Template, TemplateSyncState } from '../../lib/types/template';
import { LoadingSpinner } from '../ui/LoadingSpinner';
import { LoadingError } from '../ui/LoadingError';
import { cn } from '../../lib/utils';

interface TemplateListProps {
  onTemplateSelect?: (template: Template) => void;
}

export function TemplateList({ onTemplateSelect }: TemplateListProps) {
  const navigate = useNavigate();
  const [templates, setTemplates] = React.useState<Template[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [syncingTemplates, setSyncingTemplates] = React.useState(new Set<string>());

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await templateService.listTemplates();
      setTemplates(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async (templateId: string) => {
    try {
      setSyncingTemplates(prev => new Set([...prev, templateId]));
      await templateService.syncTemplate(templateId);
      
      // Poll for sync status
      const interval = setInterval(async () => {
        const status = await templateService.getTemplateSyncStatus(templateId);
        if (status.status !== 'syncing') {
          clearInterval(interval);
          setSyncingTemplates(prev => {
            const next = new Set(prev);
            next.delete(templateId);
            return next;
          });
          await loadTemplates(); // Refresh list after sync
        }
      }, 2000);
    } catch (err) {
      setSyncingTemplates(prev => {
        const next = new Set(prev);
        next.delete(templateId);
        return next;
      });
      console.error('Sync error:', err);
    }
  };

  const handleDelete = async (templateId: string) => {
    if (!window.confirm('Are you sure you want to delete this template?')) return;

    try {
      await templateService.deleteTemplate(templateId);
      await loadTemplates();
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <LoadingError
        message={error}
        onRetry={loadTemplates}
      />
    );
  }

  const getSyncStatusColor = (status: TemplateSyncState['status']) => {
    switch (status) {
      case 'syncing':
        return 'text-blue-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-green-500';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Templates</h2>
        <button
          onClick={() => navigate('/templates/new')}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          New Template
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden rounded-md">
        <ul className="divide-y divide-gray-200">
          {templates.map((template) => (
            <li
              key={template.id}
              className="hover:bg-gray-50 transition-colors"
            >
              <div className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => onTemplateSelect?.(template)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {template.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {template.description || 'No description'}
                    </p>
                    <div className="mt-2 flex items-center space-x-4 text-sm">
                      <span className="text-gray-500">
                        {template.designs?.length || 0} designs
                      </span>
                      <span className="text-gray-500">
                        {template.blueprints?.length || 0} blueprints
                      </span>
                      <span 
                        className={cn(
                          "capitalize",
                          getSyncStatusColor(template.syncState?.status || 'idle')
                        )}
                      >
                        {template.syncState?.status || 'Not synced'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <button
                      onClick={() => handleSync(template.id)}
                      disabled={syncingTemplates.has(template.id)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <RefreshCw 
                        className={cn(
                          "h-5 w-5",
                          syncingTemplates.has(template.id) && "animate-spin"
                        )} 
                      />
                    </button>
                    <button
                      onClick={() => navigate(`/templates/${template.id}/edit`)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(template.id)}
                      className="text-red-400 hover:text-red-500"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </li>
          ))}

          {templates.length === 0 && (
            <li className="px-6 py-12">
              <div className="text-center">
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No templates
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Get started by creating a new template.
                </p>
                <div className="mt-6">
                  <button
                    onClick={() => navigate('/templates/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    New Template
                  </button>
                </div>
              </div>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}