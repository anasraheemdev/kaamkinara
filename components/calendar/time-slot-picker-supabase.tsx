"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookingService, type TimeSlot } from "@/lib/supabase/booking-service"
import { Clock, Users, Loader2 } from "lucide-react"

interface TimeSlotPickerSupabaseProps {
  selectedDate: Date | null
  onTimeSelect: (time: string) => void
  selectedTime: string | null
  userRole?: "customer" | "worker"
  workerId?: string | null
}

export function TimeSlotPicker({
  selectedDate,
  onTimeSelect,
  selectedTime,
  userRole = "customer",
  workerId,
}: TimeSlotPickerSupabaseProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"morning" | "afternoon" | "evening">("morning")
  const [timeSlots, setTimeSlots] = useState<Record<string, TimeSlot[]>>({
    morning: [],
    afternoon: [],
    evening: [],
  })
  const [loading, setLoading] = useState(false)

  const periods = [
    { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", time: "12:00 PM - 5:00 PM", icon: "☀️" },
    { id: "evening", label: "Evening", time: "5:00 PM - 8:00 PM", icon: "🌆" },
  ]

  useEffect(() => {
    if (selectedDate && workerId) {
      loadTimeSlots()
    }
  }, [selectedDate, workerId])

  const loadTimeSlots = async () => {
    if (!selectedDate || !workerId) return

    setLoading(true)
    try {
      const slots = await BookingService.getWorkerAvailability(workerId, selectedDate)

      // Group slots by period
      const groupedSlots = {
        morning: slots.filter((slot) => {
          const hour = Number.parseInt(slot.time.split(":")[0])
          return hour >= 8 && hour < 12
        }),
        afternoon: slots.filter((slot) => {
          const hour = Number.parseInt(slot.time.split(":")[0])
          return hour >= 12 && hour < 17
        }),
        evening: slots.filter((slot) => {
          const hour = Number.parseInt(slot.time.split(":")[0])
          return hour >= 17 && hour < 20
        }),
      }

      setTimeSlots(groupedSlots)
    } catch (error) {
      console.error("Error loading time slots:", error)
      setTimeSlots({ morning: [], afternoon: [], evening: [] })
    } finally {
      setLoading(false)
    }
  }

  if (!selectedDate) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Select a Date</h3>
          <p className="text-muted-foreground">Choose a date from the calendar to view available time slots</p>
        </CardContent>
      </Card>
    )
  }

  if (!workerId && userRole === "customer") {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="font-semibold mb-2">Select a Worker</h3>
          <p className="text-muted-foreground">Choose a service provider to view their available time slots</p>
        </CardContent>
      </Card>
    )
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const getAvailableCount = (period: string) => {
    return timeSlots[period].filter((slot) => slot.available).length
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Available Times for {formatDate(selectedDate)}
            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading time slots...</span>
            </div>
          ) : (
            <>
              {/* Period Selector */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                {periods.map((period) => (
                  <Button
                    key={period.id}
                    variant={selectedPeriod === period.id ? "default" : "outline"}
                    className="h-auto p-4 flex flex-col items-center space-y-2"
                    onClick={() => setSelectedPeriod(period.id as any)}
                  >
                    <span className="text-2xl">{period.icon}</span>
                    <div className="text-center">
                      <div className="font-semibold">{period.label}</div>
                      <div className="text-xs opacity-75">{period.time}</div>
                      <Badge variant="secondary" className="mt-1">
                        {getAvailableCount(period.id)} available
                      </Badge>
                    </div>
                  </Button>
                ))}
              </div>

              {/* Time Slots */}
              {timeSlots[selectedPeriod].length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {timeSlots[selectedPeriod].map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? "default" : slot.available ? "outline" : "secondary"}
                      disabled={!slot.available}
                      onClick={() => slot.available && onTimeSelect(slot.time)}
                      className={`h-auto p-3 flex flex-col items-center space-y-1 ${!slot.available ? "opacity-50" : ""}`}
                    >
                      <div className="font-semibold">{slot.time}</div>
                      {slot.available ? (
                        userRole === "customer" && (
                          <>
                            <div className="text-xs text-green-600">{slot.price}</div>
                            <div className="text-xs opacity-75">{slot.duration}</div>
                          </>
                        )
                      ) : (
                        <div className="text-xs text-red-600 flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {userRole === "worker" ? slot.bookedBy : "Booked"}
                        </div>
                      )}
                    </Button>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No slots available</h3>
                  <p className="text-muted-foreground">
                    No time slots available for {periods.find((p) => p.id === selectedPeriod)?.label.toLowerCase()} on
                    this date
                  </p>
                </div>
              )}

              {/* Selected Time Summary */}
              {selectedTime && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-blue-900">Selected Time Slot</h4>
                      <p className="text-blue-700">
                        {formatDate(selectedDate)} at {selectedTime}
                      </p>
                    </div>
                    <div className="text-right">
                      {userRole === "customer" && (
                        <>
                          <div className="font-semibold text-green-600">
                            {timeSlots[selectedPeriod].find((s) => s.time === selectedTime)?.price}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {timeSlots[selectedPeriod].find((s) => s.time === selectedTime)?.duration}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
