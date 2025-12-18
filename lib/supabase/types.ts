export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      bank_accounts: {
        Row: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at: string | null
          id: string
          is_default: boolean | null
          is_verified: boolean | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          account_name: string
          account_number: string
          bank_code: string
          bank_name: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          account_name?: string
          account_number?: string
          bank_code?: string
          bank_name?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          is_verified?: boolean | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bank_accounts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      buyer_requests: {
        Row: {
          attachments: string[] | null
          bid_count: number | null
          budget_max: number
          budget_min: number
          buyer_id: string
          category_id: string
          created_at: string | null
          currency: string | null
          deadline: string | null
          description: string
          expires_at: string | null
          id: string
          requirements: Json | null
          status: string | null
          title: string
          updated_at: string | null
          view_count: number | null
        }
        Insert: {
          attachments?: string[] | null
          bid_count?: number | null
          budget_max: number
          budget_min: number
          buyer_id: string
          category_id: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description: string
          expires_at?: string | null
          id?: string
          requirements?: Json | null
          status?: string | null
          title: string
          updated_at?: string | null
          view_count?: number | null
        }
        Update: {
          attachments?: string[] | null
          bid_count?: number | null
          budget_max?: number
          budget_min?: number
          buyer_id?: string
          category_id?: string
          created_at?: string | null
          currency?: string | null
          deadline?: string | null
          description?: string
          expires_at?: string | null
          id?: string
          requirements?: Json | null
          status?: string | null
          title?: string
          updated_at?: string | null
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "buyer_requests_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "buyer_requests_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          parent_id: string | null
          slug: string
          sort_order: number | null
          type: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          parent_id?: string | null
          slug: string
          sort_order?: number | null
          type: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          parent_id?: string | null
          slug?: string
          sort_order?: number | null
          type?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "categories_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string | null
          id: string
          last_message_at: string | null
          last_message_preview: string | null
          listing_id: string | null
          order_id: string | null
          participant_1: string
          participant_1_unread: number | null
          participant_2: string
          participant_2_unread: number | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          listing_id?: string | null
          order_id?: string | null
          participant_1: string
          participant_1_unread?: number | null
          participant_2: string
          participant_2_unread?: number | null
        }
        Update: {
          created_at?: string | null
          id?: string
          last_message_at?: string | null
          last_message_preview?: string | null
          listing_id?: string | null
          order_id?: string | null
          participant_1?: string
          participant_1_unread?: number | null
          participant_2?: string
          participant_2_unread?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_1_fkey"
            columns: ["participant_1"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_participant_2_fkey"
            columns: ["participant_2"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      dispute_messages: {
        Row: {
          attachments: string[] | null
          created_at: string | null
          dispute_id: string
          id: string
          is_admin: boolean | null
          message: string
          sender_id: string
        }
        Insert: {
          attachments?: string[] | null
          created_at?: string | null
          dispute_id: string
          id?: string
          is_admin?: boolean | null
          message: string
          sender_id: string
        }
        Update: {
          attachments?: string[] | null
          created_at?: string | null
          dispute_id?: string
          id?: string
          is_admin?: boolean | null
          message?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispute_messages_dispute_id_fkey"
            columns: ["dispute_id"]
            isOneToOne: false
            referencedRelation: "disputes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "dispute_messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      disputes: {
        Row: {
          against_id: string
          buyer_claim: string | null
          created_at: string | null
          deadline: string | null
          description: string
          dispute_number: string
          evidence: Json | null
          filed_by: string
          id: string
          order_id: string
          reason: string
          refund_amount: number | null
          release_amount: number | null
          resolution: string | null
          resolution_type: string | null
          resolved_at: string | null
          resolved_by: string | null
          seller_response: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          against_id: string
          buyer_claim?: string | null
          created_at?: string | null
          deadline?: string | null
          description: string
          dispute_number?: string
          evidence?: Json | null
          filed_by: string
          id?: string
          order_id: string
          reason: string
          refund_amount?: number | null
          release_amount?: number | null
          resolution?: string | null
          resolution_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          seller_response?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          against_id?: string
          buyer_claim?: string | null
          created_at?: string | null
          deadline?: string | null
          description?: string
          dispute_number?: string
          evidence?: Json | null
          filed_by?: string
          id?: string
          order_id?: string
          reason?: string
          refund_amount?: number | null
          release_amount?: number | null
          resolution?: string | null
          resolution_type?: string | null
          resolved_at?: string | null
          resolved_by?: string | null
          seller_response?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "disputes_against_id_fkey"
            columns: ["against_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_filed_by_fkey"
            columns: ["filed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "disputes_resolved_by_fkey"
            columns: ["resolved_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      escrow_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          held_at: string | null
          id: string
          notes: string | null
          order_id: string
          processed_by: string | null
          refund_amount: number | null
          refunded_at: string | null
          release_amount: number | null
          released_at: string | null
          status: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          held_at?: string | null
          id?: string
          notes?: string | null
          order_id: string
          processed_by?: string | null
          refund_amount?: number | null
          refunded_at?: string | null
          release_amount?: number | null
          released_at?: string | null
          status?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          held_at?: string | null
          id?: string
          notes?: string | null
          order_id?: string
          processed_by?: string | null
          refund_amount?: number | null
          refunded_at?: string | null
          release_amount?: number | null
          released_at?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "escrow_transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "escrow_transactions_processed_by_fkey"
            columns: ["processed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          account_stats: Json | null
          category_id: string
          created_at: string | null
          currency: string | null
          delivery_time_days: number | null
          description: string
          id: string
          images: string[] | null
          inquiries: number | null
          instant_delivery: boolean | null
          platform: string | null
          price: number
          pricing_tiers: Json | null
          rating: number | null
          rejection_reason: string | null
          review_count: number | null
          sales_count: number | null
          search_vector: unknown
          seller_id: string
          slug: string
          status: string | null
          title: string
          type: string
          updated_at: string | null
          views: number | null
        }
        Insert: {
          account_stats?: Json | null
          category_id: string
          created_at?: string | null
          currency?: string | null
          delivery_time_days?: number | null
          description: string
          id?: string
          images?: string[] | null
          inquiries?: number | null
          instant_delivery?: boolean | null
          platform?: string | null
          price: number
          pricing_tiers?: Json | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          sales_count?: number | null
          search_vector?: unknown
          seller_id: string
          slug: string
          status?: string | null
          title: string
          type: string
          updated_at?: string | null
          views?: number | null
        }
        Update: {
          account_stats?: Json | null
          category_id?: string
          created_at?: string | null
          currency?: string | null
          delivery_time_days?: number | null
          description?: string
          id?: string
          images?: string[] | null
          inquiries?: number | null
          instant_delivery?: boolean | null
          platform?: string | null
          price?: number
          pricing_tiers?: Json | null
          rating?: number | null
          rejection_reason?: string | null
          review_count?: number | null
          sales_count?: number | null
          search_vector?: unknown
          seller_id?: string
          slug?: string
          status?: string | null
          title?: string
          type?: string
          updated_at?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          attachments: Json | null
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          is_read: boolean | null
          is_system: boolean | null
          read_at: string | null
          sender_id: string
          system_type: string | null
        }
        Insert: {
          attachments?: Json | null
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_system?: boolean | null
          read_at?: string | null
          sender_id: string
          system_type?: string | null
        }
        Update: {
          attachments?: Json | null
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          is_system?: boolean | null
          read_at?: string | null
          sender_id?: string
          system_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string | null
          id: string
          is_read: boolean | null
          read_at: string | null
          reference_id: string | null
          reference_type: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          read_at?: string | null
          reference_id?: string | null
          reference_type?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          auto_complete_at: string | null
          buyer_confirmed: boolean | null
          buyer_fee: number
          buyer_id: string
          cancellation_reason: string | null
          cancelled_at: string | null
          cancelled_by: string | null
          completed_at: string | null
          created_at: string | null
          currency: string | null
          delivered_at: string | null
          delivery_data: Json | null
          delivery_deadline: string | null
          id: string
          listing_id: string
          order_number: string
          price: number
          requirements: string | null
          selected_tier: string | null
          seller_fee: number
          seller_id: string
          seller_receives: number
          status: string | null
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          auto_complete_at?: string | null
          buyer_confirmed?: boolean | null
          buyer_fee: number
          buyer_id: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_data?: Json | null
          delivery_deadline?: string | null
          id?: string
          listing_id: string
          order_number?: string
          price: number
          requirements?: string | null
          selected_tier?: string | null
          seller_fee: number
          seller_id: string
          seller_receives: number
          status?: string | null
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          auto_complete_at?: string | null
          buyer_confirmed?: boolean | null
          buyer_fee?: number
          buyer_id?: string
          cancellation_reason?: string | null
          cancelled_at?: string | null
          cancelled_by?: string | null
          completed_at?: string | null
          created_at?: string | null
          currency?: string | null
          delivered_at?: string | null
          delivery_data?: Json | null
          delivery_deadline?: string | null
          id?: string
          listing_id?: string
          order_number?: string
          price?: number
          requirements?: string | null
          selected_tier?: string | null
          seller_fee?: number
          seller_id?: string
          seller_receives?: number
          status?: string | null
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_buyer_id_fkey"
            columns: ["buyer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_cancelled_by_fkey"
            columns: ["cancelled_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      platform_settings: {
        Row: {
          description: string | null
          key: string
          updated_at: string | null
          updated_by: string | null
          value: Json
        }
        Insert: {
          description?: string | null
          key: string
          updated_at?: string | null
          updated_by?: string | null
          value: Json
        }
        Update: {
          description?: string | null
          key?: string
          updated_at?: string | null
          updated_by?: string | null
          value?: Json
        }
        Relationships: [
          {
            foreignKeyName: "platform_settings_updated_by_fkey"
            columns: ["updated_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          email: string
          full_name: string
          id: string
          is_verified: boolean | null
          phone: string | null
          rating: number | null
          role: string
          seller_level: string | null
          total_purchases: number | null
          total_reviews: number | null
          total_sales: number | null
          updated_at: string | null
          username: string
          verification_level: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email: string
          full_name: string
          id: string
          is_verified?: boolean | null
          phone?: string | null
          rating?: number | null
          role?: string
          seller_level?: string | null
          total_purchases?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          username: string
          verification_level?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          email?: string
          full_name?: string
          id?: string
          is_verified?: boolean | null
          phone?: string | null
          rating?: number | null
          role?: string
          seller_level?: string | null
          total_purchases?: number | null
          total_reviews?: number | null
          total_sales?: number | null
          updated_at?: string | null
          username?: string
          verification_level?: string | null
        }
        Relationships: []
      }
      request_bids: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          delivery_days: number
          id: string
          proposal: string
          request_id: string
          seller_id: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          delivery_days: number
          id?: string
          proposal: string
          request_id: string
          seller_id: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          delivery_days?: number
          id?: string
          proposal?: string
          request_id?: string
          seller_id?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "request_bids_request_id_fkey"
            columns: ["request_id"]
            isOneToOne: false
            referencedRelation: "buyer_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "request_bids_seller_id_fkey"
            columns: ["seller_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string | null
          helpful_count: number | null
          id: string
          is_public: boolean | null
          listing_id: string
          order_id: string
          rating: number
          replied_at: string | null
          reply: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at: string | null
        }
        Insert: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_public?: boolean | null
          listing_id: string
          order_id: string
          rating: number
          replied_at?: string | null
          reply?: string | null
          reviewee_id: string
          reviewer_id: string
          updated_at?: string | null
        }
        Update: {
          comment?: string | null
          created_at?: string | null
          helpful_count?: number | null
          id?: string
          is_public?: boolean | null
          listing_id?: string
          order_id?: string
          rating?: number
          replied_at?: string | null
          reply?: string | null
          reviewee_id?: string
          reviewer_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: true
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wallet_transactions: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          description: string | null
          external_transaction_id: string | null
          fee: number | null
          id: string
          metadata: Json | null
          net_amount: number
          order_id: string | null
          payment_method: string | null
          payment_reference: string | null
          status: string | null
          type: string
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          net_amount: number
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
          type: string
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          description?: string | null
          external_transaction_id?: string | null
          fee?: number | null
          id?: string
          metadata?: Json | null
          net_amount?: number
          order_id?: string | null
          payment_method?: string | null
          payment_reference?: string | null
          status?: string | null
          type?: string
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_wallet_transactions_order"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wallet_transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          available_balance: number | null
          created_at: string | null
          currency: string | null
          id: string
          pending_balance: number | null
          total_earned: number | null
          total_spent: number | null
          total_withdrawn: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          available_balance?: number | null
          created_at?: string | null
          currency?: string | null
          id?: string
          pending_balance?: number | null
          total_earned?: number | null
          total_spent?: number | null
          total_withdrawn?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      wishlists: {
        Row: {
          alert_price: number | null
          created_at: string | null
          id: string
          listing_id: string
          price_alert: boolean | null
          user_id: string
        }
        Insert: {
          alert_price?: number | null
          created_at?: string | null
          id?: string
          listing_id: string
          price_alert?: boolean | null
          user_id: string
        }
        Update: {
          alert_price?: number | null
          created_at?: string | null
          id?: string
          listing_id?: string
          price_alert?: boolean | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wishlists_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "wishlists_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_notification: {
        Args: {
          p_body?: string
          p_reference_id?: string
          p_reference_type?: string
          p_title: string
          p_type: string
          p_user_id: string
        }
        Returns: string
      }
      get_or_create_conversation: {
        Args: {
          p_listing_id?: string
          p_order_id?: string
          p_participant_1: string
          p_participant_2: string
        }
        Returns: string
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Helper types for easier usage
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

// Convenience type aliases
export type Profile = Tables<'profiles'>
export type Listing = Tables<'listings'>
export type Order = Tables<'orders'>
export type Category = Tables<'categories'>
export type Wallet = Tables<'wallets'>
export type WalletTransaction = Tables<'wallet_transactions'>
export type BuyerRequest = Tables<'buyer_requests'>
export type RequestBid = Tables<'request_bids'>
export type Review = Tables<'reviews'>
export type Dispute = Tables<'disputes'>
export type DisputeMessage = Tables<'dispute_messages'>
export type Conversation = Tables<'conversations'>
export type Message = Tables<'messages'>
export type Notification = Tables<'notifications'>
export type Wishlist = Tables<'wishlists'>
export type BankAccount = Tables<'bank_accounts'>
export type EscrowTransaction = Tables<'escrow_transactions'>
export type PlatformSetting = Tables<'platform_settings'>

