// Database types - will be auto-generated from Supabase
// Run: npx supabase gen types typescript --project-id <project-id> > src/lib/supabase/types.ts

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          weight_grams: number;
          is_available: boolean;
          display_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          weight_grams: number;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          weight_grams?: number;
          is_available?: boolean;
          display_order?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      price_tiers: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          color: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          color: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          color?: string;
          created_at?: string;
        };
      };
      product_tier_prices: {
        Row: {
          id: string;
          product_id: string;
          tier_id: string;
          price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          tier_id: string;
          price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          tier_id?: string;
          price?: number;
          created_at?: string;
        };
      };
      date_tier_assignments: {
        Row: {
          id: string;
          date: string;
          tier_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          date: string;
          tier_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          date?: string;
          tier_id?: string;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          customer_email: string | null;
          delivery_address: string;
          delivery_date: string;
          note: string | null;
          status_id: string;
          total_amount: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_code: string;
          customer_name: string;
          customer_phone: string;
          customer_email?: string | null;
          delivery_address: string;
          delivery_date: string;
          note?: string | null;
          status_id: string;
          total_amount: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_code?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_email?: string | null;
          delivery_address?: string;
          delivery_date?: string;
          note?: string | null;
          status_id?: string;
          total_amount?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          product_id: string;
          quantity: number;
          unit_price: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          product_id?: string;
          quantity?: number;
          unit_price?: number;
          created_at?: string;
        };
      };
      order_statuses: {
        Row: {
          id: string;
          name: string;
          color: string;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          color: string;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          color?: string;
          display_order?: number;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}

// Helper types
export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];

// Convenience type aliases
export type Product = Tables<"products">;
export type PriceTier = Tables<"price_tiers">;
export type ProductTierPrice = Tables<"product_tier_prices">;
export type DateTierAssignment = Tables<"date_tier_assignments">;
export type Order = Tables<"orders">;
export type OrderItem = Tables<"order_items">;
export type OrderStatus = Tables<"order_statuses">;
export type SiteSetting = Tables<"site_settings">;
