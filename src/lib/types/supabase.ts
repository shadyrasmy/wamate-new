export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      activity_log: {
        Row: {
          action: string
          created_at: string
          details: Json | null
          entity_id: string | null
          entity_type: string
          id: string
          store_id: string
          user_id: string
        }
        Insert: {
          action: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type: string
          id?: string
          store_id: string
          user_id: string
        }
        Update: {
          action?: string
          created_at?: string
          details?: Json | null
          entity_id?: string | null
          entity_type?: string
          id?: string
          store_id?: string
          user_id?: string
        }
        Relationships: []
      }
      admin_actions: {
        Row: {
          action_type: string
          created_at: string
          details: Json | null
          id: string
          target_entity_id: string | null
          target_entity_type: string | null
          target_user_id: string | null
        }
        Insert: {
          action_type: string
          created_at?: string
          details?: Json | null
          id?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          target_user_id?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string
          details?: Json | null
          id?: string
          target_entity_id?: string | null
          target_entity_type?: string | null
          target_user_id?: string | null
        }
        Relationships: []
      }
      admin_login_attempts: {
        Row: {
          failed_attempts: number | null
          id: string
          last_attempt_at: string | null
          locked_until: string | null
          user_id: string
        }
        Insert: {
          failed_attempts?: number | null
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
          user_id: string
        }
        Update: {
          failed_attempts?: number | null
          id?: string
          last_attempt_at?: string | null
          locked_until?: string | null
          user_id?: string
        }
        Relationships: []
      }
      bosta_followup_notes: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          note: string
          note_type: string | null
          order_id: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note: string
          note_type?: string | null
          order_id: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          note?: string
          note_type?: string | null
          order_id?: string
          store_id?: string
          user_id?: string
        }
        Relationships: []
      }
      connected_stores: {
        Row: {
          api_key: string | null
          api_key_encrypted: string | null
          app_installed: boolean
          created_at: string
          id: string
          is_active: boolean
          oauth_state: string | null
          permissions: string[] | null
          shop_domain: string | null
          store_id: string
          store_name: string
          updated_at: string
          user_id: string
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: string | null
          api_key_encrypted?: string | null
          app_installed?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          oauth_state?: string | null
          permissions?: string[] | null
          shop_domain?: string | null
          store_id: string
          store_name: string
          updated_at?: string
          user_id: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: string | null
          api_key_encrypted?: string | null
          app_installed?: boolean
          created_at?: string
          id?: string
          is_active?: boolean
          oauth_state?: string | null
          permissions?: string[] | null
          shop_domain?: string | null
          store_id?: string
          store_name?: string
          updated_at?: string
          user_id?: string
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      credit_reminder_sent: {
        Row: {
          id: string
          sent_at: string
          threshold: number
          user_id: string
        }
        Insert: {
          id?: string
          sent_at?: string
          threshold: number
          user_id: string
        }
        Update: {
          id?: string
          sent_at?: string
          threshold?: number
          user_id?: string
        }
        Relationships: []
      }
      custom_statuses: {
        Row: {
          color: string
          created_at: string
          id: string
          is_default: boolean | null
          label: string
          sort_order: number | null
          updated_at: string
          user_id: string
          value: string
        }
        Insert: {
          color?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label: string
          sort_order?: number | null
          updated_at?: string
          user_id: string
          value: string
        }
        Update: {
          color?: string
          created_at?: string
          id?: string
          is_default?: boolean | null
          label?: string
          sort_order?: number | null
          updated_at?: string
          user_id?: string
          value?: string
        }
        Relationships: []
      }
      customers: {
        Row: {
          address: string | null
          block_reason: string | null
          created_at: string
          email: string | null
          full_name: string | null
          government: string | null
          id: string
          is_blocked: boolean | null
          last_order_at: string | null
          notes: string | null
          phone: string
          tags: string[] | null
          total_orders: number | null
          total_spent: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          address?: string | null
          block_reason?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          government?: string | null
          id?: string
          is_blocked?: boolean | null
          last_order_at?: string | null
          notes?: string | null
          phone: string
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string | null
          block_reason?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          government?: string | null
          id?: string
          is_blocked?: boolean | null
          last_order_at?: string | null
          notes?: string | null
          phone?: string
          tags?: string[] | null
          total_orders?: number | null
          total_spent?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      daily_order_stats: {
        Row: {
          avg_order_value: number | null
          date: string
          id: string
          orders_by_government: Json | null
          orders_by_payment_method: Json | null
          orders_by_status: Json | null
          store_id: string
          total_orders: number | null
          total_revenue: number | null
          total_shipping: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          avg_order_value?: number | null
          date: string
          id?: string
          orders_by_government?: Json | null
          orders_by_payment_method?: Json | null
          orders_by_status?: Json | null
          store_id: string
          total_orders?: number | null
          total_revenue?: number | null
          total_shipping?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          avg_order_value?: number | null
          date?: string
          id?: string
          orders_by_government?: Json | null
          orders_by_payment_method?: Json | null
          orders_by_status?: Json | null
          store_id?: string
          total_orders?: number | null
          total_revenue?: number | null
          total_shipping?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      default_order_filters: {
        Row: {
          created_at: string
          default_statuses: string[]
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          default_statuses?: string[]
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          default_statuses?: string[]
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_logs: {
        Row: {
          bar_code: string | null
          created_at: string
          error_message: string | null
          id: string
          order_id: string
          provider: string
          request_payload: Json | null
          response_payload: Json | null
          shipment_code: string | null
          status: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          bar_code?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          order_id: string
          provider?: string
          request_payload?: Json | null
          response_payload?: Json | null
          shipment_code?: string | null
          status?: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          bar_code?: string | null
          created_at?: string
          error_message?: string | null
          id?: string
          order_id?: string
          provider?: string
          request_payload?: Json | null
          response_payload?: Json | null
          shipment_code?: string | null
          status?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      delivery_settings: {
        Row: {
          authentication_key: string | null
          authentication_key_encrypted: string | null
          can_open: boolean | null
          created_at: string
          id: string
          is_active: boolean | null
          main_client_code: string | null
          provider: string
          second_client: string | null
          store_id: string | null
          store_overrides: Json | null
          updated_at: string
          user_id: string
        }
        Insert: {
          authentication_key?: string | null
          authentication_key_encrypted?: string | null
          can_open?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          main_client_code?: string | null
          provider?: string
          second_client?: string | null
          store_id?: string | null
          store_overrides?: Json | null
          updated_at?: string
          user_id: string
        }
        Update: {
          authentication_key?: string | null
          authentication_key_encrypted?: string | null
          can_open?: boolean | null
          created_at?: string
          id?: string
          is_active?: boolean | null
          main_client_code?: string | null
          provider?: string
          second_client?: string | null
          store_id?: string | null
          store_overrides?: Json | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          expense_date: string
          id: string
          is_recurring: boolean
          liability_id: string | null
          next_due_date: string | null
          notes: string | null
          recurring_frequency: string | null
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          expense_date?: string
          id?: string
          is_recurring?: boolean
          liability_id?: string | null
          next_due_date?: string | null
          notes?: string | null
          recurring_frequency?: string | null
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          expense_date?: string
          id?: string
          is_recurring?: boolean
          liability_id?: string | null
          next_due_date?: string | null
          notes?: string | null
          recurring_frequency?: string | null
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_liability_id_fkey"
            columns: ["liability_id"]
            isOneToOne: false
            referencedRelation: "liabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      finance_settings: {
        Row: {
          collection_status: string | null
          created_at: string
          currency: string
          fiscal_year_start: number
          id: string
          starting_cash: number
          updated_at: string
          user_id: string
        }
        Insert: {
          collection_status?: string | null
          created_at?: string
          currency?: string
          fiscal_year_start?: number
          id?: string
          starting_cash?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          collection_status?: string | null
          created_at?: string
          currency?: string
          fiscal_year_start?: number
          id?: string
          starting_cash?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      inventory_counts: {
        Row: {
          adjustment_movement_id: string | null
          approved_by: string | null
          counted_quantity: number
          created_at: string
          difference: number
          id: string
          product_id: string
          sku_id: string | null
          status: string
          system_quantity: number
          updated_at: string
          user_id: string
        }
        Insert: {
          adjustment_movement_id?: string | null
          approved_by?: string | null
          counted_quantity: number
          created_at?: string
          difference?: number
          id?: string
          product_id: string
          sku_id?: string | null
          status?: string
          system_quantity: number
          updated_at?: string
          user_id: string
        }
        Update: {
          adjustment_movement_id?: string | null
          approved_by?: string | null
          counted_quantity?: number
          created_at?: string
          difference?: number
          id?: string
          product_id?: string
          sku_id?: string | null
          status?: string
          system_quantity?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "inventory_counts_adjustment_movement_id_fkey"
            columns: ["adjustment_movement_id"]
            isOneToOne: false
            referencedRelation: "inventory_movements"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_counts_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_counts_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "product_skus"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_movements: {
        Row: {
          created_at: string
          created_by: string
          finance_entry_id: string | null
          id: string
          idempotency_key: string
          movement_type: string
          notes: string | null
          order_id: string | null
          product_id: string
          quantity: number
          sku_id: string | null
          source_event: string
          warehouse_id: string | null
        }
        Insert: {
          created_at?: string
          created_by: string
          finance_entry_id?: string | null
          id?: string
          idempotency_key: string
          movement_type: string
          notes?: string | null
          order_id?: string | null
          product_id: string
          quantity: number
          sku_id?: string | null
          source_event: string
          warehouse_id?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          finance_entry_id?: string | null
          id?: string
          idempotency_key?: string
          movement_type?: string
          notes?: string | null
          order_id?: string | null
          product_id?: string
          quantity?: number
          sku_id?: string | null
          source_event?: string
          warehouse_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inventory_movements_finance_entry_id_fkey"
            columns: ["finance_entry_id"]
            isOneToOne: false
            referencedRelation: "ledger_entries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "inventory_movements_sku_id_fkey"
            columns: ["sku_id"]
            isOneToOne: false
            referencedRelation: "product_skus"
            referencedColumns: ["id"]
          },
        ]
      }
      inventory_settings: {
        Row: {
          auto_add_products: boolean
          created_at: string
          deduct_statuses: string[]
          id: string
          low_stock_threshold: number
          refund_statuses: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          auto_add_products?: boolean
          created_at?: string
          deduct_statuses?: string[]
          id?: string
          low_stock_threshold?: number
          refund_statuses?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          auto_add_products?: boolean
          created_at?: string
          deduct_statuses?: string[]
          id?: string
          low_stock_threshold?: number
          refund_statuses?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      ledger_entries: {
        Row: {
          account_name: string
          account_type: string
          created_at: string
          credit: number
          debit: number
          description: string | null
          entry_date: string
          id: string
          reference_id: string | null
          reference_type: string | null
          store_id: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_type: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_date?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          store_id?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_type?: string
          created_at?: string
          credit?: number
          debit?: number
          description?: string | null
          entry_date?: string
          id?: string
          reference_id?: string | null
          reference_type?: string | null
          store_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "ledger_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ledger_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      liabilities: {
        Row: {
          created_at: string
          due_day: number | null
          end_date: string | null
          id: string
          interest_rate: number | null
          is_active: boolean
          monthly_payment: number | null
          name: string
          notes: string | null
          original_amount: number
          remaining_balance: number
          start_date: string
          store_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          due_day?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean
          monthly_payment?: number | null
          name: string
          notes?: string | null
          original_amount?: number
          remaining_balance?: number
          start_date?: string
          store_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          due_day?: number | null
          end_date?: string | null
          id?: string
          interest_rate?: number | null
          is_active?: boolean
          monthly_payment?: number | null
          name?: string
          notes?: string | null
          original_amount?: number
          remaining_balance?: number
          start_date?: string
          store_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "liabilities_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liabilities_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "liabilities_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_settings: {
        Row: {
          bosta_followup_enabled: boolean | null
          comments_enabled: boolean | null
          created_at: string
          failed_delivery_enabled: boolean | null
          id: string
          low_stock_enabled: boolean | null
          new_order_sound: boolean
          new_order_toast: boolean
          problem_customers_enabled: boolean | null
          returns_enabled: boolean | null
          sound_url: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          bosta_followup_enabled?: boolean | null
          comments_enabled?: boolean | null
          created_at?: string
          failed_delivery_enabled?: boolean | null
          id?: string
          low_stock_enabled?: boolean | null
          new_order_sound?: boolean
          new_order_toast?: boolean
          problem_customers_enabled?: boolean | null
          returns_enabled?: boolean | null
          sound_url?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          bosta_followup_enabled?: boolean | null
          comments_enabled?: boolean | null
          created_at?: string
          failed_delivery_enabled?: boolean | null
          id?: string
          low_stock_enabled?: boolean | null
          new_order_sound?: boolean
          new_order_toast?: boolean
          problem_customers_enabled?: boolean | null
          returns_enabled?: boolean | null
          sound_url?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_analytics: {
        Row: {
          cancelled_orders: number
          created_at: string
          date: string
          delivered_orders: number
          id: string
          pending_orders: number
          processing_orders: number
          store_id: string
          total_orders: number
          total_revenue: number
          updated_at: string
          user_id: string
        }
        Insert: {
          cancelled_orders?: number
          created_at?: string
          date: string
          delivered_orders?: number
          id?: string
          pending_orders?: number
          processing_orders?: number
          store_id: string
          total_orders?: number
          total_revenue?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          cancelled_orders?: number
          created_at?: string
          date?: string
          delivered_orders?: number
          id?: string
          pending_orders?: number
          processing_orders?: number
          store_id?: string
          total_orders?: number
          total_revenue?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          order_id: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          order_id: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          order_id?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_confirm_attempts: {
        Row: {
          attempt_count: number
          created_at: string
          id: string
          order_id: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          attempt_count?: number
          created_at?: string
          id?: string
          order_id: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          attempt_count?: number
          created_at?: string
          id?: string
          order_id?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      order_item_statuses: {
        Row: {
          cart_item_index: number
          created_at: string | null
          id: string
          notes: string | null
          order_id: string
          product_name: string
          quantity: number
          status: string
          store_id: string
          unit_price: number | null
          updated_at: string | null
          user_id: string
          variant_info: Json | null
        }
        Insert: {
          cart_item_index: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          product_name: string
          quantity?: number
          status: string
          store_id: string
          unit_price?: number | null
          updated_at?: string | null
          user_id: string
          variant_info?: Json | null
        }
        Update: {
          cart_item_index?: number
          created_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          product_name?: string
          quantity?: number
          status?: string
          store_id?: string
          unit_price?: number | null
          updated_at?: string | null
          user_id?: string
          variant_info?: Json | null
        }
        Relationships: []
      }
      order_returns: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          return_fault_id: string | null
          return_reason_id: string | null
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          return_fault_id?: string | null
          return_reason_id?: string | null
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          return_fault_id?: string | null
          return_reason_id?: string | null
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "order_returns_return_fault_id_fkey"
            columns: ["return_fault_id"]
            isOneToOne: false
            referencedRelation: "return_faults"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_returns_return_reason_id_fkey"
            columns: ["return_reason_id"]
            isOneToOne: false
            referencedRelation: "return_reasons"
            referencedColumns: ["id"]
          },
        ]
      }
      order_status_counts: {
        Row: {
          count: number | null
          id: string
          status: string
          store_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          count?: number | null
          id?: string
          status: string
          store_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          count?: number | null
          id?: string
          status?: string
          store_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      order_statuses: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          order_id: string
          status: string
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id: string
          status?: string
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          order_id?: string
          status?: string
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      orders: {
        Row: {
          address: string
          assigned_to: string | null
          cart_items: Json
          collected_amount: number | null
          collected_at: string | null
          cost: number
          created_at: string
          custom_status: string | null
          delivery_returned_status: string | null
          delivery_status: string | null
          deposit_amount: number | null
          discount_type: string | null
          discount_value: number | null
          extra_phone: string | null
          full_name: string
          government: string
          id: string
          internal_notes: string | null
          inventory_deducted: boolean | null
          notes: string | null
          order_source: string | null
          payment_method: string
          payment_status: string | null
          phone: string
          shipping_cost: number
          status: string | null
          store_id: string
          tags: string[] | null
          total_cost: number
          updated_at: string
          user_id: string
        }
        Insert: {
          address: string
          assigned_to?: string | null
          cart_items?: Json
          collected_amount?: number | null
          collected_at?: string | null
          cost?: number
          created_at: string
          custom_status?: string | null
          delivery_returned_status?: string | null
          delivery_status?: string | null
          deposit_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          extra_phone?: string | null
          full_name: string
          government: string
          id: string
          internal_notes?: string | null
          inventory_deducted?: boolean | null
          notes?: string | null
          order_source?: string | null
          payment_method: string
          payment_status?: string | null
          phone: string
          shipping_cost?: number
          status?: string | null
          store_id: string
          tags?: string[] | null
          total_cost?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          address?: string
          assigned_to?: string | null
          cart_items?: Json
          collected_amount?: number | null
          collected_at?: string | null
          cost?: number
          created_at?: string
          custom_status?: string | null
          delivery_returned_status?: string | null
          delivery_status?: string | null
          deposit_amount?: number | null
          discount_type?: string | null
          discount_value?: number | null
          extra_phone?: string | null
          full_name?: string
          government?: string
          id?: string
          internal_notes?: string | null
          inventory_deducted?: boolean | null
          notes?: string | null
          order_source?: string | null
          payment_method?: string
          payment_status?: string | null
          phone?: string
          shipping_cost?: number
          status?: string | null
          store_id?: string
          tags?: string[] | null
          total_cost?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      otp_codes: {
        Row: {
          attempts: number | null
          code: string
          created_at: string
          expires_at: string
          id: string
          phone: string
          type: string
          used: boolean | null
        }
        Insert: {
          attempts?: number | null
          code: string
          created_at?: string
          expires_at: string
          id?: string
          phone: string
          type: string
          used?: boolean | null
        }
        Update: {
          attempts?: number | null
          code?: string
          created_at?: string
          expires_at?: string
          id?: string
          phone?: string
          type?: string
          used?: boolean | null
        }
        Relationships: []
      }
      overview_settings: {
        Row: {
          confirmed_statuses: string[] | null
          count_by_status_date: boolean | null
          created_at: string | null
          custom_cards: Json | null
          delivery_percentage: number
          id: string
          status_date_override_statuses: string[] | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          confirmed_statuses?: string[] | null
          count_by_status_date?: boolean | null
          created_at?: string | null
          custom_cards?: Json | null
          delivery_percentage?: number
          id?: string
          status_date_override_statuses?: string[] | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          confirmed_statuses?: string[] | null
          count_by_status_date?: boolean | null
          created_at?: string | null
          custom_cards?: Json | null
          delivery_percentage?: number
          id?: string
          status_date_override_statuses?: string[] | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      product_skus: {
        Row: {
          attribute_combination: Json
          cost: number | null
          created_at: string | null
          id: string
          product_id: string
          selling_price: number
          sku_code: string | null
          stock: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          attribute_combination?: Json
          cost?: number | null
          created_at?: string | null
          id?: string
          product_id: string
          selling_price?: number
          sku_code?: string | null
          stock?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          attribute_combination?: Json
          cost?: number | null
          created_at?: string | null
          id?: string
          product_id?: string
          selling_price?: number
          sku_code?: string | null
          stock?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_skus_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          created_at: string
          id: string
          product_id: string
          stock: number
          updated_at: string
          user_id: string
          variant_name: string
          variant_value: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          stock?: number
          updated_at?: string
          user_id: string
          variant_name: string
          variant_value: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          stock?: number
          updated_at?: string
          user_id?: string
          variant_name?: string
          variant_value?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          cost: number
          created_at: string
          id: string
          is_simple: boolean | null
          name: string
          selling_price: number
          stock: number
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cost?: number
          created_at?: string
          id?: string
          is_simple?: boolean | null
          name: string
          selling_price?: number
          stock?: number
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cost?: number
          created_at?: string
          id?: string
          is_simple?: boolean | null
          name?: string
          selling_price?: number
          stock?: number
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          phone: string
          updated_at: string
          username: string
        }
        Insert: {
          created_at?: string
          id: string
          phone: string
          updated_at?: string
          username: string
        }
        Update: {
          created_at?: string
          id?: string
          phone?: string
          updated_at?: string
          username?: string
        }
        Relationships: []
      }
      recurring_transactions: {
        Row: {
          amount: number
          category: Database["public"]["Enums"]["expense_category"]
          created_at: string
          description: string
          end_date: string | null
          frequency: string
          id: string
          is_active: boolean
          last_run_date: string | null
          liability_id: string | null
          next_run_date: string
          start_date: string
          store_id: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_date?: string | null
          liability_id?: string | null
          next_run_date?: string
          start_date?: string
          store_id?: string | null
          type?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: Database["public"]["Enums"]["expense_category"]
          created_at?: string
          description?: string
          end_date?: string | null
          frequency?: string
          id?: string
          is_active?: boolean
          last_run_date?: string | null
          liability_id?: string | null
          next_run_date?: string
          start_date?: string
          store_id?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recurring_transactions_liability_id_fkey"
            columns: ["liability_id"]
            isOneToOne: false
            referencedRelation: "liabilities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recurring_transactions_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      return_faults: {
        Row: {
          created_at: string
          id: string
          label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      return_reasons: {
        Row: {
          created_at: string
          id: string
          label: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          label: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          label?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      return_settings: {
        Row: {
          created_at: string
          id: string
          returned_statuses: string[]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          returned_statuses?: string[]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          returned_statuses?: string[]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      revenue_entries: {
        Row: {
          amount: number
          created_at: string
          description: string
          id: string
          notes: string | null
          order_ids: string[] | null
          revenue_date: string
          source: string
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          created_at?: string
          description: string
          id?: string
          notes?: string | null
          order_ids?: string[] | null
          revenue_date?: string
          source?: string
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          description?: string
          id?: string
          notes?: string | null
          order_ids?: string[] | null
          revenue_date?: string
          source?: string
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "revenue_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "revenue_entries_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          setting_key: string
          setting_value: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key: string
          setting_value?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          setting_key?: string
          setting_value?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      system_message_logs: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          message_type: string
          meta_message_id: string | null
          metadata: Json | null
          recipient_phone: string
          status: string
          template_language: string | null
          template_name: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_type: string
          meta_message_id?: string | null
          metadata?: Json | null
          recipient_phone: string
          status?: string
          template_language?: string | null
          template_name?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          message_type?: string
          meta_message_id?: string | null
          metadata?: Json | null
          recipient_phone?: string
          status?: string
          template_language?: string | null
          template_name?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      team_invites: {
        Row: {
          created_at: string
          created_by: string
          expires_at: string
          id: string
          invite_code: string
          is_active: boolean
          max_uses: number | null
          role: Database["public"]["Enums"]["team_role"]
          store_id: string
          use_count: number
        }
        Insert: {
          created_at?: string
          created_by: string
          expires_at?: string
          id?: string
          invite_code?: string
          is_active?: boolean
          max_uses?: number | null
          role?: Database["public"]["Enums"]["team_role"]
          store_id: string
          use_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string
          expires_at?: string
          id?: string
          invite_code?: string
          is_active?: boolean
          max_uses?: number | null
          role?: Database["public"]["Enums"]["team_role"]
          store_id?: string
          use_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "team_invites_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_invites_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      team_members: {
        Row: {
          created_at: string
          id: string
          invited_by: string | null
          role: Database["public"]["Enums"]["team_role"]
          store_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          store_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          invited_by?: string | null
          role?: Database["public"]["Enums"]["team_role"]
          store_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "team_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notifications: {
        Row: {
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          is_read: boolean | null
          message: string | null
          metadata: Json | null
          store_id: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          store_id?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          is_read?: boolean | null
          message?: string | null
          metadata?: Json | null
          store_id?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_wallets: {
        Row: {
          created_at: string | null
          id: string
          is_unlimited: boolean | null
          orders_balance: number
          total_orders_purchased: number
          total_orders_used: number
          total_spent_usd: number
          unlimited_expires_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_unlimited?: boolean | null
          orders_balance?: number
          total_orders_purchased?: number
          total_orders_used?: number
          total_spent_usd?: number
          unlimited_expires_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_unlimited?: boolean | null
          orders_balance?: number
          total_orders_purchased?: number
          total_orders_used?: number
          total_spent_usd?: number
          unlimited_expires_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      wallet_packages: {
        Row: {
          created_at: string | null
          id: string
          is_active: boolean | null
          is_unlimited: boolean | null
          name: string
          orders_count: number | null
          price_usd: number
          sort_order: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_unlimited?: boolean | null
          name: string
          orders_count?: number | null
          price_usd: number
          sort_order?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          is_unlimited?: boolean | null
          name?: string
          orders_count?: number | null
          price_usd?: number
          sort_order?: number | null
        }
        Relationships: []
      }
      wallet_transactions: {
        Row: {
          amount_usd: number | null
          created_at: string | null
          description: string | null
          id: string
          orders_count: number | null
          package_id: string | null
          payment_provider_id: string | null
          status: string | null
          type: string
          user_id: string
        }
        Insert: {
          amount_usd?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          orders_count?: number | null
          package_id?: string | null
          payment_provider_id?: string | null
          status?: string | null
          type: string
          user_id: string
        }
        Update: {
          amount_usd?: number | null
          created_at?: string | null
          description?: string | null
          id?: string
          orders_count?: number | null
          package_id?: string | null
          payment_provider_id?: string | null
          status?: string | null
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallet_transactions_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "wallet_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_events: {
        Row: {
          created_at: string
          event_type: string
          id: string
          order_id: string
          payload: Json
          processed: boolean
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          event_type?: string
          id?: string
          order_id: string
          payload: Json
          processed?: boolean
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          event_type?: string
          id?: string
          order_id?: string
          payload?: Json
          processed?: boolean
          store_id?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_cloud_settings: {
        Row: {
          access_token: string | null
          access_token_encrypted: string | null
          business_id: string | null
          created_at: string
          id: string
          include_tracking_id: boolean
          label: string | null
          phone_number_id: string | null
          phone_numbers: Json | null
          send_confirm_enabled: boolean
          store_id: string | null
          store_ids: string[] | null
          template_language: string | null
          template_name: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_encrypted?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          include_tracking_id?: boolean
          label?: string | null
          phone_number_id?: string | null
          phone_numbers?: Json | null
          send_confirm_enabled?: boolean
          store_id?: string | null
          store_ids?: string[] | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          access_token?: string | null
          access_token_encrypted?: string | null
          business_id?: string | null
          created_at?: string
          id?: string
          include_tracking_id?: boolean
          label?: string | null
          phone_number_id?: string | null
          phone_numbers?: Json | null
          send_confirm_enabled?: boolean
          store_id?: string | null
          store_ids?: string[] | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_cloud_status_rules: {
        Row: {
          cloud_instance_id: string
          created_at: string
          id: string
          is_active: boolean
          status_type: string
          status_value: string
          store_id: string | null
          template_language: string
          template_name: string
          template_params_count: number
          template_params_mapping: string[] | null
          updated_at: string
          user_id: string
        }
        Insert: {
          cloud_instance_id: string
          created_at?: string
          id?: string
          is_active?: boolean
          status_type: string
          status_value: string
          store_id?: string | null
          template_language?: string
          template_name?: string
          template_params_count?: number
          template_params_mapping?: string[] | null
          updated_at?: string
          user_id: string
        }
        Update: {
          cloud_instance_id?: string
          created_at?: string
          id?: string
          is_active?: boolean
          status_type?: string
          status_value?: string
          store_id?: string | null
          template_language?: string
          template_name?: string
          template_params_count?: number
          template_params_mapping?: string[] | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_cloud_status_rules_cloud_instance_id_fkey"
            columns: ["cloud_instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_cloud_settings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_cloud_status_rules_cloud_instance_id_fkey"
            columns: ["cloud_instance_id"]
            isOneToOne: false
            referencedRelation: "whatsapp_cloud_settings_decrypted"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_instances: {
        Row: {
          access_token: string | null
          access_token_encrypted: string | null
          bypass_round_robin: boolean
          country_code: string
          created_at: string
          id: string
          instance_id: string | null
          instance_name: string
          is_active: boolean
          is_primary: boolean
          message_template: string | null
          product_filter: string
          selected_products: string[] | null
          send_count: number
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_encrypted?: string | null
          bypass_round_robin?: boolean
          country_code?: string
          created_at?: string
          id?: string
          instance_id?: string | null
          instance_name?: string
          is_active?: boolean
          is_primary?: boolean
          message_template?: string | null
          product_filter?: string
          selected_products?: string[] | null
          send_count?: number
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_encrypted?: string | null
          bypass_round_robin?: boolean
          country_code?: string
          created_at?: string
          id?: string
          instance_id?: string | null
          instance_name?: string
          is_active?: boolean
          is_primary?: boolean
          message_template?: string | null
          product_filter?: string
          selected_products?: string[] | null
          send_count?: number
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_logs: {
        Row: {
          created_at: string
          id: string
          max_retries: number | null
          message: string
          next_retry_at: string | null
          order_id: string
          phone: string
          response: Json | null
          retry_count: number | null
          status: string
          store_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          max_retries?: number | null
          message: string
          next_retry_at?: string | null
          order_id: string
          phone: string
          response?: Json | null
          retry_count?: number | null
          status?: string
          store_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          max_retries?: number | null
          message?: string
          next_retry_at?: string | null
          order_id?: string
          phone?: string
          response?: Json | null
          retry_count?: number | null
          status?: string
          store_id?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_otp_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          language: string
          template_key: string
          template_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          language?: string
          template_key: string
          template_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          language?: string
          template_key?: string
          template_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      whatsapp_settings: {
        Row: {
          access_token: string | null
          access_token_encrypted: string | null
          country_code: string
          created_at: string
          id: string
          instance_id: string | null
          message_template: string
          product_filter: string
          selected_products: string[] | null
          selected_store_ids: string[] | null
          send_mode: string
          store_filter: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token?: string | null
          access_token_encrypted?: string | null
          country_code?: string
          created_at?: string
          id?: string
          instance_id?: string | null
          message_template?: string
          product_filter?: string
          selected_products?: string[] | null
          selected_store_ids?: string[] | null
          send_mode?: string
          store_filter?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string | null
          access_token_encrypted?: string | null
          country_code?: string
          created_at?: string
          id?: string
          instance_id?: string | null
          message_template?: string
          product_filter?: string
          selected_products?: string[] | null
          selected_store_ids?: string[] | null
          send_mode?: string
          store_filter?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      whatsapp_status_messages: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          message_template: string
          status_type: string
          status_value: string
          store_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template: string
          status_type: string
          status_value: string
          store_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          message_template?: string
          status_type?: string
          status_value?: string
          store_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_status_messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_status_messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_status_messages_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      connected_stores_decrypted: {
        Row: {
          api_key: string | null
          app_installed: boolean | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          oauth_state: string | null
          permissions: string[] | null
          shop_domain: string | null
          store_id: string | null
          store_name: string | null
          updated_at: string | null
          user_id: string | null
          webhook_secret: string | null
          webhook_url: string | null
        }
        Insert: {
          api_key?: never
          app_installed?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          oauth_state?: string | null
          permissions?: string[] | null
          shop_domain?: string | null
          store_id?: string | null
          store_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Update: {
          api_key?: never
          app_installed?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          oauth_state?: string | null
          permissions?: string[] | null
          shop_domain?: string | null
          store_id?: string | null
          store_name?: string | null
          updated_at?: string | null
          user_id?: string | null
          webhook_secret?: string | null
          webhook_url?: string | null
        }
        Relationships: []
      }
      connected_stores_safe: {
        Row: {
          app_installed: boolean | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          store_id: string | null
          store_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          app_installed?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          store_id?: string | null
          store_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          app_installed?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          store_id?: string | null
          store_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      delivery_settings_decrypted: {
        Row: {
          authentication_key: string | null
          can_open: boolean | null
          created_at: string | null
          id: string | null
          is_active: boolean | null
          main_client_code: string | null
          provider: string | null
          second_client: string | null
          store_id: string | null
          store_overrides: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          authentication_key?: never
          can_open?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          main_client_code?: string | null
          provider?: string | null
          second_client?: string | null
          store_id?: string | null
          store_overrides?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          authentication_key?: never
          can_open?: boolean | null
          created_at?: string | null
          id?: string | null
          is_active?: boolean | null
          main_client_code?: string | null
          provider?: string | null
          second_client?: string | null
          store_id?: string | null
          store_overrides?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "delivery_settings_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_cloud_settings_decrypted: {
        Row: {
          access_token: string | null
          business_id: string | null
          created_at: string | null
          id: string | null
          include_tracking_id: boolean | null
          label: string | null
          phone_number_id: string | null
          send_confirm_enabled: boolean | null
          store_ids: string[] | null
          template_language: string | null
          template_name: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: never
          business_id?: string | null
          created_at?: string | null
          id?: string | null
          include_tracking_id?: boolean | null
          label?: string | null
          phone_number_id?: string | null
          send_confirm_enabled?: boolean | null
          store_ids?: string[] | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: never
          business_id?: string | null
          created_at?: string | null
          id?: string | null
          include_tracking_id?: boolean | null
          label?: string | null
          phone_number_id?: string | null
          send_confirm_enabled?: boolean | null
          store_ids?: string[] | null
          template_language?: string | null
          template_name?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      whatsapp_instances_decrypted: {
        Row: {
          access_token: string | null
          bypass_round_robin: boolean | null
          country_code: string | null
          created_at: string | null
          id: string | null
          instance_id: string | null
          instance_name: string | null
          is_active: boolean | null
          is_primary: boolean | null
          message_template: string | null
          product_filter: string | null
          selected_products: string[] | null
          send_count: number | null
          store_id: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: never
          bypass_round_robin?: boolean | null
          country_code?: string | null
          created_at?: string | null
          id?: string | null
          instance_id?: string | null
          instance_name?: string | null
          is_active?: boolean | null
          is_primary?: boolean | null
          message_template?: string | null
          product_filter?: string | null
          selected_products?: string[] | null
          send_count?: number | null
          store_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: never
          bypass_round_robin?: boolean | null
          country_code?: string | null
          created_at?: string | null
          id?: string | null
          instance_id?: string | null
          instance_name?: string | null
          is_active?: boolean | null
          is_primary?: boolean | null
          message_template?: string | null
          product_filter?: string | null
          selected_products?: string[] | null
          send_count?: number | null
          store_id?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_decrypted"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "whatsapp_instances_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "connected_stores_safe"
            referencedColumns: ["id"]
          },
        ]
      }
      whatsapp_settings_decrypted: {
        Row: {
          access_token: string | null
          country_code: string | null
          created_at: string | null
          id: string | null
          instance_id: string | null
          message_template: string | null
          product_filter: string | null
          selected_products: string[] | null
          selected_store_ids: string[] | null
          send_mode: string | null
          store_filter: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          access_token?: never
          country_code?: string | null
          created_at?: string | null
          id?: string | null
          instance_id?: string | null
          message_template?: string | null
          product_filter?: string | null
          selected_products?: string[] | null
          selected_store_ids?: string[] | null
          send_mode?: string | null
          store_filter?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          access_token?: never
          country_code?: string | null
          created_at?: string | null
          id?: string | null
          instance_id?: string | null
          message_template?: string | null
          product_filter?: string | null
          selected_products?: string[] | null
          selected_store_ids?: string[] | null
          send_mode?: string | null
          store_filter?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      adjust_stock: {
        Args: {
          p_idempotency_key?: string
          p_movement_type?: string
          p_notes?: string
          p_order_id?: string
          p_product_id: string
          p_quantity?: number
          p_sku_id?: string
          p_source_event?: string
          p_user_id?: string
          p_warehouse_id?: string
        }
        Returns: Json
      }
      adjust_stock_with_finance: {
        Args: {
          p_idempotency_key?: string
          p_movement_type?: string
          p_notes?: string
          p_order_id?: string
          p_product_id: string
          p_quantity?: number
          p_sku_id?: string
          p_source_event?: string
          p_store_id?: string
          p_unit_cost?: number
          p_user_id?: string
          p_warehouse_id?: string
        }
        Returns: Json
      }
      approve_inventory_count: {
        Args: { p_approver_id: string; p_count_id: string }
        Returns: Json
      }
      can_edit_orders: {
        Args: { _store_uuid: string; _user_id: string }
        Returns: boolean
      }
      can_join_with_invite: {
        Args: {
          _invite_code: string
          _role: Database["public"]["Enums"]["team_role"]
          _store_id: string
          _user_id: string
        }
        Returns: boolean
      }
      can_view_profile: {
        Args: { _profile_id: string; _viewer_id: string }
        Returns: boolean
      }
      decrypt_credential: { Args: { ciphertext: string }; Returns: string }
      encrypt_credential: { Args: { plaintext: string }; Returns: string }
      get_admin_summary_stats: {
        Args: never
        Returns: {
          new_orders_30d: number
          new_orders_7d: number
          new_users_30d: number
          new_users_7d: number
          revenue_30d: number
          revenue_7d: number
          total_orders: number
          total_revenue: number
          total_stores: number
          total_users: number
        }[]
      }
      get_all_product_names: {
        Args: { p_store_ids?: string[]; p_user_id: string }
        Returns: {
          product_name: string
        }[]
      }
      get_analytics_summary:
        | {
            Args: {
              p_date_from?: string
              p_date_to?: string
              p_store_ids?: string[]
              p_user_id: string
            }
            Returns: Json
          }
        | {
            Args: {
              p_date_from?: string
              p_date_to?: string
              p_store_ids?: string[]
              p_timezone?: string
              p_user_id: string
            }
            Returns: Json
          }
      get_confirmation_delivery_analytics: {
        Args: {
          p_confirmed_statuses?: string[]
          p_date_from?: string
          p_date_to?: string
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: {
          confirmation_status: string
          delivered_orders: number
          delivered_percentage: number
          delivered_revenue: number
          total_orders: number
          total_revenue: number
        }[]
      }
      get_customer_delivery_stats: {
        Args: { p_phones: string[]; p_user_id: string }
        Returns: {
          cancelled_orders: number
          delivered_orders: number
          delivery_rate: number
          phone: string
          returned_orders: number
          total_orders: number
        }[]
      }
      get_customer_stats_summary: {
        Args: { p_user_id: string }
        Returns: {
          avg_order_value: number
          blocked_customers: number
          top_customer_phone: string
          top_customer_spent: number
          total_customers: number
          total_revenue: number
        }[]
      }
      get_customers_paginated: {
        Args: {
          p_limit?: number
          p_page?: number
          p_search?: string
          p_user_id: string
        }
        Returns: {
          address: string
          block_reason: string
          created_at: string
          email: string
          full_name: string
          government: string
          id: string
          is_blocked: boolean
          last_order_at: string
          notes: string
          phone: string
          tags: string[]
          total_count: number
          total_orders: number
          total_spent: number
          updated_at: string
          user_id: string
        }[]
      }
      get_daily_stats_range: {
        Args: {
          p_end_date?: string
          p_start_date?: string
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: {
          avg_order_value: number
          date: string
          total_orders: number
          total_revenue: number
        }[]
      }
      get_delivered_orders_for_collection: {
        Args: {
          p_collected_status?: string
          p_limit?: number
          p_page?: number
          p_store_id?: string
          p_user_id: string
        }
        Returns: {
          order_data: Database["public"]["Tables"]["orders"]["Row"]
          total_count: number
        }[]
      }
      get_delivery_analytics: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: Json
      }
      get_encryption_key: { Args: never; Returns: string }
      get_filtered_orders: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_delivery_statuses?: string[]
          p_governments?: string[]
          p_limit?: number
          p_max_price?: number
          p_min_price?: number
          p_offset?: number
          p_payment_methods?: string[]
          p_product_names?: string[]
          p_search?: string
          p_statuses?: string[]
          p_store_ids?: string[]
          p_tags?: string[]
          p_user_id: string
        }
        Returns: {
          order_data: Database["public"]["Tables"]["orders"]["Row"]
          total_count: number
        }[]
      }
      get_finance_summary: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: Json
      }
      get_inventory_finance_reconciliation: {
        Args: { p_date_from?: string; p_date_to?: string; p_user_id: string }
        Returns: {
          linked_finance_entries: number
          movement_type: string
          total_finance_value: number
          total_movements: number
          total_quantity: number
          unlinked_movements: number
        }[]
      }
      get_inventory_valuation: {
        Args: { p_user_id: string }
        Returns: {
          current_stock: number
          product_id: string
          product_name: string
          sku_code: string
          sku_id: string
          total_value: number
          unit_cost: number
        }[]
      }
      get_negative_stock_report: {
        Args: { p_user_id: string }
        Returns: {
          current_stock: number
          last_movement_at: string
          product_id: string
          product_name: string
          sku_code: string
          sku_id: string
        }[]
      }
      get_order_status_counts: {
        Args: { p_store_ids?: string[]; p_user_id: string }
        Returns: {
          count: number
          status: string
        }[]
      }
      get_overselling_report: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_limit?: number
          p_user_id: string
        }
        Returns: {
          created_at: string
          movement_id: string
          movement_type: string
          order_id: string
          product_id: string
          product_name: string
          quantity: number
          sku_id: string
          stock_after: number
        }[]
      }
      get_overview_stats: {
        Args: {
          p_confirmed_statuses: string[]
          p_count_by_status_date?: boolean
          p_date_from: string
          p_date_to: string
          p_delivery_percentage?: number
          p_store_ids: string[]
          p_user_id: string
        }
        Returns: Json
      }
      get_product_analytics: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_limit?: number
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: {
          order_count: number
          product_name: string
          quantity: number
          revenue: number
        }[]
      }
      get_product_delivered_analytics: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_limit?: number
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: {
          delivered_order_count: number
          delivered_quantity: number
          delivered_revenue: number
          order_count: number
          product_name: string
          quantity: number
          revenue: number
        }[]
      }
      get_returned_orders_paginated: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_limit?: number
          p_page?: number
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: {
          address: string
          assigned_to: string
          cart_items: Json
          collected_amount: number
          collected_at: string
          cost: number
          created_at: string
          custom_status: string
          delivery_returned_status: string
          delivery_status: string
          deposit_amount: number
          discount_type: string
          discount_value: number
          extra_phone: string
          full_name: string
          government: string
          id: string
          internal_notes: string
          inventory_deducted: boolean
          notes: string
          order_source: string
          payment_method: string
          payment_status: string
          phone: string
          shipping_cost: number
          status: string
          store_id: string
          tags: string[]
          total_cost: number
          total_count: number
          updated_at: string
          user_id: string
        }[]
      }
      get_returned_orders_summary: {
        Args: {
          p_date_from?: string
          p_date_to?: string
          p_store_ids?: string[]
          p_user_id: string
        }
        Returns: Json
      }
      get_stock_at_date: {
        Args: { p_as_of?: string; p_user_id: string }
        Returns: {
          product_id: string
          product_name: string
          sku_id: string
          stock_at_date: number
        }[]
      }
      get_stock_from_movements: {
        Args: { p_user_id: string }
        Returns: {
          cached_stock: number
          difference: number
          ledger_stock: number
          product_id: string
          sku_id: string
        }[]
      }
      get_store_owner_by_store_id: {
        Args: { _store_id: string }
        Returns: string
      }
      get_store_owner_id: { Args: { _store_uuid: string }; Returns: string }
      get_store_role: {
        Args: { _store_uuid: string; _user_id: string }
        Returns: string
      }
      get_valid_invite: {
        Args: { _invite_code: string; _store_id: string }
        Returns: {
          invite_id: string
          role: Database["public"]["Enums"]["team_role"]
        }[]
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      has_store_access: {
        Args: { _store_uuid: string; _user_id: string }
        Returns: boolean
      }
      has_store_access_by_store_id: {
        Args: { _store_id_text: string; _user_id: string }
        Returns: boolean
      }
      is_team_member_of_store: {
        Args: { _store_uuid: string; _user_id: string }
        Returns: boolean
      }
      join_team_with_invite: { Args: { _invite_code: string }; Returns: Json }
      refresh_daily_order_stats: {
        Args: { p_date: string; p_store_id: string; p_user_id: string }
        Returns: undefined
      }
      rename_custom_status: {
        Args: { p_new_value: string; p_old_value: string; p_user_id: string }
        Returns: undefined
      }
      search_orders_by_product: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_product_names: string[]
          p_store_ids: string[]
          p_user_id: string
        }
        Returns: {
          order_data: Database["public"]["Tables"]["orders"]["Row"]
          total_count: number
        }[]
      }
      search_orders_fulltext: {
        Args: {
          p_limit?: number
          p_offset?: number
          p_search_query: string
          p_store_ids: string[]
          p_user_id: string
        }
        Returns: {
          order_data: Database["public"]["Tables"]["orders"]["Row"]
          total_count: number
        }[]
      }
      validate_invite_code: {
        Args: { _invite_code: string }
        Returns: {
          role: Database["public"]["Enums"]["team_role"]
          store_id: string
          store_name: string
        }[]
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      expense_category:
        | "payroll"
        | "advertising"
        | "rent"
        | "loan_payment"
        | "merchant_payout"
        | "utilities"
        | "supplies"
        | "other"
        | "product_cost"
      team_role: "admin" | "agent" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      expense_category: [
        "payroll",
        "advertising",
        "rent",
        "loan_payment",
        "merchant_payout",
        "utilities",
        "supplies",
        "other",
        "product_cost",
      ],
      team_role: ["admin", "agent", "viewer"],
    },
  },
} as const
