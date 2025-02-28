import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { TemplateWithStats, Template } from '../lib/types/template';

export function useTemplates() {
  const [templates, setTemplates] = useState<TemplateWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('templates')
        .select('*');

      if (error) {
        throw error;
      }

      setTemplates(data as TemplateWithStats[]);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<Template, 'id'>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('templates')
        .insert([templateData])
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setTemplates(prev => [...prev, data as TemplateWithStats]);
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateTemplate = async (id: string, templateData: Partial<Template>) => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('templates')
        .update(templateData)
        .eq('id', id)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      setTemplates(prev =>
        prev.map(template => (template.id === id ? (data as TemplateWithStats) : template))
      );
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteTemplate = async (id: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('templates')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setTemplates(prev => prev.filter(template => template.id !== id));
    } catch (error: any) {
      setError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    templates,
    isLoading,
    error,
    createTemplate,
    updateTemplate,
    deleteTemplate
  };
}
