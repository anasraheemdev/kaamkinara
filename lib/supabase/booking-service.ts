import { supabase } from "./client"
import type { Database } from "./client"

type Booking = Database["public"]["Tables"]["bookings"]["Row"]
type BookingInsert = Database["public"]["Tables"]["bookings"]["Insert"]
type BookingUpdate = Database["public"]["Tables"]["bookings"]["Update"]
type WorkerProfile = Database["public"]["Tables"]["worker_profiles"]["Row"]
type WorkerAvailability = Database["public"]["Tables"]["worker_availability"]["Row"]
type Service = Database["public"]["Tables"]["services"]["Row"]

export interface BookingWithDetails extends Booking {
  customer: {
    full_name: string
    avatar_url: string | null
  }
  worker: {
    full_name: string
    avatar_url: string | null
    service_category: string
    rating: number
  }
  service?: {
    title: string
    category: string
  }
}

export interface TimeSlot {
  time: string
  available: boolean
  price?: string
  duration?: string
  bookedBy?: string
  bookingId?: string
}

export class BookingService {
  // Get bookings for a user (customer or worker)
  static async getUserBookings(userId: string, userRole: "customer" | "worker"): Promise<BookingWithDetails[]> {
    const query = supabase
      .from("bookings")
      .select(`
        *,
        customer:users!customer_id(full_name, avatar_url),
        worker:worker_profiles!worker_id(
          full_name:users(full_name),
          avatar_url:users(avatar_url),
          service_category,
          rating
        ),
        service:services(title, category)
      `)
      .order("booking_date", { ascending: true })
      .order("start_time", { ascending: true })

    if (userRole === "customer") {
      query.eq("customer_id", userId)
    } else {
      // For workers, we need to get their worker profile first
      const { data: workerProfile } = await supabase.from("worker_profiles").select("id").eq("user_id", userId).single()

      if (workerProfile) {
        query.eq("worker_id", workerProfile.id)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching bookings:", error)
      throw error
    }

    return data as BookingWithDetails[]
  }

  // Get worker availability for a specific date
  static async getWorkerAvailability(workerId: string, date: Date): Promise<TimeSlot[]> {
    const dayOfWeek = date.getDay()

    // Get worker's general availability for this day
    const { data: availability, error: availabilityError } = await supabase
      .from("worker_availability")
      .select("*")
      .eq("worker_id", workerId)
      .eq("day_of_week", dayOfWeek)
      .eq("is_available", true)

    if (availabilityError) {
      console.error("Error fetching availability:", availabilityError)
      return []
    }

    if (!availability || availability.length === 0) {
      return []
    }

    // Get booked time slots for this date
    const { data: bookedSlots, error: bookedError } = await supabase
      .from("booking_time_slots")
      .select(`
        slot_time,
        booking:bookings!booking_id(
          id,
          customer:users!customer_id(full_name)
        )
      `)
      .eq("slot_date", date.toISOString().split("T")[0])
      .in(
        "booking_id",
        await supabase
          .from("bookings")
          .select("id")
          .eq("worker_id", workerId)
          .in("status", ["confirmed", "in_progress"])
          .then(({ data }) => data?.map((b) => b.id) || []),
      )

    if (bookedError) {
      console.error("Error fetching booked slots:", bookedError)
    }

    // Generate time slots
    const timeSlots: TimeSlot[] = []
    const bookedTimes = new Set(bookedSlots?.map((slot) => slot.slot_time) || [])

    for (const avail of availability) {
      const startTime = new Date(`2000-01-01T${avail.start_time}`)
      const endTime = new Date(`2000-01-01T${avail.end_time}`)

      const currentTime = new Date(startTime)

      while (currentTime < endTime) {
        const timeString = currentTime.toTimeString().slice(0, 5)
        const isBooked = bookedTimes.has(timeString)

        timeSlots.push({
          time: timeString,
          available: !isBooked,
          price: isBooked ? undefined : "Rs. 800",
          duration: isBooked ? undefined : "2 hrs",
          bookedBy: isBooked
            ? bookedSlots?.find((slot) => slot.slot_time === timeString)?.booking?.customer?.full_name
            : undefined,
        })

        currentTime.setMinutes(currentTime.getMinutes() + 30)
      }
    }

    return timeSlots
  }

  // Create a new booking
  static async createBooking(bookingData: BookingInsert): Promise<Booking> {
    const { data, error } = await supabase.from("bookings").insert(bookingData).select().single()

    if (error) {
      console.error("Error creating booking:", error)
      throw error
    }

    // Create time slots for the booking
    await this.createBookingTimeSlots(data.id, data.booking_date, data.start_time, data.end_time)

    return data
  }

  // Create time slots for a booking
  static async createBookingTimeSlots(bookingId: string, date: string, startTime: string, endTime: string) {
    const slots = []
    const start = new Date(`2000-01-01T${startTime}`)
    const end = new Date(`2000-01-01T${endTime}`)

    const current = new Date(start)
    while (current < end) {
      slots.push({
        booking_id: bookingId,
        slot_date: date,
        slot_time: current.toTimeString().slice(0, 5),
      })
      current.setMinutes(current.getMinutes() + 30)
    }

    const { error } = await supabase.from("booking_time_slots").insert(slots)

    if (error) {
      console.error("Error creating booking time slots:", error)
    }
  }

  // Update booking status
  static async updateBookingStatus(bookingId: string, status: Booking["status"]): Promise<void> {
    const { error } = await supabase
      .from("bookings")
      .update({ status, updated_at: new Date().toISOString() })
      .eq("id", bookingId)

    if (error) {
      console.error("Error updating booking status:", error)
      throw error
    }
  }

  // Get worker profiles with availability
  static async getAvailableWorkers(category?: string): Promise<WorkerProfile[]> {
    let query = supabase
      .from("worker_profiles")
      .select(`
        *,
        user:users(full_name, avatar_url)
      `)
      .eq("is_available", true)
      .eq("is_verified", true)

    if (category) {
      query = query.eq("service_category", category)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching workers:", error)
      throw error
    }

    return data || []
  }

  // Get worker settings
  static async getWorkerSettings(workerId: string) {
    const { data, error } = await supabase.from("worker_settings").select("*").eq("worker_id", workerId).single()

    if (error && error.code !== "PGRST116") {
      // Not found error
      console.error("Error fetching worker settings:", error)
      throw error
    }

    return data
  }

  // Update worker availability
  static async updateWorkerAvailability(workerId: string, availability: Partial<WorkerAvailability>[]) {
    // Delete existing availability
    await supabase.from("worker_availability").delete().eq("worker_id", workerId)

    // Insert new availability
    const { error } = await supabase
      .from("worker_availability")
      .insert(availability.map((avail) => ({ ...avail, worker_id: workerId })))

    if (error) {
      console.error("Error updating worker availability:", error)
      throw error
    }
  }

  // Get booking statistics
  static async getBookingStats(userId: string, userRole: "customer" | "worker") {
    let query = supabase.from("bookings").select("status, amount, booking_date")

    if (userRole === "customer") {
      query = query.eq("customer_id", userId)
    } else {
      // Get worker profile first
      const { data: workerProfile } = await supabase.from("worker_profiles").select("id").eq("user_id", userId).single()

      if (workerProfile) {
        query = query.eq("worker_id", workerProfile.id)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching booking stats:", error)
      return {
        total: 0,
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
        totalAmount: 0,
      }
    }

    const stats = {
      total: data.length,
      pending: data.filter((b) => b.status === "pending").length,
      confirmed: data.filter((b) => b.status === "confirmed").length,
      completed: data.filter((b) => b.status === "completed").length,
      cancelled: data.filter((b) => b.status === "cancelled").length,
      totalAmount: data.reduce((sum, b) => sum + b.amount, 0),
    }

    return stats
  }
}
