"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, Users } from "lucide-react"

interface TimeSlot {
  time: string
  available: boolean
  price?: string
  duration?: string
  bookedBy?: string
}

interface TimeSlotPickerProps {
  selectedDate: Date | null
  onTimeSelect: (time: string) => void
  selectedTime: string | null
  userRole?: "customer" | "worker"
}

export function TimeSlotPicker({
  selectedDate,
  onTimeSelect,
  selectedTime,
  userRole = "customer",
}: TimeSlotPickerProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<"morning" | "afternoon" | "evening">("morning")

  const timeSlots: Record<string, TimeSlot[]> = {
    morning: [
      { time: "08:00", available: true, price: "Rs. 800", duration: "2 hrs" },
      { time: "08:30", available: true, price: "Rs. 800", duration: "2 hrs" },
      { time: "09:00", available: false, bookedBy: "Sarah Ahmed" },
      { time: "09:30", available: true, price: "Rs. 800", duration: "2 hrs" },
      { time: "10:00", available: true, price: "Rs. 800", duration: "2 hrs" },
      { time: "10:30", available: false, bookedBy: "Ali Hassan" },
      { time: "11:00", available: true, price: "Rs. 800", duration: "2 hrs" },
      { time: "11:30", available: true, price: "Rs. 800", duration: "2 hrs" },
    ],
    afternoon: [
      { time: "12:00", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "12:30", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "13:00", available: false, bookedBy: "Muhammad Khan" },
      { time: "13:30", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "14:00", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "14:30", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "15:00", available: false, bookedBy: "Fatima Sheikh" },
      { time: "15:30", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "16:00", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "16:30", available: true, price: "Rs. 900", duration: "2 hrs" },
      { time: "17:00", available: true, price: "Rs. 900", duration: "2 hrs" },
    ],
    evening: [
      { time: "17:30", available: true, price: "Rs. 1000", duration: "2 hrs" },
      { time: "18:00", available: true, price: "Rs. 1000", duration: "2 hrs" },
      { time: "18:30", available: false, bookedBy: "Hassan Ahmed" },
      { time: "19:00", available: true, price: "Rs. 1000", duration: "2 hrs" },
      { time: "19:30", available: true, price: "Rs. 1000", duration: "2 hrs" },
      { time: "20:00", available: true, price: "Rs. 1000", duration: "2 hrs" },
    ],
  }

  const periods = [
    { id: "morning", label: "Morning", time: "8:00 AM - 12:00 PM", icon: "🌅" },
    { id: "afternoon", label: "Afternoon", time: "12:00 PM - 5:00 PM", icon: "☀️" },
    { id: "evening", label: "Evening", time: "5:00 PM - 8:00 PM", icon: "🌆" },
  ]

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
          </CardTitle>
        </CardHeader>
        <CardContent>
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
        </CardContent>
      </Card>
    </div>
  )
}
