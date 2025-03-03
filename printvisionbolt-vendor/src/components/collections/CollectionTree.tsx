import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { CollectionHierarchyNode } from '../../lib/types/collection';
import { ChevronRight, ChevronDown, Folder } from 'lucide-react';

interface Props {
  collections: CollectionHierarchyNode[];
  selectedId?: string;
  enableDragDrop?: boolean;
  showDesignCount?: boolean;
  showInheritedDesigns?: boolean;
  onSelect: (collection: CollectionHierarchyNode) => void;
  onMove?: (move: { sourceId: string; targetId: string; position: 'before' | 'after' | 'inside' }) => void;
}

export default function CollectionTree({
  collections,
  selectedId,
  enableDragDrop = false,
  showDesignCount = false,
  showInheritedDesigns = false,
  onSelect,
  onMove
}: Props) {
  const [expandedIds, setExpandedIds] = React.useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedIds);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedIds(newExpanded);
  };

  const renderCollection = (collection: CollectionHierarchyNode, level: number = 0) => {
    const hasChildren = collection.children?.length > 0;
    const isExpanded = expandedIds.has(collection.id);
    const isSelected = collection.id === selectedId;

    const [{ isDragging }, drag] = useDrag(() => ({
      type: 'COLLECTION',
      item: { id: collection.id },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      canDrag: () => enableDragDrop
    }));

    const [{ isOver }, drop] = useDrop(() => ({
      accept: 'COLLECTION',
      collect: (monitor) => ({
        isOver: monitor.isOver()
      }),
      drop: (item: { id: string }) => {
        if (item.id !== collection.id && onMove) {
          onMove({
            sourceId: item.id,
            targetId: collection.id,
            position: 'inside'
          });
        }
      }
    }));

    return (
      <div key={collection.id} ref={enableDragDrop ? (node) => drag(drop(node)) : undefined}>
        <div
          className={`
            flex items-center py-2 px-3 cursor-pointer
            ${isSelected ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-50'}
            ${isDragging ? 'opacity-50' : ''}
            ${isOver ? 'border-t-2 border-indigo-500' : ''}
          `}
          style={{ paddingLeft: `${level * 20}px` }}
          onClick={() => onSelect(collection)}
        >
          {hasChildren && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpanded(collection.id);
              }}
              className="p-1 hover:bg-gray-100 rounded"
            >
              {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          )}
          <Folder size={16} className="mx-2" />
          <span className="flex-1">{collection.name}</span>
          {showDesignCount && (
            <span className="text-xs text-gray-500">
              {collection.designCount || 0}
              {showInheritedDesigns && collection.inheritedDesignCount ? 
                ` (+${collection.inheritedDesignCount})` : 
                ''
              }
            </span>
          )}
        </div>
        {hasChildren && isExpanded && (
          <div>
            {collection.children?.map(child => renderCollection(child, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="collection-tree">
      {collections.map(collection => renderCollection(collection))}
    </div>
  );
}
