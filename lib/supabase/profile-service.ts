import { supabase } from "@/lib/supabase/client"

export interface UserProfile {
  id: string
  email: string
  first_name: string
  last_name: string
  phone?: string
  city?: string
  address?: string
  profile_image?: string
  date_of_birth?: string
  gender?: string
  bio?: string
  role: "customer" | "worker" | "admin"
  is_verified: boolean
  created_at: string
  updated_at: string
}

export interface WorkerProfile {
  id: string
  user_id: string
  cnic?: string
  skills: string[]
  experience_level?: string
  bio?: string
  hourly_rate?: number
  availability_hours: Record<string, any>
  service_radius: number
  portfolio_images: string[]
  certifications: string[]
  languages: string[]
  verification_status: string
  rating: number
  total_jobs: number
  created_at: string
  updated_at: string
}

export interface UserSettings {
  id: string
  user_id: string
  notifications_enabled: boolean
  email_notifications: boolean
  sms_notifications: boolean
  push_notifications: boolean
  marketing_emails: boolean
  language: string
  timezone: string
  theme: string
  privacy_profile: string
  two_factor_enabled: boolean
}

export interface UserAddress {
  id: string
  user_id: string
  label: string
  address_line_1: string
  address_line_2?: string
  city: string
  state?: string
  postal_code?: string
  country: string
  is_default: boolean
}

export class ProfileService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching user profile:", error)
      return null
    }
  }

  static async updateUserProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    try {
      const { error } = await supabase.from("users").update(updates).eq("id", userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating user profile:", error)
      return false
    }
  }

  static async getWorkerProfile(userId: string): Promise<WorkerProfile | null> {
    try {
      const { data, error } = await supabase.from("worker_profiles").select("*").eq("user_id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching worker profile:", error)
      return null
    }
  }

  static async updateWorkerProfile(userId: string, updates: Partial<WorkerProfile>): Promise<boolean> {
    try {
      const { error } = await supabase.from("worker_profiles").update(updates).eq("user_id", userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating worker profile:", error)
      return false
    }
  }

  static async getUserSettings(userId: string): Promise<UserSettings | null> {
    try {
      const { data, error } = await supabase.from("user_settings").select("*").eq("user_id", userId).single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching user settings:", error)
      return null
    }
  }

  static async updateUserSettings(userId: string, updates: Partial<UserSettings>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from("user_settings")
        .upsert({ user_id: userId, ...updates })
        .eq("user_id", userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating user settings:", error)
      return false
    }
  }

  static async getUserAddresses(userId: string): Promise<UserAddress[]> {
    try {
      const { data, error } = await supabase
        .from("user_addresses")
        .select("*")
        .eq("user_id", userId)
        .order("is_default", { ascending: false })

      if (error) throw error
      return data || []
    } catch (error) {
      console.error("Error fetching user addresses:", error)
      return []
    }
  }

  static async addUserAddress(userId: string, address: Omit<UserAddress, "id" | "user_id">): Promise<boolean> {
    try {
      // If this is the default address, unset other defaults
      if (address.is_default) {
        await supabase.from("user_addresses").update({ is_default: false }).eq("user_id", userId)
      }

      const { error } = await supabase.from("user_addresses").insert({ user_id: userId, ...address })

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error adding user address:", error)
      return false
    }
  }

  static async updateUserAddress(addressId: string, updates: Partial<UserAddress>): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_addresses").update(updates).eq("id", addressId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error updating user address:", error)
      return false
    }
  }

  static async deleteUserAddress(addressId: string): Promise<boolean> {
    try {
      const { error } = await supabase.from("user_addresses").delete().eq("id", addressId)

      if (error) throw error
      return true
    } catch (error) {
      console.error("Error deleting user address:", error)
      return false
    }
  }

  static async uploadProfileImage(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${userId}-${Math.random()}.${fileExt}`
      const filePath = `profile-images/${fileName}`

      const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

      if (uploadError) throw uploadError

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

      return data.publicUrl
    } catch (error) {
      console.error("Error uploading profile image:", error)
      return null
    }
  }
}
