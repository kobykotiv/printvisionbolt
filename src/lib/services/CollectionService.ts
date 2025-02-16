import { supabase } from '../supabase';
import { 
  Collection, 
  CollectionBase,
  CollectionCreateInput, 
  CollectionUpdateInput, 
  CollectionWithRelations,
  CollectionMove,
  BatchCollectionOperation,
  CollectionHierarchyNode,
  CollectionPermissions,
  CollectionMetadata
} from '../types/collection';
import { Design, BatchDesignOperation, DesignPermissions, DesignMetadata } from '../types/design';

interface DatabaseCollection extends CollectionBase {
  designs?: Array<{ design: Design }>;
  subCollections?: DatabaseCollection[];
}

export class CollectionService {
  async getCollection(id: string, includeRelations = false): Promise<CollectionWithRelations | null> {
    const query = includeRelations 
      ? `*, designs:design_collections(design:designs(*)), collections:collections(*)`
      : '*';

    const { data, error } = await supabase
      .from('collections')
      .select(query)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    const dbCollection = data as unknown as DatabaseCollection;

    const transformed: CollectionWithRelations = {
      ...dbCollection,
      designs: includeRelations 
        ? (dbCollection.designs?.map(d => d.design) ?? [])
        : [],
      subCollections: includeRelations 
        ? (dbCollection.subCollections ?? []).map(c => this.transformToCollection(c))
        : [],
      parent: undefined
    };

    return transformed;
  }

  private transformToCollection(dbCollection: DatabaseCollection): Collection {
    return {
      ...dbCollection,
      designs: dbCollection.designs?.map(d => d.design.id) ?? [],
      subCollections: dbCollection.subCollections?.map(c => c.id) ?? []
    };
  }

  async getCollectionHierarchy(rootId?: string): Promise<CollectionHierarchyNode[]> {
    const { data, error } = await supabase
      .from('collections')
      .select(`
        *,
        childCount:collections_aggregate(count),
        designCount:design_collections_aggregate(count)
      `)
      .eq(rootId ? 'parentId' : 'parent_id', rootId ?? null);

    if (error) throw error;

    return (data ?? []).map(item => ({
      ...(item as unknown as CollectionBase),
      designs: [],
      subCollections: [],
      hasChildren: item.childCount > 0,
      childCount: item.childCount || 0,
      designCount: item.designCount || 0,
      inheritedDesignCount: 0
    }));
  }

  async validateHierarchy(collectionId: string, newParentId: string): Promise<boolean> {
    const visited = new Set<string>();
    const toCheck = [newParentId];

    while (toCheck.length > 0) {
      const current = toCheck.pop()!;
      if (current === collectionId) return false;
      if (visited.has(current)) continue;

      visited.add(current);
      const { data: parent } = await supabase
        .from('collections')
        .select('parentId')
        .eq('id', current)
        .single();

      if (parent?.parentId) toCheck.push(parent.parentId);
    }

    return true;
  }

  async createCollection(input: CollectionCreateInput): Promise<Collection> {
    if (input.parentId) {
      const isValid = await this.validateHierarchy(crypto.randomUUID(), input.parentId);
      if (!isValid) throw new Error('Invalid hierarchy - circular dependency detected');
    }

    const metadata: CollectionMetadata = {
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: await this.getCurrentUserId(),
      lastModifiedBy: await this.getCurrentUserId(),
      version: 1,
      accessCount: 0,
      lastAccessedAt: new Date()
    };

    const newCollection: CollectionCreateInput = {
      ...input,
      designs: [],
      subCollections: []
    };

    const { data, error } = await supabase
      .from('collections')
      .insert([{ ...newCollection, metadata }])
      .select()
      .single();

    if (error) throw error;
    return this.transformToCollection(data as unknown as DatabaseCollection);
  }

  async updateCollection(
    id: string, 
    updates: CollectionUpdateInput, 
    options: CollectionUpdateOptions = {}
  ): Promise<Collection> {
    const { updateDescendantPermissions, propagateMetadata, updateTimestamp } = options;

    if (updates.parentId) {
      const isValid = await this.validateHierarchy(id, updates.parentId);
      if (!isValid) throw new Error('Invalid hierarchy - circular dependency detected');
    }

    const currentCollection = await this.getCollection(id);
    if (!currentCollection) {
      throw new Error('Collection not found');
    }

    const updatedMetadata = updateTimestamp ? {
      ...currentCollection.metadata,
      updatedAt: new Date(),
      lastModifiedBy: await this.getCurrentUserId()
    } : undefined;

    const updateData = {
      ...updates,
      ...(updatedMetadata ? { metadata: updatedMetadata } : {})
    };

    const { data, error } = await supabase
      .from('collections')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    if (updateDescendantPermissions && updates.permissions) {
      await this.propagatePermissions(id, updates.permissions);
    }

    if (propagateMetadata && data.metadata) {
      await this.propagateMetadata(id, data.metadata);
    }

    return this.transformToCollection(data as unknown as DatabaseCollection);
  }

  async moveCollection({ sourceId, targetId, position }: CollectionMove): Promise<void> {
    if (targetId) {
      const isValid = await this.validateHierarchy(sourceId, targetId);
      if (!isValid) throw new Error('Invalid hierarchy - circular dependency detected');
    }

    const updates = {
      parentId: targetId,
      sortOrder: position ?? 0
    };

    const { error } = await supabase
      .from('collections')
      .update(updates)
      .eq('id', sourceId);

    if (error) throw error;
  }

  async batchOperation(operation: BatchCollectionOperation): Promise<void> {
    const { operation: opType, collectionIds, targetId, permissions } = operation;

    switch (opType) {
      case 'move': {
        if (!targetId) throw new Error('Target ID required for move operation');
        await Promise.all(collectionIds.map(id => 
          this.moveCollection({ sourceId: id, targetId })
        ));
        break;
      }

      case 'copy': {
        if (!targetId) throw new Error('Target ID required for copy operation');
        await Promise.all(collectionIds.map(async id => {
          const collection = await this.getCollection(id);
          if (collection) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { id: ignored, ...copyInput } = collection;
            const newCollection: CollectionCreateInput = {
              ...copyInput,
              name: `${collection.name} (Copy)`,
              parentId: targetId,
              designs: [],
              subCollections: []
            };
            const copied = await this.createCollection(newCollection);
            await this.copyCollectionContent(id, copied.id);
          }
        }));
        break;
      }

      case 'delete': {
        const { error } = await supabase
          .from('collections')
          .delete()
          .in('id', collectionIds);
        if (error) throw error;
        break;
      }

      case 'updatePermissions': {
        if (!permissions) throw new Error('Permissions required for updatePermissions operation');
        const fullPermissions: CollectionPermissions = {
          read: permissions.read || [],
          write: permissions.write || [],
          admin: permissions.admin || [],
          share: permissions.share || [],
          delete: permissions.delete || [],
          managePermissions: permissions.managePermissions || []
        };
        await Promise.all(collectionIds.map(id =>
          this.updateCollection(id, { permissions: fullPermissions }, { updateDescendantPermissions: true })
        ));
        break;
      }
    }
  }

  async batchDesignOperation(operation: BatchDesignOperation): Promise<void> {
    const { operation: opType, designIds, targetCollectionId, permissions, metadata } = operation;

    switch (opType) {
      case 'move': {
        if (!targetCollectionId) throw new Error('Target collection ID required for move operation');
        await this.moveDesigns(designIds, targetCollectionId);
        break;
      }

      case 'copy': {
        if (!targetCollectionId) throw new Error('Target collection ID required for copy operation');
        await this.copyDesigns(designIds, targetCollectionId);
        break;
      }

      case 'delete': {
        await this.removeDesigns(designIds);
        break;
      }

      case 'updatePermissions': {
        if (!permissions) throw new Error('Permissions required for updatePermissions operation');
        const fullPermissions: DesignPermissions = {
          read: permissions.read || [],
          write: permissions.write || [],
          admin: permissions.admin || []
        };
        await this.updateDesignPermissions(designIds, fullPermissions);
        break;
      }

      case 'updateMetadata': {
        if (!metadata) throw new Error('Metadata required for updateMetadata operation');
        const fullMetadata: DesignMetadata = {
          width: metadata.width ?? 0,
          height: metadata.height ?? 0,
          format: metadata.format ?? '',
          fileSize: metadata.fileSize ?? 0,
          dpi: metadata.dpi ?? 0,
          colorSpace: metadata.colorSpace ?? 'RGB',
          hasTransparency: metadata.hasTransparency ?? false,
          industry: metadata.industry,
          style: metadata.style,
          customData: metadata.customData
        };
        await this.updateDesignMetadata(designIds, fullMetadata);
        break;
      }
    }
  }

  private async getCurrentUserId(): Promise<string> {
    const { data: { user } } = await supabase.auth.getUser();
    return user?.id ?? 'system';
  }

  private async propagatePermissions(
    collectionId: string, 
    permissions: CollectionPermissions
  ): Promise<void> {
    const { data: descendants } = await supabase
      .from('collections')
      .select('id')
      .contains('path', [collectionId]);

    if (descendants?.length) {
      const { error } = await supabase
        .from('collections')
        .update({ permissions })
        .in('id', descendants.map(d => d.id));

      if (error) throw error;
    }
  }

  private async propagateMetadata(
    collectionId: string, 
    metadata: CollectionMetadata
  ): Promise<void> {
    const { data: descendants } = await supabase
      .from('collections')
      .select('id')
      .contains('path', [collectionId]);

    if (descendants?.length) {
      const { error } = await supabase
        .from('collections')
        .update({ metadata })
        .in('id', descendants.map(d => d.id));

      if (error) throw error;
    }
  }

  private async copyCollectionContent(sourceId: string, targetId: string): Promise<void> {
    const { data: designs } = await supabase
      .from('design_collections')
      .select('designId')
      .eq('collectionId', sourceId);

    if (designs?.length) {
      const { error } = await supabase
        .from('design_collections')
        .insert(designs.map(d => ({
          designId: d.designId,
          collectionId: targetId
        })));

      if (error) throw error;
    }
  }

  private async moveDesigns(designIds: string[], targetCollectionId: string): Promise<void> {
    const { error } = await supabase
      .from('design_collections')
      .update({ collectionId: targetCollectionId })
      .in('designId', designIds);

    if (error) throw error;
  }

  private async copyDesigns(designIds: string[], targetCollectionId: string): Promise<void> {
    const { error } = await supabase
      .from('design_collections')
      .insert(designIds.map(id => ({
        designId: id,
        collectionId: targetCollectionId
      })));

    if (error) throw error;
  }

  private async removeDesigns(designIds: string[]): Promise<void> {
    const { error } = await supabase
      .from('designs')
      .update({ status: 'archived' })
      .in('id', designIds);

    if (error) throw error;
  }

  private async updateDesignPermissions(
    designIds: string[], 
    permissions: DesignPermissions
  ): Promise<void> {
    const { error } = await supabase
      .from('designs')
      .update({ permissions })
      .in('id', designIds);

    if (error) throw error;
  }

  private async updateDesignMetadata(
    designIds: string[], 
    metadata: DesignMetadata
  ): Promise<void> {
    const { error } = await supabase
      .from('designs')
      .update({ metadata })
      .in('id', designIds);

    if (error) throw error;
  }
}

interface CollectionUpdateOptions {
  updateDescendantPermissions?: boolean;
  propagateMetadata?: boolean;
  updateTimestamp?: boolean;
}
