import React from 'react';
import { Plus, Search, Filter } from 'lucide-react';
import { TemplateForm } from '../components/templates/TemplateForm';
import type { Template, TemplateWithStats } from '../lib/types/template';
import { TEST_MODE } from '../lib/test-mode';

const MOCK_TEMPLATES: TemplateWithStats[] = [
  {
    id: 'template-1',
    title: 'Summer Collection',
    description: 'T-shirts and hoodies for summer',
    blueprints: [],
    tags: ['summer', 'casual'],
    status: 'active',
    createdAt: '2024-02-20T00:00:00Z',
    updatedAt: '2024-02-20T00:00:00Z',
    productCount: 12,
    designCount: 5,
    lastSync: {
      date: '2024-02-20T12:00:00Z',
      status: 'success'
    }
  }
];

export function Templates() {
  const [templates, setTemplates] = React.useState<TemplateWithStats[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showForm, setShowForm] = React.useState(false);

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

  const handleSave = async (template: Template) => {
    try {
      if (TEST_MODE) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setTemplates(prev => [...prev, { ...template, productCount: 0, designCount: 0 }]);
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

      {showForm ? (
        <div className="bg-white shadow rounded-lg p-6">
          <TemplateForm onSave={handleSave} />
        </div>
      ) : (
        <>
          <div className="mb-6 flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search templates..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
              <Filter className="h-5 w-5 mr-2" />
              Filter
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {templates.map((template) => (
              <div
                key={template.id}
                className="bg-white rounded-lg shadow overflow-hidden"
              >
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
        </>
      )}
    </div>
  );
}