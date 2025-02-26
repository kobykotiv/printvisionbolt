import React from 'react';
import { TemplateWithStats } from '../../lib/types/template';
import { Edit, Copy, Eye, Trash2 } from 'lucide-react';

interface Props {
  template: TemplateWithStats;
  onEdit: (template: TemplateWithStats) => void;
  onDuplicate: (template: TemplateWithStats) => void;
  onView: (template: TemplateWithStats) => void;
  onDelete: (template: TemplateWithStats) => void;
}

export function TemplateCard({
  template,
  onEdit,
  onDuplicate,
  onView,
  onDelete
}: Props) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{template.title}</h3>
        <p className="text-sm text-gray-500">{template.description}</p>
        <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
          <span>{template.designCount} Designs</span>
          <span>{template.productCount} Products</span>
        </div>
      </div>
      <div className="bg-gray-50 px-4 py-3 flex justify-end gap-2">
        <button
          onClick={() => onView(template)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <Eye className="h-4 w-4" />
        </button>
        <button
          onClick={() => onEdit(template)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDuplicate(template)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <Copy className="h-4 w-4" />
        </button>
        <button
          onClick={() => onDelete(template)}
          className="p-2 hover:bg-gray-100 rounded-md"
        >
          <Trash2 className="h-4 w-4 text-red-600" />
        </button>
      </div>
    </div>
  );
}
