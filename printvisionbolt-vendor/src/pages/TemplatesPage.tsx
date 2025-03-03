import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Edit,
  Loader2,
  Check,
  ChevronDown,
  CalendarRange,
  Clock,
  Package
} from 'lucide-react';
import { TemplateForm } from '../components/templates/TemplateForm';
import { TemplateCard } from '../components/templates/TemplateCard';
import type { TemplateWithStats } from '../lib/types/template';
import { useTemplates } from '../hooks/useTemplates';
import { Modal } from '../components/ui/Modal';
import { cn } from '../lib/utils';

export function TemplatesPage() {
  const {
    templates,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    isLoading,
    error
  } = useTemplates();

  const [showForm, setShowForm] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<TemplateWithStats | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    status: 'all',
    dateRange: 'all',
    tags: []
  });

  const handleCreate = () => {
    setEditingTemplate(null);
    setShowForm(true);
  };

  const handleEdit = (template: TemplateWithStats) => {
    setEditingTemplate(template);
    setShowForm(true);
  };

  const handleSave = async (data: any) => {
    if (editingTemplate) {
      await updateTemplate(editingTemplate.id, data);
    } else {
      await createTemplate(data);
    }
    setShowForm(false);
  };

  const handleDelete = async (template: TemplateWithStats) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      await deleteTemplate(template.id);
    }
  };

  const handleDuplicate = (template: TemplateWithStats) => {
    // Implement duplicate logic
    console.log('Duplicate template:', template);
  };

  const handleView = (template: TemplateWithStats) => {
    // Implement view logic
    console.log('View template:', template);
  };

  const filteredTemplates = React.useMemo(() => {
    return templates.filter(template => {
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch =
          template.title.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query));

        if (!matchesSearch) return false;
      }

      if (filters.status !== 'all' && template.status !== filters.status) {
        return false;
      }

      return true;
    });
  }, [templates, searchQuery, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
        <p className="mt-2 text-sm text-gray-500">Loading templates...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500">Error: {error.message}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <button
          onClick={handleCreate}
          className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Template
        </button>
      </div>

      <div className="mb-6 flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search templates..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="relative" data-filter-dropdown>
          <button
            onClick={() => setShowForm(!showForm)}
            className={`inline-flex items-center px-4 py-2 border shadow-sm text-sm font-medium rounded-md ${
              Object.values(filters).some(v => Array.isArray(v) ? v.length > 0 : v !== 'all')
                ? 'border-indigo-500 text-indigo-700 bg-indigo-50 hover:bg-indigo-100'
                : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filter
            <ChevronDown className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {templates.length === 0 ? (
          <div className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No templates</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new template.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="h-5 w-5 mr-2" />
                New Template
              </button>
            </div>
          </div>
        ) : (
          filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onView={handleView}
            />
          ))
        )}
      </div>

      {showForm && (
        <Modal onClose={() => setShowForm(false)}>
          <TemplateForm
            initialData={editingTemplate}
            onSave={handleSave}
            onCancel={() => setShowForm(false)}
          />
        </Modal>
      )}
    </div>
  );
}
