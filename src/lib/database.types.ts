export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      brands: {
        Row: {
          id: string
          shop_id: string
          name: string
          description: string | null
          logo_url: string | null
          color_scheme: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          name: string
          description?: string | null
          logo_url?: string | null
          color_scheme?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          name?: string
          description?: string | null
          logo_url?: string | null
          color_scheme?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      shops: {
        Row: {
          id: string
          user_id: string
          name: string
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          settings?: Json
          created_at?: string
          updated_at?: string
        }
      }
      user_roles: {
        Row: {
          id: string
          user_id: string
          role: 'admin' | 'manager' | 'designer'
          shop_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          role: 'admin' | 'manager' | 'designer'
          shop_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          role?: 'admin' | 'manager' | 'designer'
          shop_id?: string
          created_at?: string
        }
      }
      designs: {
        Row: {
          id: string
          user_id: string
          shop_id: string
          title: string
          description: string | null
          file_url: string
          thumbnail_url: string | null
          tags: string[] | null
          created_at: string
          updated_at: string
          metadata: Json
        }
        Insert: {
          id?: string
          user_id: string
          shop_id: string
          title: string
          description?: string | null
          file_url: string
          thumbnail_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
        Update: {
          id?: string
          user_id?: string
          shop_id?: string
          title?: string
          description?: string | null
          file_url?: string
          thumbnail_url?: string | null
          tags?: string[] | null
          created_at?: string
          updated_at?: string
          metadata?: Json
        }
      }
      products: {
        Row: {
          id: string
          design_id: string
          template_id: string
          title: string
          description: string | null
          sku: string | null
          status: 'draft' | 'active' | 'archived'
          pricing: Json
          variants: Json[]
          supplier_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          design_id: string
          template_id: string
          title: string
          description?: string | null
          sku?: string | null
          status?: 'draft' | 'active' | 'archived'
          pricing: Json
          variants?: Json[]
          supplier_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          design_id?: string
          template_id?: string
          title?: string
          description?: string | null
          sku?: string | null
          status?: 'draft' | 'active' | 'archived'
          pricing?: Json
          variants?: Json[]
          supplier_data?: Json | null
          created_at?: string
          updated_at?: string
        }
      }
      sync_logs: {
        Row: {
          id: string
          shop_id: string
          design_id: string
          supplier: 'printify' | 'printful' | 'gooten'
          status: 'success' | 'error' | 'pending'
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          shop_id: string
          design_id: string
          supplier: 'printify' | 'printful' | 'gooten'
          status: 'success' | 'error' | 'pending'
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          shop_id?: string
          design_id?: string
          supplier?: 'printify' | 'printful' | 'gooten'
          status?: 'success' | 'error' | 'pending'
          error_message?: string | null
          created_at?: string
        }
      }
      // Add other table types...
    }
  }
}