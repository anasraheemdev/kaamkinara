import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          role: "customer" | "worker" | "admin"
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name: string
          phone?: string | null
          role: "customer" | "worker" | "admin"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          role?: "customer" | "worker" | "admin"
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      worker_profiles: {
        Row: {
          id: string
          user_id: string
          service_category: string
          skills: string[]
          experience_years: number
          hourly_rate: number | null
          bio: string | null
          location: string | null
          is_verified: boolean
          is_available: boolean
          rating: number
          total_reviews: number
          total_jobs: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          service_category: string
          skills?: string[]
          experience_years?: number
          hourly_rate?: number | null
          bio?: string | null
          location?: string | null
          is_verified?: boolean
          is_available?: boolean
          rating?: number
          total_reviews?: number
          total_jobs?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          service_category?: string
          skills?: string[]
          experience_years?: number
          hourly_rate?: number | null
          bio?: string | null
          location?: string | null
          is_verified?: boolean
          is_available?: boolean
          rating?: number
          total_reviews?: number
          total_jobs?: number
          created_at?: string
          updated_at?: string
        }
      }
      worker_availability: {
        Row: {
          id: string
          worker_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          day_of_week: number
          start_time: string
          end_time: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      services: {
        Row: {
          id: string
          worker_id: string
          title: string
          description: string | null
          category: string
          price_type: "hourly" | "fixed" | "range"
          min_price: number | null
          max_price: number | null
          duration_hours: number
          tags: string[]
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          title: string
          description?: string | null
          category: string
          price_type?: "hourly" | "fixed" | "range"
          min_price?: number | null
          max_price?: number | null
          duration_hours?: number
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          title?: string
          description?: string | null
          category?: string
          price_type?: "hourly" | "fixed" | "range"
          min_price?: number | null
          max_price?: number | null
          duration_hours?: number
          tags?: string[]
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          customer_id: string
          worker_id: string
          service_id: string | null
          title: string
          description: string | null
          booking_date: string
          start_time: string
          end_time: string
          duration_hours: number
          location: string
          status: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
          amount: number
          payment_status: "pending" | "paid" | "refunded"
          notes: string | null
          customer_rating: number | null
          worker_rating: number | null
          customer_review: string | null
          worker_review: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          worker_id: string
          service_id?: string | null
          title: string
          description?: string | null
          booking_date: string
          start_time: string
          end_time: string
          duration_hours: number
          location: string
          status?: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
          amount: number
          payment_status?: "pending" | "paid" | "refunded"
          notes?: string | null
          customer_rating?: number | null
          worker_rating?: number | null
          customer_review?: string | null
          worker_review?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          worker_id?: string
          service_id?: string | null
          title?: string
          description?: string | null
          booking_date?: string
          start_time?: string
          end_time?: string
          duration_hours?: number
          location?: string
          status?: "pending" | "confirmed" | "in_progress" | "completed" | "cancelled"
          amount?: number
          payment_status?: "pending" | "paid" | "refunded"
          notes?: string | null
          customer_rating?: number | null
          worker_rating?: number | null
          customer_review?: string | null
          worker_review?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      booking_time_slots: {
        Row: {
          id: string
          booking_id: string
          slot_date: string
          slot_time: string
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          slot_date: string
          slot_time: string
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          slot_date?: string
          slot_time?: string
          created_at?: string
        }
      }
      worker_settings: {
        Row: {
          id: string
          worker_id: string
          auto_accept_bookings: boolean
          buffer_time_minutes: number
          advance_booking_days: number
          minimum_notice_hours: number
          max_bookings_per_day: number
          email_notifications: boolean
          sms_notifications: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          worker_id: string
          auto_accept_bookings?: boolean
          buffer_time_minutes?: number
          advance_booking_days?: number
          minimum_notice_hours?: number
          max_bookings_per_day?: number
          email_notifications?: boolean
          sms_notifications?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          worker_id?: string
          auto_accept_bookings?: boolean
          buffer_time_minutes?: number
          advance_booking_days?: number
          minimum_notice_hours?: number
          max_bookings_per_day?: number
          email_notifications?: boolean
          sms_notifications?: boolean
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
