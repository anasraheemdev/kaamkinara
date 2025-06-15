"use client"

import { useState, useEffect } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TimeSlotPicker } from "./time-slot-picker-supabase"
import { BookingService } from "@/lib/supabase/booking-service"
import { CalendarDays, Clock, MapPin, User, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface BookingCalendarSupabaseProps {
  userRole?: "customer" | "worker"
  userId: string
  onBookingConfirm?: (date: Date, time: string, workerId?: string) => void
}

export function BookingCalendarSupabase({
  userRole = "customer",
  userId,
  onBookingConfirm,
}: BookingCalendarSupabaseProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedWorker, setSelectedWorker] = useState<string | null>(null)
  const [availableWorkers, setAvailableWorkers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [stats, setStats] = useState({
    todaySlots: 0,
    weekSlots: 0,
    todayBookings: 0,
  })

  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  useEffect(() => {
    loadAvailableWorkers()
    loadStats()
  }, [])

  const loadAvailableWorkers = async () => {
    try {
      const workers = await BookingService.getAvailableWorkers()
      setAvailableWorkers(workers)
    } catch (error) {
      console.error("Error loading workers:", error)
      toast.error("Failed to load available workers")
    }
  }

  const loadStats = async () => {
    try {
      if (userRole === "worker") {
        // For workers, show their booking stats
        const bookingStats = await BookingService.getBookingStats(userId, "worker")
        setStats({
          todaySlots: 12, // Mock data - could be calculated from availability
          weekSlots: 45,
          todayBookings: bookingStats.confirmed,
        })
      } else {
        // For customers, show available slots
        setStats({
          todaySlots: 12,
          weekSlots: 45,
          todayBookings: 0,
        })
      }
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null)
    setSelectedTime(null) // Reset time when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleWorkerSelect = (workerId: string) => {
    setSelectedWorker(workerId)
    setSelectedTime(null) // Reset time when worker changes
  }

  const handleConfirmBooking = async () => {
    if (!selectedDate || !selectedTime) {
      toast.error("Please select a date and time")
      return
    }

    if (userRole === "customer" && !selectedWorker) {
      toast.error("Please select a worker")
      return
    }

    setLoading(true)
    try {
      const workerId = userRole === "customer" ? selectedWorker : userId

      if (onBookingConfirm) {
        onBookingConfirm(selectedDate, selectedTime, workerId!)
      }

      toast.success("Booking confirmed successfully!")

      // Reset form
      setSelectedDate(null)
      setSelectedTime(null)
      setSelectedWorker(null)

      // Reload stats
      loadStats()
    } catch (error) {
      console.error("Error confirming booking:", error)
      toast.error("Failed to confirm booking")
    } finally {
      setLoading(false)
    }
  }

  // Mock data for dates with bookings - in real app, this would come from Supabase
  const bookedDates = [new Date(2024, 0, 15), new Date(2024, 0, 18), new Date(2024, 0, 22)]
  const busyDates = [new Date(2024, 0, 16), new Date(2024, 0, 20), new Date(2024, 0, 24)]

  const modifiers = {
    booked: bookedDates,
    busy: busyDates,
  }

  const modifiersStyles = {
    booked: {
      backgroundColor: "#ef4444",
      color: "white",
    },
    busy: {
      backgroundColor: "#f59e0b",
      color: "white",
    },
  }

  return (
    <div className="space-y-6">
      {/* Calendar Header */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5" />
            {userRole === "customer" ? "Book a Service" : "Manage Schedule"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Calendar */}
            <div className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate || undefined}
                onSelect={handleDateSelect}
                disabled={(date) => date < today || date > nextMonth}
                modifiers={modifiers}
                modifiersStyles={modifiersStyles}
                className="rounded-md border"
              />

              {/* Legend */}
              <div className="flex flex-wrap gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-primary rounded"></div>
                  <span>Selected</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded"></div>
                  <span>Fully Booked</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                  <span>Limited Availability</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-gray-200 rounded"></div>
                  <span>Available</span>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-4">
              <h3 className="font-semibold">Quick Overview</h3>

              {userRole === "customer" ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Available Today</span>
                    </div>
                    <Badge variant="secondary">{stats.todaySlots} slots</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-green-600" />
                      <span className="text-sm">This Week</span>
                    </div>
                    <Badge variant="secondary">{stats.weekSlots} slots</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-purple-600" />
                      <span className="text-sm">Service Area</span>
                    </div>
                    <Badge variant="secondary">5 km radius</Badge>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-blue-600" />
                      <span className="text-sm">Today's Bookings</span>
                    </div>
                    <Badge variant="secondary">{stats.todayBookings} jobs</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span className="text-sm">Available Hours</span>
                    </div>
                    <Badge variant="secondary">6 hours</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-yellow-600" />
                      <span className="text-sm">This Week</span>
                    </div>
                    <Badge variant="secondary">18 bookings</Badge>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Worker Selection (for customers) */}
      {userRole === "customer" && (
        <Card>
          <CardHeader>
            <CardTitle>Select a Worker</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={selectedWorker || ""} onValueChange={handleWorkerSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a service provider" />
              </SelectTrigger>
              <SelectContent>
                {availableWorkers.map((worker) => (
                  <SelectItem key={worker.id} value={worker.id}>
                    <div className="flex items-center gap-2">
                      <span>{worker.user?.full_name}</span>
                      <span className="text-sm text-muted-foreground">
                        ({worker.service_category}) - ⭐ {worker.rating}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}

      {/* Time Slot Picker */}
      <TimeSlotPicker
        selectedDate={selectedDate}
        onTimeSelect={handleTimeSelect}
        selectedTime={selectedTime}
        userRole={userRole}
        workerId={userRole === "customer" ? selectedWorker : userId}
      />

      {/* Booking Confirmation */}
      {selectedDate && selectedTime && (userRole === "worker" || selectedWorker) && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">
                  {userRole === "customer" ? "Ready to Book?" : "Confirm Availability"}
                </h3>
                <p className="text-muted-foreground">
                  {userRole === "customer" ? "Confirm your booking for" : "Set availability for"}{" "}
                  {selectedDate.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
              <Button onClick={handleConfirmBooking} size="lg" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {userRole === "customer" ? "Confirm Booking" : "Set Available"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
