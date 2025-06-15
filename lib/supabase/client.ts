import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

export const supabase = createClientComponentClient()

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone: string | null
          role: "customer" | "worker" | "admin"
          city: string | null
          address: string | null
          avatar_url: string | null
          is_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role: "customer" | "worker" | "admin"
          city?: string | null
          address?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: "customer" | "worker" | "admin"
          city?: string | null
          address?: string | null
          avatar_url?: string | null
          is_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      worker_profiles: {
        Row: {
          id: string
          user_id: string
          cnic: string | null
          skills: string[]
          experience_level: string | null
          bio: string | null
          hourly_rate: number | null
          rating: number
          total_jobs: number
          profile_photo_url: string | null
          cnic_photo_url: string | null
          is_available: boolean
          verification_status: "pending" | "verified" | "rejected"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          cnic?: string | null
          skills?: string[]
          experience_level?: string | null
          bio?: string | null
          hourly_rate?: number | null
          rating?: number
          total_jobs?: number
          profile_photo_url?: string | null
          cnic_photo_url?: string | null
          is_available?: boolean
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          cnic?: string | null
          skills?: string[]
          experience_level?: string | null
          bio?: string | null
          hourly_rate?: number | null
          rating?: number
          total_jobs?: number
          profile_photo_url?: string | null
          cnic_photo_url?: string | null
          is_available?: boolean
          verification_status?: "pending" | "verified" | "rejected"
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
