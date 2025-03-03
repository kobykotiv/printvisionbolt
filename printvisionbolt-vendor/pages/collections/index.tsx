import { useState } from 'react';
import { Grid, Group, Stack, Button, Card } from '@mantine/core';
import { IconFolderPlus, IconLayoutGrid, IconList } from '@tabler/icons-react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { CollectionTree } from '@/components/collections/CollectionTree';
import { CollectionGrid } from '@/components/collections/CollectionGrid';
import { NewCollectionModal } from '@/components/collections/NewCollectionModal';
import { useCollections } from '@/hooks/useCollections';
import type { Collection } from '@/types/models';

export default function CollectionsPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const { collections, loading, refresh } = useCollections();

  const handleDrop = async (sourceId: string, targetId: string) => {
    // Implement collection move logic
    await collectionsService.moveCollection({ sourceId, targetId });
    refresh();
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <Stack spacing="lg">
        <Group position="apart">
          <h1>Collections</h1>
          <Group>
            <Button.Group>
              <Button
                variant={viewMode === 'grid' ? 'filled' : 'light'}
                onClick={() => setViewMode('grid')}
              >
                <IconLayoutGrid size={16} />
              </Button>
              <Button
                variant={viewMode === 'tree' ? 'filled' : 'light'}
                onClick={() => setViewMode('tree')}
              >
                <IconList size={16} />
              </Button>
            </Button.Group>
            <Button
              leftIcon={<IconFolderPlus size={16} />}
              onClick={() => setCreateModalOpen(true)}
            >
              New Collection
            </Button>
          </Group>
        </Group>

        <Card>
          {viewMode === 'grid' ? (
            <CollectionGrid
              collections={collections}
              loading={loading}
              onSelect={setSelectedCollection}
              onDrop={handleDrop}
            />
          ) : (
            <CollectionTree
              collections={collections}
              loading={loading}
              selectedId={selectedCollection?.id}
              onSelect={setSelectedCollection}
              onDrop={handleDrop}
            />
          )}
        </Card>

        <NewCollectionModal
          opened={createModalOpen}
          onClose={() => setCreateModalOpen(false)}
          onCreated={refresh}
          parentCollection={selectedCollection}
        />
      </Stack>
    </DndProvider>
  );
}
