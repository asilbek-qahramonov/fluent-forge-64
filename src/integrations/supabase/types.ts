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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      admin_settings: {
        Row: {
          key: string
          updated_at: string
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          value?: Json
        }
        Update: {
          key?: string
          updated_at?: string
          value?: Json
        }
        Relationships: []
      }
      chat_conversations: {
        Row: {
          created_at: string
          id: string
          mode: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          mode?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          mode?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      coin_tasks: {
        Row: {
          config: Json
          created_at: string
          description: string | null
          icon: string | null
          id: string
          is_active: boolean
          is_repeatable: boolean
          reward: number
          sort_order: number
          task_type: Database["public"]["Enums"]["coin_task_type"]
          title: string
          updated_at: string
        }
        Insert: {
          config?: Json
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          reward?: number
          sort_order?: number
          task_type?: Database["public"]["Enums"]["coin_task_type"]
          title: string
          updated_at?: string
        }
        Update: {
          config?: Json
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          is_active?: boolean
          is_repeatable?: boolean
          reward?: number
          sort_order?: number
          task_type?: Database["public"]["Enums"]["coin_task_type"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      coin_transactions: {
        Row: {
          amount: number
          created_at: string
          id: string
          metadata: Json | null
          reason: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          metadata?: Json | null
          reason?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "coin_transactions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      community_comments: {
        Row: {
          body: string
          created_at: string
          id: string
          post_id: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string
          id?: string
          post_id: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string
          id?: string
          post_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "community_comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "community_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      community_posts: {
        Row: {
          body: string | null
          created_at: string
          id: string
          likes: number
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          likes?: number
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          likes?: number
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      courses: {
        Row: {
          cover_gradient: string | null
          created_at: string
          description: string | null
          id: string
          level: Database["public"]["Enums"]["cefr_level"]
          sort_order: number
          title: string
        }
        Insert: {
          cover_gradient?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level: Database["public"]["Enums"]["cefr_level"]
          sort_order?: number
          title: string
        }
        Update: {
          cover_gradient?: string | null
          created_at?: string
          description?: string | null
          id?: string
          level?: Database["public"]["Enums"]["cefr_level"]
          sort_order?: number
          title?: string
        }
        Relationships: []
      }
      grammar_topics: {
        Row: {
          body_md: string | null
          category: string | null
          id: string
          level: Database["public"]["Enums"]["cefr_level"] | null
          slug: string
          sort_order: number | null
          summary: string | null
          title: string
        }
        Insert: {
          body_md?: string | null
          category?: string | null
          id?: string
          level?: Database["public"]["Enums"]["cefr_level"] | null
          slug: string
          sort_order?: number | null
          summary?: string | null
          title: string
        }
        Update: {
          body_md?: string | null
          category?: string | null
          id?: string
          level?: Database["public"]["Enums"]["cefr_level"] | null
          slug?: string
          sort_order?: number | null
          summary?: string | null
          title?: string
        }
        Relationships: []
      }
      lesson_progress: {
        Row: {
          completed_at: string | null
          created_at: string
          id: string
          lesson_id: string
          score: number | null
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id: string
          score?: number | null
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          created_at?: string
          id?: string
          lesson_id?: string
          score?: number | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content_md: string | null
          course_id: string
          created_at: string
          description: string | null
          duration_minutes: number | null
          id: string
          kind: Database["public"]["Enums"]["lesson_kind"]
          sort_order: number
          title: string
          xp_reward: number | null
        }
        Insert: {
          content_md?: string | null
          course_id: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["lesson_kind"]
          sort_order?: number
          title: string
          xp_reward?: number | null
        }
        Update: {
          content_md?: string | null
          course_id?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number | null
          id?: string
          kind?: Database["public"]["Enums"]["lesson_kind"]
          sort_order?: number
          title?: string
          xp_reward?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          id: string
          read: boolean
          title: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          id?: string
          read?: boolean
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      payment_orders: {
        Row: {
          amount: number
          created_at: string
          currency: string
          id: string
          metadata: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          plan_id: string
          status: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent: string | null
          stripe_session_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          method: Database["public"]["Enums"]["payment_method"]
          plan_id: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          currency?: string
          id?: string
          metadata?: Json | null
          method?: Database["public"]["Enums"]["payment_method"]
          plan_id?: string
          status?: Database["public"]["Enums"]["payment_status"]
          stripe_payment_intent?: string | null
          stripe_session_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payment_orders_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "premium_plans"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "payment_orders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      premium_plans: {
        Row: {
          created_at: string
          description: string | null
          duration_days: number
          features: Json
          id: string
          is_active: boolean
          is_popular: boolean
          name: string
          price_coins: number | null
          price_usd: number
          sort_order: number
          stripe_price_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          duration_days: number
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name: string
          price_coins?: number | null
          price_usd: number
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          duration_days?: number
          features?: Json
          id?: string
          is_active?: boolean
          is_popular?: boolean
          name?: string
          price_coins?: number | null
          price_usd?: number
          sort_order?: number
          stripe_price_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          coins: number
          created_at: string
          display_name: string | null
          id: string
          is_banned: boolean
          is_premium: boolean
          last_daily_bonus_at: string | null
          native_language: string | null
          premium_until: string | null
          referral_code: string | null
          referred_by: string | null
          target_level: Database["public"]["Enums"]["cefr_level"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          id: string
          is_banned?: boolean
          is_premium?: boolean
          last_daily_bonus_at?: string | null
          native_language?: string | null
          premium_until?: string | null
          referral_code?: string | null
          referred_by?: string | null
          target_level?: Database["public"]["Enums"]["cefr_level"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          coins?: number
          created_at?: string
          display_name?: string | null
          id?: string
          is_banned?: boolean
          is_premium?: boolean
          last_daily_bonus_at?: string | null
          native_language?: string | null
          premium_until?: string | null
          referral_code?: string | null
          referred_by?: string | null
          target_level?: Database["public"]["Enums"]["cefr_level"] | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_attempts: {
        Row: {
          category: string
          created_at: string
          id: string
          meta_json: Json | null
          score: number
          total: number
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          meta_json?: Json | null
          score: number
          total: number
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          meta_json?: Json | null
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: []
      }
      user_notes: {
        Row: {
          content: string | null
          created_at: string
          id: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: string | null
          created_at?: string
          id?: string
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string | null
          created_at?: string
          id?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          coins: number
          last_activity_date: string | null
          level: number
          score_grammar: number
          score_listening: number
          score_reading: number
          score_speaking: number
          score_vocabulary: number
          score_writing: number
          streak_days: number
          updated_at: string
          user_id: string
          weekly_goal_minutes: number
          weekly_progress_minutes: number
          xp: number
        }
        Insert: {
          coins?: number
          last_activity_date?: string | null
          level?: number
          score_grammar?: number
          score_listening?: number
          score_reading?: number
          score_speaking?: number
          score_vocabulary?: number
          score_writing?: number
          streak_days?: number
          updated_at?: string
          user_id: string
          weekly_goal_minutes?: number
          weekly_progress_minutes?: number
          xp?: number
        }
        Update: {
          coins?: number
          last_activity_date?: string | null
          level?: number
          score_grammar?: number
          score_listening?: number
          score_reading?: number
          score_speaking?: number
          score_vocabulary?: number
          score_writing?: number
          streak_days?: number
          updated_at?: string
          user_id?: string
          weekly_goal_minutes?: number
          weekly_progress_minutes?: number
          xp?: number
        }
        Relationships: []
      }
      user_task_completions: {
        Row: {
          completed_at: string
          completion_date: string
          id: string
          metadata: Json | null
          task_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          completion_date?: string
          id?: string
          metadata?: Json | null
          task_id: string
          user_id: string
        }
        Update: {
          completed_at?: string
          completion_date?: string
          id?: string
          metadata?: Json | null
          task_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_task_completions_task_id_fkey"
            columns: ["task_id"]
            isOneToOne: false
            referencedRelation: "coin_tasks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_task_completions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_vocabulary: {
        Row: {
          created_at: string
          id: string
          next_review_at: string | null
          status: string
          strength: number
          user_id: string
          vocab_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          next_review_at?: string | null
          status?: string
          strength?: number
          user_id: string
          vocab_id: string
        }
        Update: {
          created_at?: string
          id?: string
          next_review_at?: string | null
          status?: string
          strength?: number
          user_id?: string
          vocab_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_vocabulary_vocab_id_fkey"
            columns: ["vocab_id"]
            isOneToOne: false
            referencedRelation: "vocabulary"
            referencedColumns: ["id"]
          },
        ]
      }
      vocabulary: {
        Row: {
          antonyms: string[] | null
          definition: string
          example: string | null
          id: string
          ipa: string | null
          level: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech: string | null
          synonyms: string[] | null
          word: string
        }
        Insert: {
          antonyms?: string[] | null
          definition: string
          example?: string | null
          id?: string
          ipa?: string | null
          level?: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech?: string | null
          synonyms?: string[] | null
          word: string
        }
        Update: {
          antonyms?: string[] | null
          definition?: string
          example?: string | null
          id?: string
          ipa?: string | null
          level?: Database["public"]["Enums"]["cefr_level"] | null
          part_of_speech?: string | null
          synonyms?: string[] | null
          word?: string
        }
        Relationships: []
      }
      vocabulary_exams: {
        Row: {
          answers: Json
          coins_awarded: number
          created_at: string
          duration_seconds: number | null
          id: string
          questions: Json
          score: number
          total: number
          user_id: string
        }
        Insert: {
          answers?: Json
          coins_awarded?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          questions?: Json
          score?: number
          total: number
          user_id: string
        }
        Update: {
          answers?: Json
          coins_awarded?: number
          created_at?: string
          duration_seconds?: number | null
          id?: string
          questions?: Json
          score?: number
          total?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vocabulary_exams_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      writing_submissions: {
        Row: {
          created_at: string
          feedback_json: Json | null
          id: string
          prompt: string | null
          score: number | null
          text: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback_json?: Json | null
          id?: string
          prompt?: string | null
          score?: number | null
          text: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback_json?: Json | null
          id?: string
          prompt?: string | null
          score?: number | null
          text?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      activate_premium: {
        Args: { _days: number; _user_id: string }
        Returns: undefined
      }
      admin_adjust_coins: {
        Args: { _amount: number; _reason: string; _user_id: string }
        Returns: number
      }
      admin_grant_premium: {
        Args: { _days: number; _user_id: string }
        Returns: undefined
      }
      admin_grant_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_revenue_series: {
        Args: { _days?: number }
        Returns: {
          day: string
          orders_count: number
          revenue: number
        }[]
      }
      admin_revoke_premium: { Args: { _user_id: string }; Returns: undefined }
      admin_revoke_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: undefined
      }
      admin_set_ban: {
        Args: { _banned: boolean; _user_id: string }
        Returns: undefined
      }
      admin_stats: { Args: never; Returns: Json }
      award_coins: {
        Args: {
          _amount: number
          _metadata?: Json
          _reason: string
          _user_id: string
        }
        Returns: number
      }
      claim_daily_bonus: { Args: { _user_id: string }; Returns: Json }
      complete_task: {
        Args: { _task_id: string; _user_id: string }
        Returns: Json
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      redeem_premium_with_coins: {
        Args: { _plan_id: string; _user_id: string }
        Returns: Json
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      coin_task_type:
        | "telegram_join"
        | "daily_login"
        | "referral"
        | "lesson_complete"
        | "quiz_complete"
        | "vocab_add"
        | "community_post"
        | "custom"
      lesson_kind:
        | "video"
        | "reading"
        | "listening"
        | "grammar"
        | "vocabulary"
        | "speaking"
        | "writing"
        | "quiz"
      payment_method: "stripe" | "coins"
      payment_status: "pending" | "paid" | "failed" | "refunded"
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
      cefr_level: ["A1", "A2", "B1", "B2", "C1", "C2"],
      coin_task_type: [
        "telegram_join",
        "daily_login",
        "referral",
        "lesson_complete",
        "quiz_complete",
        "vocab_add",
        "community_post",
        "custom",
      ],
      lesson_kind: [
        "video",
        "reading",
        "listening",
        "grammar",
        "vocabulary",
        "speaking",
        "writing",
        "quiz",
      ],
      payment_method: ["stripe", "coins"],
      payment_status: ["pending", "paid", "failed", "refunded"],
    },
  },
} as const
