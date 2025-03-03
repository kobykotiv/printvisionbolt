import { useState } from 'react';
import { Grid, Group, Stack, Button, TextInput } from '@mantine/core';
import { IconPlus, IconSearch } from '@tabler/icons-react';
import { TemplateGrid } from '@/components/templates/TemplateGrid';
import { BulkActionBar } from '@/components/common/BulkActionBar';
import { NewTemplateModal } from '@/components/templates/NewTemplateModal';
import { useTemplates } from '@/hooks/useTemplates';
import type { Template } from '@/types/models';

export default function TemplatesPage() {
  const [search, setSearch] = useState('');
  const [selectedTemplates, setSelectedTemplates] = useState<string[]>([]);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { templates, loading, refresh } = useTemplates({ search });

  const bulkActions = [
    {
      label: 'Sync Selected',
      onClick: async () => {
        // Implement bulk sync
        await Promise.all(
          selectedTemplates.map(id => templateService.syncTemplate(id))
        );
        refresh();
      }
    },
    {
      label: 'Archive Selected',
      onClick: async () => {
        // Implement bulk archive
        await templateService.bulkUpdate(selectedTemplates, { status: 'archived' });
        refresh();
      }
    },
    {
      label: 'Delete Selected',
      color: 'red',
      onClick: async () => {
        // Implement bulk delete
        if (confirm('Are you sure you want to delete these templates?')) {
          await Promise.all(
            selectedTemplates.map(id => templateService.deleteTemplate(id))
          );
          refresh();
        }
      }
    }
  ];

  return (
    <Stack spacing="lg">
      <Group position="apart">
        <h1>Templates</h1>
        <Button
          leftIcon={<IconPlus size={16} />}
          onClick={() => setCreateModalOpen(true)}
        >
          New Template
        </Button>
      </Group>

      <Group>
        <TextInput
          icon={<IconSearch size={16} />}
          placeholder="Search templates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ width: 300 }}
        />
      </Group>

      <BulkActionBar
        selectedCount={selectedTemplates.length}
        actions={bulkActions}
      />

      <TemplateGrid
        templates={templates}
        loading={loading}
        selectedTemplates={selectedTemplates}
        onSelectionChange={setSelectedTemplates}
      />

      <NewTemplateModal
        opened={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreated={refresh}
      />
    </Stack>
  );
}
