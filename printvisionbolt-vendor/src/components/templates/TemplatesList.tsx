import React from 'react';
import { Plus, Settings } from 'lucide-react';
import { Template } from '../../types/pod';
import Button from '../ui/Button';
import { Card } from '../ui/Card';

interface TemplatesListProps {
  templates: Template[];
  onCreateTemplate: () => void;
  onEditTemplate: (template: Template) => void;
}

export function TemplatesList({ templates, onCreateTemplate, onEditTemplate }: TemplatesListProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Templates</h2>
        <Button onClick={onCreateTemplate}>
          <Plus className="w-4 h-4 mr-2" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="p-4">
            <div className="aspect-square mb-4 relative rounded-lg overflow-hidden bg-gray-100">
              {template.mockupUrls[0] && (
                <img
                  src={template.mockupUrls[0]}
                  alt={template.name}
                  className="object-cover w-full h-full"
                />
              )}
            </div>
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium">{template.name}</h3>
                <p className="text-sm text-gray-500">
                  {template.blueprint.supplier} • {template.variants.length} variants
                </p>
              </div>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onEditTemplate(template)}
              >
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
