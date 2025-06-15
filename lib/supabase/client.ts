import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "./database.types"

export const supabase = createClientComponentClient<Database>()

// Helper function to get current user
export async function getCurrentUser() {
  try {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()
    if (error) throw error
    return user
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

// Helper function to get user profile
export async function getUserProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting user profile:", error)
    return null
  }
}

// Helper function to get worker profile
export async function getWorkerProfile(userId: string) {
  try {
    const { data, error } = await supabase.from("worker_profiles").select("*").eq("user_id", userId).single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error getting worker profile:", error)
    return null
  }
}

export type { Database }
