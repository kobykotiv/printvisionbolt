import { useMemo } from 'react';
import { Text, Group, ActionIcon, Loader } from '@mantine/core';
import { IconFolder, IconFolderOpen, IconDragDrop } from '@tabler/icons-react';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import type { Collection } from '@/types/models';

interface CollectionTreeProps {
  collections: Collection[];
  isLoading?: boolean;
  onDrop: (dragId: string, dropId: string) => Promise<void>;
}

export function CollectionTree({ collections, isLoading, onDrop }: CollectionTreeProps) {
  const tree = useMemo(() => buildCollectionTree(collections), [collections]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <DndProvider backend={HTML5Backend}>
      <TreeNode nodes={tree} level={0} onDrop={onDrop} />
    </DndProvider>
  );
}

function TreeNode({ nodes, level, onDrop }) {
  return (
    <div style={{ paddingLeft: level * 20 }}>
      {nodes.map(node => (
        <CollectionItem
          key={node.id}
          collection={node}
          onDrop={onDrop}
          level={level}
        >
          {node.children?.length > 0 && (
            <TreeNode
              nodes={node.children}
              level={level + 1}
              onDrop={onDrop}
            />
          )}
        </CollectionItem>
      ))}
    </div>
  );
}
