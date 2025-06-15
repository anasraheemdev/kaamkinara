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
          profile_image: string | null
          date_of_birth: string | null
          gender: string | null
          bio: string | null
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
          profile_image?: string | null
          date_of_birth?: string | null
          gender?: string | null
          bio?: string | null
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
          profile_image?: string | null
          date_of_birth?: string | null
          gender?: string | null
          bio?: string | null
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
          service_radius: number
          languages: string[]
          portfolio_images: string[]
          certifications: string[]
          verification_status: "pending" | "verified" | "rejected"
          rating: number
          total_jobs: number
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
          service_radius?: number
          languages?: string[]
          portfolio_images?: string[]
          certifications?: string[]
          verification_status?: "pending" | "verified" | "rejected"
          rating?: number
          total_jobs?: number
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
          service_radius?: number
          languages?: string[]
          portfolio_images?: string[]
          certifications?: string[]
          verification_status?: "pending" | "verified" | "rejected"
          rating?: number
          total_jobs?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
