import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"

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
          role: string
          city: string | null
          address: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          first_name: string
          last_name: string
          phone?: string | null
          role: string
          city?: string | null
          address?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string
          last_name?: string
          phone?: string | null
          role?: string
          city?: string | null
          address?: string | null
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
          verification_status: string
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
          verification_status?: string
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
          verification_status?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export const supabase = createClientComponentClient<Database>()

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) {
      console.error("Error getting current user:", error)
      throw error
    }
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Helper function to get user profile with better error handling
export async function getUserProfile(userId: string) {
  try {
    console.log("Fetching profile for user:", userId)

    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) {
      console.error("Profile fetch error:", error)

      // If no rows returned, user profile doesn't exist
      if (error.code === "PGRST116") {
        throw new Error("User profile not found")
      }
      throw error
    }

    console.log("Profile fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    throw error
  }
}

// Helper function to get worker profile
export async function getWorkerProfile(userId: string) {
  try {
    console.log("Fetching worker profile for user:", userId)

    const { data, error } = await supabase.from("worker_profiles").select("*").eq("user_id", userId).single()

    if (error) {
      console.error("Worker profile fetch error:", error)

      // If no rows returned, worker profile doesn't exist
      if (error.code === "PGRST116") {
        throw new Error("Worker profile not found")
      }
      throw error
    }

    console.log("Worker profile fetched successfully:", data)
    return data
  } catch (error) {
    console.error("Error getting worker profile:", error)
    throw error
  }
}

// Helper function to create or update user profile
export async function upsertUserProfile(userData: Database["public"]["Tables"]["users"]["Insert"]) {
  try {
    console.log("Upserting user profile:", userData)

    const { data, error } = await supabase.from("users").upsert(userData, { onConflict: "id" }).select().single()

    if (error) {
      console.error("Profile upsert error:", error)
      throw error
    }

    console.log("Profile upserted successfully:", data)
    return data
  } catch (error) {
    console.error("Error upserting user profile:", error)
    throw error
  }
}
