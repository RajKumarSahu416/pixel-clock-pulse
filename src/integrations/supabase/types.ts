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
      attendance: {
        Row: {
          check_in_photo: string | null
          check_in_time: string | null
          check_out_photo: string | null
          check_out_time: string | null
          created_at: string | null
          date: string
          employee_id: string
          id: string
          status: string | null
        }
        Insert: {
          check_in_photo?: string | null
          check_in_time?: string | null
          check_out_photo?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          employee_id: string
          id?: string
          status?: string | null
        }
        Update: {
          check_in_photo?: string | null
          check_in_time?: string | null
          check_out_photo?: string | null
          check_out_time?: string | null
          created_at?: string | null
          date?: string
          employee_id?: string
          id?: string
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "attendance_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      employees: {
        Row: {
          created_at: string | null
          department: string | null
          designation: string | null
          email: string
          id: string
          join_date: string
          name: string
          salary: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email: string
          id?: string
          join_date?: string
          name: string
          salary?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          department?: string | null
          designation?: string | null
          email?: string
          id?: string
          join_date?: string
          name?: string
          salary?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      leave_balances: {
        Row: {
          employee_id: string
          id: string
          leave_type_id: string
          total_days: number
          used_days: number
          year: number
        }
        Insert: {
          employee_id: string
          id?: string
          leave_type_id: string
          total_days?: number
          used_days?: number
          year?: number
        }
        Update: {
          employee_id?: string
          id?: string
          leave_type_id?: string
          total_days?: number
          used_days?: number
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "leave_balances_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leave_balances_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      leave_types: {
        Row: {
          description: string | null
          id: string
          name: string
        }
        Insert: {
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      leaves: {
        Row: {
          created_at: string | null
          employee_id: string
          end_date: string
          id: string
          leave_type_id: string
          reason: string | null
          start_date: string
          status: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          employee_id: string
          end_date: string
          id?: string
          leave_type_id: string
          reason?: string | null
          start_date: string
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          employee_id?: string
          end_date?: string
          id?: string
          leave_type_id?: string
          reason?: string | null
          start_date?: string
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "leaves_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaves_leave_type_id_fkey"
            columns: ["leave_type_id"]
            isOneToOne: false
            referencedRelation: "leave_types"
            referencedColumns: ["id"]
          },
        ]
      }
      payroll: {
        Row: {
          base_salary: number
          bonus: number
          created_at: string | null
          deductions: number
          employee_id: string
          id: string
          leaves_taken: number
          month: string
          net_salary: number
          present_days: number
          status: string | null
          updated_at: string | null
          working_days: number
        }
        Insert: {
          base_salary?: number
          bonus?: number
          created_at?: string | null
          deductions?: number
          employee_id: string
          id?: string
          leaves_taken?: number
          month: string
          net_salary?: number
          present_days?: number
          status?: string | null
          updated_at?: string | null
          working_days?: number
        }
        Update: {
          base_salary?: number
          bonus?: number
          created_at?: string | null
          deductions?: number
          employee_id?: string
          id?: string
          leaves_taken?: number
          month?: string
          net_salary?: number
          present_days?: number
          status?: string | null
          updated_at?: string | null
          working_days?: number
        }
        Relationships: [
          {
            foreignKeyName: "payroll_employee_id_fkey"
            columns: ["employee_id"]
            isOneToOne: false
            referencedRelation: "employees"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
        }
        Insert: {
          avatar_url?: string | null
          id: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Update: {
          avatar_url?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_user_role: {
        Args: { user_id: string }
        Returns: Database["public"]["Enums"]["app_role"]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      owns_employee_record: {
        Args: { employee_user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "employee" | "admin"
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
    Enums: {
      app_role: ["employee", "admin"],
    },
  },
} as const
