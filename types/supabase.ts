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
      projects: {
        Row: {
          id: string
          user_id: string
          name: string
          domain: string | null
          is_deployed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          domain?: string | null
          is_deployed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          domain?: string | null
          is_deployed?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      api_endpoints: {
        Row: {
          id: string
          project_id: string
          method: string
          path: string
          description: string | null
          request_schema: Json | null
          response_schema: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          project_id: string
          method: string
          path: string
          description?: string | null
          request_schema?: Json | null
          response_schema?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          project_id?: string
          method?: string
          path?: string
          description?: string | null
          request_schema?: Json | null
          response_schema?: Json | null
          created_at?: string
          updated_at?: string
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