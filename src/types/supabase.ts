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
      categories: {
        Row: {
          id: string
          name: string
          slug: 'protein' | 'lowCarb' | 'vegan' | 'vegetarian'
          description: string | null
          image_url: string | null
          color: string | null
          icon: string | null
          is_active: boolean
          display_order: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: 'protein' | 'lowCarb' | 'vegan' | 'vegetarian'
          description?: string | null
          image_url?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: 'protein' | 'lowCarb' | 'vegan' | 'vegetarian'
          description?: string | null
          image_url?: string | null
          color?: string | null
          icon?: string | null
          is_active?: boolean
          display_order?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
          id: string
          title: string
          description: string | null
          image_url: string | null
          price: number
          discount_price: number | null
          category_id: string | null
          is_active: boolean
          stock_quantity: number
          rating: number
          reviews_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          image_url?: string | null
          price: number
          discount_price?: number | null
          category_id?: string | null
          is_active?: boolean
          stock_quantity?: number
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          image_url?: string | null
          price?: number
          discount_price?: number | null
          category_id?: string | null
          is_active?: boolean
          stock_quantity?: number
          rating?: number
          reviews_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          user_id: string | null
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method: 'credit_card' | 'debit_card' | 'transfer' | 'cash' | null
          total_amount: number
          shipping_address: Json
          billing_address: Json | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: 'credit_card' | 'debit_card' | 'transfer' | 'cash' | null
          total_amount: number
          shipping_address: Json
          billing_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string | null
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          payment_method?: 'credit_card' | 'debit_card' | 'transfer' | 'cash' | null
          total_amount?: number
          shipping_address?: Json
          billing_address?: Json | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
