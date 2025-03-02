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
      products: {
        Row: {
          id: string
<<<<<<< HEAD
          created_at: string
          updated_at: string
          title: string
          description: string
          price: number
          status: 'draft' | 'published' | 'archived'
          metadata: Record<string, unknown>
          images: string[]
          category_id: string | null
          store_id: string
          print_provider_id: string | null
          stock: number
          vendor_id: string
          variants: Record<string, unknown>[]
          shipping_profile_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          title: string
          description: string
          price: number
          status?: 'draft' | 'published' | 'archived'
          metadata?: Record<string, unknown>
          images?: string[]
          category_id?: string | null
          store_id: string
          print_provider_id?: string | null
          stock?: number
          vendor_id: string
          variants?: Record<string, unknown>[]
          shipping_profile_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          title?: string
          description?: string
          price?: number
          status?: 'draft' | 'published' | 'archived'
          metadata?: Record<string, unknown>
          images?: string[]
          category_id?: string | null
          store_id?: string
          print_provider_id?: string | null
          stock?: number
          vendor_id?: string
          variants?: Record<string, unknown>[]
          shipping_profile_id?: string | null
        }
      }
      stores: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          domain: string
          owner_id: string
          settings: Record<string, unknown>
          status: 'active' | 'inactive'
          metadata: Record<string, unknown>
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          domain: string
          owner_id: string
          settings?: Record<string, unknown>
          status?: 'active' | 'inactive'
          metadata?: Record<string, unknown>
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          domain?: string
          owner_id?: string
          settings?: Record<string, unknown>
          status?: 'active' | 'inactive'
          metadata?: Record<string, unknown>
        }
=======
          title: string
          description: string
          price: number
          vendor_id: string
          created_at: string
          updated_at: string
          status: 'draft' | 'published' | 'archived'
          metadata: Json
          images: string[]
          stock: number
          category_id?: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
      }
      orders: {
        Row: {
          id: string
<<<<<<< HEAD
          created_at: string
          updated_at: string
          store_id: string
          customer_id: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: Record<string, unknown>[]
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          metadata: Record<string, unknown>
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id: string
          customer_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total: number
          items: Record<string, unknown>[]
          shipping_address: Record<string, unknown>
          billing_address: Record<string, unknown>
          metadata?: Record<string, unknown>
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          store_id?: string
          customer_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          total?: number
          items?: Record<string, unknown>[]
          shipping_address?: Record<string, unknown>
          billing_address?: Record<string, unknown>
          metadata?: Record<string, unknown>
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type Product = Tables<'products'>
export type Store = Tables<'stores'>
export type Order = Tables<'orders'>
=======
          user_id: string
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
          total: number
          shipping_address: Json
          billing_address: Json
          metadata: Json
        }
        Insert: Omit<Database['public']['Tables']['orders']['Row'], 'id' | 'created_at' | 'updated_at'> & {
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['orders']['Insert']>
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          metadata: Json
        }
        Insert: Omit<Database['public']['Tables']['order_items']['Row'], 'id'> & {
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['order_items']['Insert']>
      }
      categories: {
        Row: {
          id: string
          name: string
          slug: string
          parent_id: string | null
          metadata: Json
        }
        Insert: Omit<Database['public']['Tables']['categories']['Row'], 'id'> & {
          metadata?: Json
        }
        Update: Partial<Database['public']['Tables']['categories']['Insert']>
      }
    }
  }
}
>>>>>>> 3bc1751 (chore: Stage changes for turborepo migration)
