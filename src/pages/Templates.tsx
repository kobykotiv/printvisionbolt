import React from 'react';
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
  Tags
} from 'lucide-react';
import { TemplateForm } from '../components/templates/TemplateForm';
import { TemplateEditModal } from '../components/templates/TemplateEditModal';
import type { Template, TemplateWithStats } from '../lib/types/template';
import type { Design } from '../lib/types/design';
import { TEST_MODE } from '../lib/test-mode';
import { supabase } from '../lib/supabase';

interface FilterState {
  status: 'all' | 'active' | 'draft' | 'archived';
  dateRange: 'all' | 'today' | 'week' | 'month';
  tags: string[];
}

export function Templates() {
  const [templates, setTemplates] = React.useState<TemplateWithStats[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);
  const [showEditModal, setShowEditModal] = React.useState(false);
  const [showFilters, setShowFilters] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filters, setFilters] = React.useState<FilterState>({
    status: 'all',
    dateRange: 'all',
    tags: []
  });
  
  // Collect all unique tags from templates
  const availableTags = React.useMemo(() => {
    const tags = new Set<string>();
    templates.forEach(template => {
      template.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [templates]);

  const [selectedTemplate, setSelectedTemplate] = React.useState<TemplateWithStats | null>(null);
  const [connectedDesigns, setConnectedDesigns] = React.useState<Design[]>([]);

  React.useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTemplates(MOCK_TEMPLATES);
        return;
      }

      const response = await fetch('/api/templates');
      const data = await response.json();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = async (template: TemplateWithStats) => {
    setSelectedTemplate(template);
    try {
      if (TEST_MODE) {
        setConnectedDesigns([{
          id: 'design-1',
          name: 'Test Design 1',
          description: 'Test design 1',
          thumbnailUrl: 'https://placehold.co/300x300',
          category: 'Test',
          tags: ['test'],
          metadata: {
            width: 300,
            height: 300,
            format: 'PNG',
            fileSize: 1024,
            dpi: 72,
            colorSpace: 'RGB',
            hasTransparency: true
          },
          status: 'active',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }]);
      } else {
        const { data, error } = await supabase
          .from('template_designs')
          .select('design:designs(*)')
          .eq('template_id', template.id) as { data: Array<{ design: Design }> | null; error: Error | null };

        if (error) throw error;
        setConnectedDesigns((data || []).map(td => td.design));
      }
      setShowEditModal(true);
    } catch (error) {
      console.error('Error fetching connected designs:', error);
    }
  };

  const handleSave = async (template: Template) => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTemplates(prev => [...prev, { 
          ...template, 
          productCount: 0, 
          designCount: 0,
          syncStats: { pendingDesigns: 0, errorDesigns: 0, averageProcessingTime: 0 }
        }]);
        setShowForm(false);
        return;
      }

      const response = await fetch('/api/templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template)
      });

      const savedTemplate = await response.json();
      setTemplates(prev => [...prev, savedTemplate]);
      setShowForm(false);
    } catch (error) {
      console.error('Error saving template:', error);
    }
  };

  const handleSaveEdit = async (updatedTemplate: Template) => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTemplates(prev => prev.map(t => 
          t.id === updatedTemplate.id ? { ...t, ...updatedTemplate } : t
        ));
        return;
      }

      const { error } = await supabase
        .from('templates')
        .update({
          title: updatedTemplate.title,
          description: updatedTemplate.description,
          status: updatedTemplate.status,
          tags: updatedTemplate.tags,
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedTemplate.id);

      if (error) throw error;

      // Refresh templates after update
      await loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  // Filter and search logic
  const filteredTemplates = React.useMemo(() => {
    return templates.filter(template => {
      // Search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesSearch = 
          template.title.toLowerCase().includes(query) ||
          template.description?.toLowerCase().includes(query) ||
          template.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status !== 'all' && template.status !== filters.status) {
        return false;
      }

      // Date range filter
      if (filters.dateRange !== 'all') {
        const date = new Date(template.createdAt);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

        switch (filters.dateRange) {
          case 'today':
            if (daysDiff > 0) return false;
            break;
          case 'week':
            if (daysDiff > 7) return false;
            break;
          case 'month':
            if (daysDiff > 30) return false;
            break;
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasAllTags = filters.tags.every(tag =>
          template.tags.includes(tag)
        );
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [templates, searchQuery, filters]);

  // Click outside handler for filter dropdown
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest('[data-filter-dropdown]')) {
        setShowFilters(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
        <button
          onClick={() => setShowForm(true)}
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
        
        {/* Filter Dropdown */}
        <div className="relative" data-filter-dropdown>
          <button 
            onClick={() => setShowFilters(!showFilters)}
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

          {showFilters && (
            <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
              <div className="p-4 space-y-4">
                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="space-y-2">
                    {['all', 'active', 'draft', 'archived'].map((status) => (
                      <button
                        key={status}
                        onClick={() => setFilters(f => ({ ...f, status: status as FilterState['status'] }))}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.status === status
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Check 
                          className={`inline h-4 w-4 mr-2 ${
                            filters.status === status ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Date Range Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Range
                  </label>
                  <div className="space-y-2">
                    {[
                      { value: 'all', label: 'All Time', icon: CalendarRange },
                      { value: 'today', label: 'Today', icon: Clock },
                      { value: 'week', label: 'Past Week', icon: CalendarRange },
                      { value: 'month', label: 'Past Month', icon: CalendarRange }
                    ].map(({ value, label, icon: Icon }) => (
                      <button
                        key={value}
                        onClick={() => setFilters(f => ({ ...f, dateRange: value as FilterState['dateRange'] }))}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.dateRange === value
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Icon className="inline h-4 w-4 mr-2" />
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tags Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tags
                  </label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {availableTags.map((tag) => (
                      <button
                        key={tag}
                        onClick={() => setFilters(f => ({
                          ...f,
                          tags: f.tags.includes(tag)
                            ? f.tags.filter(t => t !== tag)
                            : [...f.tags, tag]
                        }))}
                        className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                          filters.tags.includes(tag)
                            ? 'bg-indigo-50 text-indigo-700'
                            : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Tags className="inline h-4 w-4 mr-2" />
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin text-indigo-600 mx-auto" />
            <p className="mt-2 text-sm text-gray-500">Loading templates...</p>
          </div>
        </div>
      ) : templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates found. Create your first template to get started.</p>
        </div>
      ) : filteredTemplates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No templates match your search criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="relative group bg-white rounded-lg shadow overflow-hidden"
            >
              {/* Edit Button */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <button
                  onClick={() => handleEditClick(template)}
                  className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50"
                  title="Edit Template"
                >
                  <Edit className="h-4 w-4 text-gray-600" />
                </button>
              </div>

              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">
                  {template.title}
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  {template.description}
                </p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <div className="text-gray-500">
                    {template.productCount} products
                  </div>
                  <div className="text-gray-500">
                    {template.designCount} designs
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {template.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="bg-white shadow rounded-lg p-6">
          <TemplateForm onSave={handleSave} />
        </div>
      )}

      {selectedTemplate && (
        <TemplateEditModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          template={selectedTemplate}
          onSave={handleSaveEdit}
          connectedDesigns={connectedDesigns}
        />
      )}
    </div>
  );
}

const MOCK_TEMPLATES: TemplateWithStats[] = [
  {
    id: 'template-1',
    title: 'Summer Collection',
    description: 'T-shirts and hoodies for summer',
    designs: [],
    blueprints: [],
    tags: ['summer', 'casual'],
    status: 'active',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    productCount: 12,
    designCount: 5,
    syncStats: {
      pendingDesigns: 0,
      errorDesigns: 0,
      averageProcessingTime: 0
    }
  }
];
