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
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          id: string
          native_language: string | null
          target_level: Database["public"]["Enums"]["cefr_level"] | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          native_language?: string | null
          target_level?: Database["public"]["Enums"]["cefr_level"] | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          native_language?: string | null
          target_level?: Database["public"]["Enums"]["cefr_level"] | null
          updated_at?: string
        }
        Relationships: []
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
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      cefr_level: "A1" | "A2" | "B1" | "B2" | "C1" | "C2"
      lesson_kind:
        | "video"
        | "reading"
        | "listening"
        | "grammar"
        | "vocabulary"
        | "speaking"
        | "writing"
        | "quiz"
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
    },
  },
} as const
