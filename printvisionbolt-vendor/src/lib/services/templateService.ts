import { supabase } from '../supabase';
import type {
  Template,
  TemplateDesign,
  TemplateSyncState,
  BatchResult,
  QueueItem,
  QueueItemType
} from '../types/template';

class TemplateService {
  private async addToQueue(
    type: QueueItemType,
    metadata: Record<string, unknown>,
    priority = 0
  ): Promise<QueueItem> {
    const { data, error } = await supabase
      .from('queue_items')
      .insert({
        type,
        status: 'queued',
        priority,
        metadata
      })
      .select()
      .single();

    if (error) throw new Error(`Failed to add item to queue: ${error.message}`);
    return data;
  }

  private async updateSyncStatus(
    templateId: string,
    status: TemplateSyncState['status'],
    error?: string
  ): Promise<void> {
    const { error: updateError } = await supabase
      .from('template_sync_status')
      .upsert({
        template_id: templateId,
        status,
        error,
        updated_at: new Date().toISOString()
      });

    if (updateError) {
      throw new Error(`Failed to update sync status: ${updateError.message}`);
    }
  }

  async createTemplate(template: Partial<Template>): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .insert({
        ...template,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select('*, template_designs(*)')
      .single();

    if (error) throw new Error(`Failed to create template: ${error.message}`);
    return data;
  }

  async updateTemplate(
    id: string,
    template: Partial<Template>
  ): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .update({
        ...template,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select('*, template_designs(*)')
      .single();

    if (error) throw new Error(`Failed to update template: ${error.message}`);
    return data;
  }

  async deleteTemplate(id: string): Promise<void> {
    const { error } = await supabase
      .from('templates')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Failed to delete template: ${error.message}`);
  }

  async getTemplate(id: string): Promise<Template> {
    const { data, error } = await supabase
      .from('templates')
      .select(`
        *,
        template_designs (*),
        template_sync_status (*)
      `)
      .eq('id', id)
      .single();

    if (error) throw new Error(`Failed to get template: ${error.message}`);
    return data;
  }

  async listTemplates(filters?: {
    status?: Template['status'];
    tags?: string[];
    search?: string;
  }): Promise<Template[]> {
    let query = supabase
      .from('templates')
      .select(`
        *,
        template_designs (*),
        template_sync_status (*)
      `);

    if (filters?.status) {
      query = query.eq('status', filters.status);
    }

    if (filters?.tags?.length) {
      query = query.contains('tags', filters.tags);
    }

    if (filters?.search) {
      query = query.ilike('title', `%${filters.search}%`);
    }

    const { data, error } = await query;

    if (error) throw new Error(`Failed to list templates: ${error.message}`);
    return data;
  }

  async addDesignsToTemplate(
    templateId: string,
    designs: Partial<TemplateDesign>[]
  ): Promise<BatchResult<TemplateDesign>> {
    const result: BatchResult<TemplateDesign> = {
      successful: [],
      failed: [],
      stats: {
        total: designs.length,
        succeeded: 0,
        failed: 0,
        timeElapsed: 0
      }
    };

    const startTime = Date.now();

    try {
      const { data, error } = await supabase
        .from('template_designs')
        .insert(
          designs.map(design => ({
            ...design,
            template_id: templateId,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }))
        )
        .select();

      if (error) throw error;

      result.successful = data.map(item => ({
        id: item.id,
        data: item as TemplateDesign
      }));
      result.stats.succeeded = data.length;
    } catch (error) {
      result.failed = designs.map(design => ({
        id: design.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        data: design as TemplateDesign
      }));
      result.stats.failed = designs.length;
    }

    result.stats.timeElapsed = Date.now() - startTime;
    return result;
  }

  async syncTemplate(templateId: string): Promise<TemplateSyncState> {
    await this.updateSyncStatus(templateId, 'syncing');

    try {
      const queueItem = await this.addToQueue(
        'template_process',
        { templateId },
        1
      );

      const { data, error } = await supabase
        .from('template_sync_status')
        .select()
        .eq('template_id', templateId)
        .single();

      if (error) throw error;

      return {
        ...data,
        metadata: {
          ...data.metadata,
          queueItemId: queueItem.id
        }
      };
    } catch (error) {
      await this.updateSyncStatus(
        templateId,
        'error',
        error instanceof Error ? error.message : 'Unknown error'
      );
      throw error;
    }
  }

  async getTemplateSyncStatus(templateId: string): Promise<TemplateSyncState> {
    const { data, error } = await supabase
      .from('template_sync_status')
      .select()
      .eq('template_id', templateId)
      .single();

    if (error) throw new Error(`Failed to get sync status: ${error.message}`);
    return data;
  }
}

export const templateService = new TemplateService();