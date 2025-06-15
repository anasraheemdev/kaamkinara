"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { TimeSlotPicker } from "./time-slot-picker"
import { CalendarDays, Clock, MapPin, User } from "lucide-react"

interface BookingCalendarProps {
  userRole?: "customer" | "worker"
  onBookingConfirm?: (date: Date, time: string) => void
}

export function BookingCalendar({ userRole = "customer", onBookingConfirm }: BookingCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)

  const today = new Date()
  const nextMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0)

  // Mock data for dates with bookings
  const bookedDates = [new Date(2024, 0, 15), new Date(2024, 0, 18), new Date(2024, 0, 22), new Date(2024, 0, 25)]

  const busyDates = [new Date(2024, 0, 16), new Date(2024, 0, 20), new Date(2024, 0, 24)]

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date || null)
    setSelectedTime(null) // Reset time when date changes
  }

  const handleTimeSelect = (time: string) => {
    setSelectedTime(time)
  }

  const handleConfirmBooking = () => {
    if (selectedDate && selectedTime && onBookingConfirm) {
      onBookingConfirm(selectedDate, selectedTime)
    }
  }

  const isDateBooked = (date: Date) => {
    return bookedDates.some((bookedDate) => bookedDate.toDateString() === date.toDateString())
  }

  const isDateBusy = (date: Date) => {
    return busyDates.some((busyDate) => busyDate.toDateString() === date.toDateString())
  }

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
                    <Badge variant="secondary">12 slots</Badge>
                  </div>

                  <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CalendarDays className="h-4 w-4 text-green-600" />
                      <span className="text-sm">This Week</span>
                    </div>
                    <Badge variant="secondary">45 slots</Badge>
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
                    <Badge variant="secondary">3 jobs</Badge>
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

      {/* Time Slot Picker */}
      <TimeSlotPicker
        selectedDate={selectedDate}
        onTimeSelect={handleTimeSelect}
        selectedTime={selectedTime}
        userRole={userRole}
      />

      {/* Booking Confirmation */}
      {selectedDate && selectedTime && userRole === "customer" && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold mb-2">Ready to Book?</h3>
                <p className="text-muted-foreground">
                  Confirm your booking for {selectedDate.toLocaleDateString()} at {selectedTime}
                </p>
              </div>
              <Button onClick={handleConfirmBooking} size="lg">
                Confirm Booking
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
