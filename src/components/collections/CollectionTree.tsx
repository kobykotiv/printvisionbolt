import React, { useState, useCallback } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import type { DragSourceMonitor, DropTargetMonitor } from 'react-dnd';
import { CollectionHierarchyNode, CollectionMove } from '../../lib/types/collection';
import './CollectionTree.css';

interface DragItem {
  id: string;
  type: string;
}

interface CollectionTreeProps {
  collections: CollectionHierarchyNode[];
  selectedId?: string;
  enableDragDrop?: boolean;
  showDesignCount?: boolean;
  showInheritedDesigns?: boolean;
  onSelect: (collection: CollectionHierarchyNode) => void;
  onMove?: (move: CollectionMove) => Promise<void>;
  className?: string;
}

interface CollectionItemProps extends CollectionTreeProps {
  collection: CollectionHierarchyNode;
  level: number;
  isExpanded: boolean;
  onToggle: (id: string) => void;
}

const DRAG_TYPE = 'COLLECTION';

const CollectionTree: React.FC<CollectionTreeProps> = ({
  collections,
  selectedId,
  enableDragDrop = false,
  showDesignCount = false,
  showInheritedDesigns = false,
  onSelect,
  onMove,
  className = ''
}) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const handleToggle = useCallback((id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const rootCollections = collections.filter(c => !c.parentId);

  return (
    <div className={`collection-tree ${className}`}>
      {rootCollections.map(collection => (
        <CollectionItem
          key={collection.id}
          collection={collection}
          collections={collections}
          selectedId={selectedId}
          enableDragDrop={enableDragDrop}
          showDesignCount={showDesignCount}
          showInheritedDesigns={showInheritedDesigns}
          onSelect={onSelect}
          onMove={onMove}
          level={0}
          isExpanded={expandedIds.has(collection.id)}
          onToggle={handleToggle}
        />
      ))}
    </div>
  );
};

const CollectionItem: React.FC<CollectionItemProps> = ({
  collection,
  collections,
  selectedId,
  enableDragDrop,
  showDesignCount,
  showInheritedDesigns,
  onSelect,
  onMove,
  level,
  isExpanded,
  onToggle
}) => {
  const [{ isDragging }, dragRef] = useDrag<DragItem, void, { isDragging: boolean }>({
    type: DRAG_TYPE,
    item: { id: collection.id, type: DRAG_TYPE },
    canDrag: (): boolean => Boolean(enableDragDrop),
    collect: (monitor: DragSourceMonitor) => ({
      isDragging: monitor.isDragging()
    })
  });

  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: DRAG_TYPE,
    drop: (item) => {
      if (item.id !== collection.id && onMove) {
        onMove({
          sourceId: item.id,
          targetId: collection.id
        });
      }
    },
    canDrop: (item) => {
      // Prevent dropping on itself or its children
      const isChild = (parentId: string, childId: string): boolean => {
        const child = collections.find(c => c.id === childId);
        if (!child) return false;
        if (child.parentId === parentId) return true;
        if (child.parentId) return isChild(parentId, child.parentId);
        return false;
      };
      return item.id !== collection.id && !isChild(item.id, collection.id);
    },
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver()
    })
  });

  const childCollections = collections.filter(c => c.parentId === collection.id);
  const hasChildren = childCollections.length > 0;
  const totalDesigns = showInheritedDesigns 
    ? collection.designCount + collection.inheritedDesignCount 
    : collection.designCount;

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelect(collection);
  };

  const handleToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggle(collection.id);
  };

  return (
    <div
      ref={node => {
        dragRef(dropRef(node));
      }}
      className={`
        collection-item
        ${isDragging ? 'dragging' : ''}
        ${isOver ? 'drop-target' : ''}
        ${selectedId === collection.id ? 'selected' : ''}
      `}
      style={{ marginLeft: `${level * 20}px` }}
    >
      <div className="collection-header" onClick={handleClick}>
        <button 
          className={`toggle ${hasChildren ? 'visible' : 'hidden'}`}
          onClick={handleToggle}
        >
          {isExpanded ? '▼' : '▶'}
        </button>
        <span className="name">{collection.name}</span>
        {showDesignCount && (
          <span className="design-count">
            {totalDesigns} design{totalDesigns !== 1 ? 's' : ''}
          </span>
        )}
      </div>
      {isExpanded && hasChildren && (
        <div className="children">
          {childCollections.map(child => (
            <CollectionItem
              key={child.id}
              collection={child}
              collections={collections}
              selectedId={selectedId}
              enableDragDrop={enableDragDrop}
              showDesignCount={showDesignCount}
              showInheritedDesigns={showInheritedDesigns}
              onSelect={onSelect}
              onMove={onMove}
              level={level + 1}
              isExpanded={isExpanded}
              onToggle={onToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default CollectionTree;
