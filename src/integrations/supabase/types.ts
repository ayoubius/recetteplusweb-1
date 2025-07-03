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
      admin_permissions: {
        Row: {
          can_manage_categories: boolean | null
          can_manage_deliveries: boolean | null
          can_manage_orders: boolean | null
          can_manage_products: boolean | null
          can_manage_recipes: boolean | null
          can_manage_users: boolean | null
          can_manage_videos: boolean | null
          can_validate_orders: boolean | null
          created_at: string
          id: string
          is_super_admin: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          can_manage_categories?: boolean | null
          can_manage_deliveries?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_products?: boolean | null
          can_manage_recipes?: boolean | null
          can_manage_users?: boolean | null
          can_manage_videos?: boolean | null
          can_validate_orders?: boolean | null
          created_at?: string
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          can_manage_categories?: boolean | null
          can_manage_deliveries?: boolean | null
          can_manage_orders?: boolean | null
          can_manage_products?: boolean | null
          can_manage_recipes?: boolean | null
          can_manage_users?: boolean | null
          can_manage_videos?: boolean | null
          can_validate_orders?: boolean | null
          created_at?: string
          id?: string
          is_super_admin?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      cart_items: {
        Row: {
          cart_type: string | null
          created_at: string
          id: string
          preconfigured_cart_id: string | null
          product_id: string
          quantity: number
          recipe_id: string | null
          user_id: string
        }
        Insert: {
          cart_type?: string | null
          created_at?: string
          id?: string
          preconfigured_cart_id?: string | null
          product_id: string
          quantity?: number
          recipe_id?: string | null
          user_id: string
        }
        Update: {
          cart_type?: string | null
          created_at?: string
          id?: string
          preconfigured_cart_id?: string | null
          product_id?: string
          quantity?: number
          recipe_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_tracking: {
        Row: {
          created_at: string | null
          delivery_person_id: string
          id: string
          latitude: number | null
          longitude: number | null
          notes: string | null
          order_id: string
          status: string
        }
        Insert: {
          created_at?: string | null
          delivery_person_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id: string
          status: string
        }
        Update: {
          created_at?: string | null
          delivery_person_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          notes?: string | null
          order_id?: string
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "delivery_tracking_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
        ]
      }
      delivery_zones: {
        Row: {
          created_at: string | null
          delivery_fee: number
          description: string | null
          id: string
          is_active: boolean | null
          max_delivery_time: number | null
          min_delivery_time: number | null
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          delivery_fee?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_delivery_time?: number | null
          min_delivery_time?: number | null
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          delivery_fee?: number
          description?: string | null
          id?: string
          is_active?: boolean | null
          max_delivery_time?: number | null
          min_delivery_time?: number | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          id: string
          item_id: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          item_id: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          item_id?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      manageable_product_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      manageable_recipe_categories: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      newsletter_campaigns: {
        Row: {
          content: string
          created_at: string
          created_by: string
          id: string
          sent_at: string | null
          sent_count: number | null
          subject: string
          title: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          created_by: string
          id?: string
          sent_at?: string | null
          sent_count?: number | null
          subject: string
          title: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          created_by?: string
          id?: string
          sent_at?: string | null
          sent_count?: number | null
          subject?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string
          id: number
          order_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: never
          order_id: string
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: never
          order_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          assigned_at: string | null
          assigned_to: string | null
          created_at: string | null
          delivered_at: string | null
          delivery_address: Json
          delivery_fee: number | null
          delivery_latitude: string | null
          delivery_longitude: string | null
          delivery_notes: string | null
          delivery_zone_id: string | null
          google_maps_link: string | null
          id: string
          items: Json
          picked_up_at: string | null
          qr_code: string | null
          status: string | null
          total_amount: number
          updated_at: string | null
          user_id: string
          validated_at: string | null
          validated_by: string | null
        }
        Insert: {
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address: Json
          delivery_fee?: number | null
          delivery_latitude?: string | null
          delivery_longitude?: string | null
          delivery_notes?: string | null
          delivery_zone_id?: string | null
          google_maps_link?: string | null
          id?: string
          items: Json
          picked_up_at?: string | null
          qr_code?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string | null
          user_id: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Update: {
          assigned_at?: string | null
          assigned_to?: string | null
          created_at?: string | null
          delivered_at?: string | null
          delivery_address?: Json
          delivery_fee?: number | null
          delivery_latitude?: string | null
          delivery_longitude?: string | null
          delivery_notes?: string | null
          delivery_zone_id?: string | null
          google_maps_link?: string | null
          id?: string
          items?: Json
          picked_up_at?: string | null
          qr_code?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string | null
          user_id?: string
          validated_at?: string | null
          validated_by?: string | null
        }
        Relationships: []
      }
      personal_cart_items: {
        Row: {
          created_at: string
          id: string
          personal_cart_id: string
          product_id: string
          quantity: number
        }
        Insert: {
          created_at?: string
          id?: string
          personal_cart_id: string
          product_id: string
          quantity: number
        }
        Update: {
          created_at?: string
          id?: string
          personal_cart_id?: string
          product_id?: string
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "personal_cart_items_personal_cart_id_fkey"
            columns: ["personal_cart_id"]
            isOneToOne: false
            referencedRelation: "personal_carts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "personal_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      personal_carts: {
        Row: {
          created_at: string
          id: string
          is_added_to_main_cart: boolean | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      preconfigured_carts: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          id: string
          image: string | null
          is_active: boolean | null
          is_featured: boolean | null
          items: Json
          name: string
          total_price: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          items: Json
          name: string
          total_price?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          id?: string
          image?: string | null
          is_active?: boolean | null
          is_featured?: boolean | null
          items?: Json
          name?: string
          total_price?: number | null
        }
        Relationships: []
      }
      product_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      products: {
        Row: {
          category: string
          created_at: string
          description: string[] | null
          id: string
          image: string | null
          in_stock: boolean | null
          name: string
          price: number
          promotion: Json | null
          rating: number | null
          unit: string
        }
        Insert: {
          category: string
          created_at?: string
          description?: string[] | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name: string
          price: number
          promotion?: Json | null
          rating?: number | null
          unit: string
        }
        Update: {
          category?: string
          created_at?: string
          description?: string[] | null
          id?: string
          image?: string | null
          in_stock?: boolean | null
          name?: string
          price?: number
          promotion?: Json | null
          rating?: number | null
          unit?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          bio: string | null
          created_at: string
          date_of_birth: string | null
          display_name: string | null
          email: string | null
          id: string
          location: string | null
          notification_settings: Json | null
          phone_number: string | null
          photo_url: string | null
          preferences: Json | null
          privacy_settings: Json | null
          role: string | null
          updated_at: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          id: string
          location?: string | null
          notification_settings?: Json | null
          phone_number?: string | null
          photo_url?: string | null
          preferences?: Json | null
          privacy_settings?: Json | null
          role?: string | null
          updated_at?: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          date_of_birth?: string | null
          display_name?: string | null
          email?: string | null
          id?: string
          location?: string | null
          notification_settings?: Json | null
          phone_number?: string | null
          photo_url?: string | null
          preferences?: Json | null
          privacy_settings?: Json | null
          role?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      recipe_cart_items: {
        Row: {
          created_at: string
          id: string
          product_id: string
          quantity: number
          recipe_cart_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          product_id: string
          quantity: number
          recipe_cart_id: string
        }
        Update: {
          created_at?: string
          id?: string
          product_id?: string
          quantity?: number
          recipe_cart_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "recipe_cart_items_recipe_cart_id_fkey"
            columns: ["recipe_cart_id"]
            isOneToOne: false
            referencedRelation: "recipe_user_carts"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_carts: {
        Row: {
          cart_items: string[] | null
          created_at: string
          id: string
          recipe_id: string
          recipe_name: string
          user_id: string
        }
        Insert: {
          cart_items?: string[] | null
          created_at?: string
          id?: string
          recipe_id: string
          recipe_name: string
          user_id: string
        }
        Update: {
          cart_items?: string[] | null
          created_at?: string
          id?: string
          recipe_id?: string
          recipe_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_carts_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipe_categories: {
        Row: {
          created_at: string
          id: string
          is_active: boolean | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean | null
          name?: string
        }
        Relationships: []
      }
      recipe_user_carts: {
        Row: {
          cart_name: string
          created_at: string
          id: string
          is_added_to_main_cart: boolean | null
          recipe_id: string
          user_id: string
        }
        Insert: {
          cart_name: string
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          recipe_id: string
          user_id: string
        }
        Update: {
          cart_name?: string
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          recipe_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recipe_user_carts_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      recipes: {
        Row: {
          category: string
          cook_time: number
          created_at: string
          created_by: string | null
          description: string | null
          difficulty: string | null
          id: string
          image: string | null
          ingredients: Json
          instructions: string[]
          prep_time: number | null
          rating: number | null
          servings: number
          title: string
          video_id: string | null
          view_count: number | null
        }
        Insert: {
          category: string
          cook_time: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image?: string | null
          ingredients: Json
          instructions: string[]
          prep_time?: number | null
          rating?: number | null
          servings: number
          title: string
          video_id?: string | null
          view_count?: number | null
        }
        Update: {
          category?: string
          cook_time?: number
          created_at?: string
          created_by?: string | null
          description?: string | null
          difficulty?: string | null
          id?: string
          image?: string | null
          ingredients?: Json
          instructions?: string[]
          prep_time?: number | null
          rating?: number | null
          servings?: number
          title?: string
          video_id?: string | null
          view_count?: number | null
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string
          description: string | null
          display_order: number | null
          id: string
          is_active: boolean | null
          name: string
          photo_url: string | null
          role: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name: string
          photo_url?: string | null
          role: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          display_order?: number | null
          id?: string
          is_active?: boolean | null
          name?: string
          photo_url?: string | null
          role?: string
          updated_at?: string
        }
        Relationships: []
      }
      user_cart_items: {
        Row: {
          cart_name: string
          cart_reference_id: string
          cart_reference_type: string
          cart_total_price: number | null
          created_at: string
          id: string
          items_count: number | null
          user_cart_id: string
        }
        Insert: {
          cart_name: string
          cart_reference_id: string
          cart_reference_type: string
          cart_total_price?: number | null
          created_at?: string
          id?: string
          items_count?: number | null
          user_cart_id: string
        }
        Update: {
          cart_name?: string
          cart_reference_id?: string
          cart_reference_type?: string
          cart_total_price?: number | null
          created_at?: string
          id?: string
          items_count?: number | null
          user_cart_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_cart_items_user_cart_id_fkey"
            columns: ["user_cart_id"]
            isOneToOne: false
            referencedRelation: "user_carts"
            referencedColumns: ["id"]
          },
        ]
      }
      user_carts: {
        Row: {
          created_at: string
          id: string
          total_price: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          total_price?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          total_price?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_history: {
        Row: {
          id: string
          recipe_id: string | null
          user_id: string | null
          viewed_at: string | null
        }
        Insert: {
          id?: string
          recipe_id?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Update: {
          id?: string
          recipe_id?: string | null
          user_id?: string | null
          viewed_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_history_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
      user_locations: {
        Row: {
          address: string
          created_at: string | null
          id: string
          is_default: boolean | null
          label: string | null
          latitude: number | null
          longitude: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          address: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          address?: string
          created_at?: string | null
          id?: string
          is_default?: boolean | null
          label?: string | null
          latitude?: number | null
          longitude?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_preconfigured_carts: {
        Row: {
          created_at: string
          id: string
          is_added_to_main_cart: boolean | null
          preconfigured_cart_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          preconfigured_cart_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_added_to_main_cart?: boolean | null
          preconfigured_cart_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_preconfigured_carts_preconfigured_cart_id_fkey"
            columns: ["preconfigured_cart_id"]
            isOneToOne: false
            referencedRelation: "preconfigured_carts"
            referencedColumns: ["id"]
          },
        ]
      }
      video_likes: {
        Row: {
          created_at: string | null
          id: string
          user_id: string
          video_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          user_id: string
          video_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          user_id?: string
          video_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "video_likes_video_id_fkey"
            columns: ["video_id"]
            isOneToOne: false
            referencedRelation: "videos"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          category: string
          created_at: string
          created_by: string | null
          description: string | null
          duration: string | null
          id: string
          likes: number | null
          recipe_id: string | null
          thumbnail: string | null
          title: string
          updated_at: string | null
          video_url: string | null
          views: number | null
        }
        Insert: {
          category: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          likes?: number | null
          recipe_id?: string | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
        }
        Update: {
          category?: string
          created_at?: string
          created_by?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          likes?: number | null
          recipe_id?: string | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
          views?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "videos_recipe_id_fkey"
            columns: ["recipe_id"]
            isOneToOne: false
            referencedRelation: "recipes"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_distance: {
        Args: { lat1: number; lon1: number; lat2: number; lon2: number }
        Returns: number
      }
      decrement_video_likes: {
        Args: { video_id: string }
        Returns: undefined
      }
      delete_old_avatar: {
        Args: { user_id: string }
        Returns: undefined
      }
      find_nearest_delivery_zone: {
        Args: { lat: number; lon: number }
        Returns: string
      }
      generate_google_maps_link: {
        Args: { lat: string; lng: string }
        Returns: string
      }
      get_personal_cart_details: {
        Args: { cart_id: string }
        Returns: Json
      }
      get_preconfigured_cart_details: {
        Args: { cart_id: string }
        Returns: Json
      }
      get_recipe_cart_details: {
        Args: { cart_id: string }
        Returns: Json
      }
      has_admin_permission: {
        Args: { permission_type: string }
        Returns: boolean
      }
      has_delivery_permission: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      has_order_validation_permission: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      increment_recipe_views: {
        Args: { recipe_uuid: string }
        Returns: undefined
      }
      increment_video_likes: {
        Args: { video_id: string }
        Returns: undefined
      }
      increment_video_views: {
        Args: { video_id: string }
        Returns: undefined
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      is_super_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      update_profile_avatar: {
        Args: { user_id: string; avatar_url: string }
        Returns: undefined
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
