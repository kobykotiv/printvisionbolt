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
      }
      orders: {
        Row: {
          id: string
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