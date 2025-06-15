import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/client"

type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
type WorkerProfileInsert = Database["public"]["Tables"]["worker_profiles"]["Insert"]

export interface SignUpData {
  email: string
  password: string
  firstName: string
  lastName: string
  phone?: string
  role: "customer" | "worker"
  city?: string
  address?: string
  // Worker-specific fields
  cnic?: string
  skills?: string[]
  experienceLevel?: string
  bio?: string
}

export interface SignInData {
  email: string
  password: string
}

export class AuthService {
  static async signUp(data: SignUpData) {
    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            first_name: data.firstName,
            last_name: data.lastName,
            role: data.role,
          },
        },
      })

      if (authError) {
        throw authError
      }

      if (!authData.user) {
        throw new Error("User creation failed")
      }

      // Update user profile with additional data
      const userUpdate: Partial<UserInsert> = {
        phone: data.phone,
        city: data.city,
        address: data.address,
      }

      const { error: profileError } = await supabase.from("users").update(userUpdate).eq("id", authData.user.id)

      if (profileError) {
        console.error("Profile update error:", profileError)
      }

      // If user is a worker, create worker profile
      if (data.role === "worker") {
        const workerProfile: WorkerProfileInsert = {
          user_id: authData.user.id,
          cnic: data.cnic,
          skills: data.skills || [],
          experience_level: data.experienceLevel,
          bio: data.bio,
          verification_status: "pending",
        }

        const { error: workerError } = await supabase.from("worker_profiles").insert(workerProfile)

        if (workerError) {
          console.error("Worker profile creation error:", workerError)
          throw workerError
        }
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    }
  }

  static async signIn(data: SignInData) {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        throw error
      }

      return { user: authData.user, session: authData.session }
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        throw error
      }
    } catch (error) {
      console.error("Sign out error:", error)
      throw error
    }
  }

  static async getCurrentUser() {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()
      if (error) {
        throw error
      }
      return user
    } catch (error) {
      console.error("Get current user error:", error)
      return null
    }
  }

  static async getUserProfile(userId: string) {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Get user profile error:", error)
      return null
    }
  }

  static async getWorkerProfile(userId: string) {
    try {
      const { data, error } = await supabase.from("worker_profiles").select("*").eq("user_id", userId).single()

      if (error) {
        throw error
      }

      return data
    } catch (error) {
      console.error("Get worker profile error:", error)
      return null
    }
  }
}
