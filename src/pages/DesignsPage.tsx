import React from 'react';
import { DesignsGrid } from '../components/designs/DesignsGrid';
import { useDesigns } from '../hooks/useDesigns';

export function DesignsPage() {
  const { designs, createDesign, updateDesign, deleteDesigns, bulkAddToCollection } = useDesigns();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Designs</h1>
      <DesignsGrid
        designs={designs}
        onEdit={(design) => {/* handle edit */}}
        onDelete={deleteDesigns}
        onUpload={() => {/* handle upload */}}
        onBulkAddToCollection={bulkAddToCollection}
      />
    </div>
  );
}
