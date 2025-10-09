export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: '13.0.4'
  }
  public: {
    Views: {
      project_rating_summaries: {
        Row: {
          average: number
          project_id: number
          rating_counts: Record<string, number>
          reaction_counts: Record<string, number>
          total: number
        }
        Relationships: []
      }
    }
    Tables: {
      organizations: {
        Row: {
          bio: string | null
          created_at: string
          id: string
          logo_url: string | null
          name: string
        }
        Insert: {
          bio?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name: string
        }
        Update: {
          bio?: string | null
          created_at?: string
          id?: string
          logo_url?: string | null
          name?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          full_name: string
          id: string
          mode: string
          organization_id: string | null
          role: Database['public']['Enums']['user_role']
          username: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name: string
          id: string
          mode?: string
          organization_id?: string | null
          role?: Database['public']['Enums']['user_role']
          username: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          full_name?: string
          id?: string
          mode?: string
          organization_id?: string | null
          role?: Database['public']['Enums']['user_role']
          username?: string
        }
        Relationships: [
          {
            foreignKeyName: 'profiles_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      project_ratings: {
        Row: {
          client_fingerprint: string
          committed: boolean
          created_at: string
          id: string
          project_id: number
          rating: number
          updated_at: string
        }
        Insert: {
          client_fingerprint: string
          committed?: boolean
          created_at?: string
          id?: string
          project_id: number
          rating: number
          updated_at?: string
        }
        Update: {
          client_fingerprint?: string
          committed?: boolean
          created_at?: string
          id?: string
          project_id?: number
          rating?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_ratings_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      project_reactions: {
        Row: {
          client_fingerprint: string
          committed: boolean
          created_at: string
          id: string
          project_id: number
          reaction: string
          updated_at: string
        }
        Insert: {
          client_fingerprint: string
          committed?: boolean
          created_at?: string
          id?: string
          project_id: number
          reaction: string
          updated_at?: string
        }
        Update: {
          client_fingerprint?: string
          committed?: boolean
          created_at?: string
          id?: string
          project_id?: number
          reaction?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'project_reactions_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
      projects: {
        Row: {
          collaborators: string[]
          cover_image_path: string | null
          cover_image_url: string | null
          created_at: string
          description: string
          id: number
          name: string
          organization_id: string | null
          slug: string
          status: Database['public']['Enums']['current_status']
        }
        Insert: {
          collaborators?: string[]
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: never
          name: string
          organization_id?: string | null
          slug: string
          status?: Database['public']['Enums']['current_status']
        }
        Update: {
          collaborators?: string[]
          cover_image_path?: string | null
          cover_image_url?: string | null
          created_at?: string
          description?: string
          id?: never
          name?: string
          organization_id?: string | null
          slug?: string
          status?: Database['public']['Enums']['current_status']
        }
        Relationships: [
          {
            foreignKeyName: 'projects_organization_id_fkey'
            columns: ['organization_id']
            isOneToOne: false
            referencedRelation: 'organizations'
            referencedColumns: ['id']
          },
        ]
      }
      tasks: {
        Row: {
          collaborators: string[]
          created_at: string
          description: string
          due_date: string | null
          id: number
          name: string
          profile_id: string
          project_id: number | null
          status: Database['public']['Enums']['current_status']
        }
        Insert: {
          collaborators?: string[]
          created_at?: string
          description: string
          due_date?: string | null
          id?: never
          name: string
          profile_id: string
          project_id?: number | null
          status?: Database['public']['Enums']['current_status']
        }
        Update: {
          collaborators?: string[]
          created_at?: string
          description?: string
          due_date?: string | null
          id?: never
          name?: string
          profile_id?: string
          project_id?: number | null
          status?: Database['public']['Enums']['current_status']
        }
        Relationships: [
          {
            foreignKeyName: 'tasks_profile_id_fkey'
            columns: ['profile_id']
            isOneToOne: false
            referencedRelation: 'profiles'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'tasks_project_id_fkey'
            columns: ['project_id']
            isOneToOne: false
            referencedRelation: 'projects'
            referencedColumns: ['id']
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_projects_with_feedback: {
        Args: {
          status_filter?: string | null
        }
        Returns: {
          project: Json
          organization: Json | null
          rating_summary: Json | null
        }[]
      }
    }
    Enums: {
      current_status: 'in-progress' | 'completed'
      user_role: 'admin' | 'member' | 'supervisor' | 'super_admin'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, '__InternalSupabase'>

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, 'public'>]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema['Tables'] & DefaultSchema['Views'])
    ? (DefaultSchema['Tables'] & DefaultSchema['Views'])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema['Tables']
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables']
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema['Tables']
    ? DefaultSchema['Tables'][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema['Enums']
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions['schema']]['Enums'][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema['Enums']
    ? DefaultSchema['Enums'][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema['CompositeTypes']
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes']
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions['schema']]['CompositeTypes'][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema['CompositeTypes']
    ? DefaultSchema['CompositeTypes'][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      current_status: ['in-progress', 'completed'],
      user_role: ['admin', 'member', 'supervisor', 'super_admin'],
    },
  },
} as const
