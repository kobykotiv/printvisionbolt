import { useState, useCallback } from 'react';
import { Grid, Group, Stack, Button } from '@mantine/core';
import { IconUpload, IconTableExport } from '@tabler/icons-react';
import { DesignGrid } from '@/components/designs/DesignGrid';
import { DesignFilters } from '@/components/designs/DesignFilters';
import { BulkActionBar } from '@/components/common/BulkActionBar';
import { UploadModal } from '@/components/designs/UploadModal';
import { useDesigns } from '@/hooks/useDesigns';
import type { Design } from '@/types/models';

export default function DesignsPage() {
  const [selectedDesigns, setSelectedDesigns] = useState<string[]>([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const { designs, loading, filters, setFilters, refresh } = useDesigns();

  const bulkActions = [
    {
      label: 'Add to Collection',
      onClick: () => {/* Implement collection assignment */}
    },
    {
      label: 'Export Selected',
      onClick: () => {/* Implement export */},
      icon: <IconTableExport size={16} />
    },
    {
      label: 'Delete Selected',
      color: 'red',
      onClick: () => {/* Implement bulk delete */}
    }
  ];

  return (
    <Stack spacing="lg">
      <Group position="apart">
        <h1>Designs</h1>
        <Group>
          <Button 
            leftIcon={<IconUpload size={16} />}
            onClick={() => setUploadModalOpen(true)}
          >
            Upload Designs
          </Button>
        </Group>
      </Group>

      <DesignFilters
        filters={filters}
        onChange={setFilters}
      />

      <BulkActionBar
        selectedCount={selectedDesigns.length}
        actions={bulkActions}
      />

      <DesignGrid
        designs={designs}
        loading={loading}
        selectedDesigns={selectedDesigns}
        onSelectionChange={setSelectedDesigns}
      />

      <UploadModal
        opened={uploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
        onComplete={refresh}
      />
    </Stack>
  );
}
