"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookingCalendarSupabase } from "@/components/calendar/booking-calendar-supabase"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookingService, type BookingWithDetails } from "@/lib/supabase/booking-service"
import { Calendar, Clock, MapPin, User, CheckCircle, Edit, MessageCircle, Phone, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function CustomerSchedulePage() {
  const [activeTab, setActiveTab] = useState("calendar")
  const [loading, setLoading] = useState(false)
  const [upcomingBookings, setUpcomingBookings] = useState<BookingWithDetails[]>([])
  const [pastBookings, setPastBookings] = useState<BookingWithDetails[]>([])
  const [stats, setStats] = useState({
    upcoming: 0,
    completed: 0,
    pending: 0,
    totalSpent: 0,
  })

  // Mock user ID - in real app, this would come from auth context
  const userId = "550e8400-e29b-41d4-a716-446655440001"

  useEffect(() => {
    loadBookings()
    loadStats()
  }, [])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const bookings = await BookingService.getUserBookings(userId, "customer")

      const today = new Date().toISOString().split("T")[0]
      const upcoming = bookings.filter((booking) => booking.booking_date >= today && booking.status !== "completed")
      const past = bookings.filter((booking) => booking.status === "completed")

      setUpcomingBookings(upcoming)
      setPastBookings(past)
    } catch (error) {
      console.error("Error loading bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const bookingStats = await BookingService.getBookingStats(userId, "customer")
      setStats({
        upcoming: bookingStats.confirmed,
        completed: bookingStats.completed,
        pending: bookingStats.pending,
        totalSpent: bookingStats.totalAmount,
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleBookingConfirm = async (date: Date, time: string, workerId?: string) => {
    if (!workerId) {
      toast.error("Please select a worker")
      return
    }

    try {
      const endTime = new Date(`2000-01-01T${time}`)
      endTime.setHours(endTime.getHours() + 2) // 2 hour duration

      const bookingData = {
        customer_id: userId,
        worker_id: workerId,
        title: "Service Booking",
        description: "Service booking made through calendar",
        booking_date: date.toISOString().split("T")[0],
        start_time: time,
        end_time: endTime.toTimeString().slice(0, 5),
        duration_hours: 2,
        location: "Customer Location",
        amount: 1600, // 2 hours * Rs. 800
        status: "pending" as const,
      }

      await BookingService.createBooking(bookingData)
      toast.success("Booking created successfully!")

      // Reload bookings
      loadBookings()
      loadStats()
    } catch (error) {
      console.error("Error creating booking:", error)
      toast.error("Failed to create booking")
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const BookingCard = ({ booking, showActions = true }: { booking: BookingWithDetails; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.worker.avatar_url || "/placeholder.svg?height=48&width=48"} />
              <AvatarFallback>
                {booking.worker.full_name
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{booking.title}</h4>
              <p className="text-sm text-muted-foreground">{booking.worker.full_name}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex items-center">
                  <span className="text-xs">⭐</span>
                  <span className="text-xs ml-1">{booking.worker.rating}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{new Date(booking.booking_date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.start_time} ({booking.duration_hours}h)
            </span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">Rs. {booking.amount}</span>
          {showActions && (
            <div className="flex space-x-2">
              <Button size="sm" variant="outline">
                <Phone className="h-3 w-3 mr-1" />
                Call
              </Button>
              <Button size="sm" variant="outline">
                <MessageCircle className="h-3 w-3 mr-1" />
                Chat
              </Button>
              {booking.status === "confirmed" && (
                <Button size="sm" variant="outline">
                  <Edit className="h-3 w-3 mr-1" />
                  Reschedule
                </Button>
              )}
            </div>
          )}
        </div>

        {booking.customer_rating && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your rating:</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < booking.customer_rating! ? "text-yellow-400" : "text-gray-300"}>
                    ⭐
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole="customer" userName="John Doe">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Schedule</h1>
            <p className="text-muted-foreground">Manage your bookings and schedule new services</p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Calendar className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Upcoming</p>
                  <p className="text-2xl font-bold">{stats.upcoming}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Completed</p>
                  <p className="text-2xl font-bold">{stats.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Spent</p>
                  <p className="text-2xl font-bold">Rs. {stats.totalSpent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="calendar">Book Service</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="space-y-4">
            <BookingCalendarSupabase userRole="customer" userId={userId} onBookingConfirm={handleBookingConfirm} />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <Badge variant="secondary">{upcomingBookings.length} bookings</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading bookings...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {upcomingBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} />
                ))}
              </div>
            )}

            {!loading && upcomingBookings.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No upcoming bookings</h3>
                  <p className="text-muted-foreground mb-4">Schedule a service to get started</p>
                  <Button onClick={() => setActiveTab("calendar")}>Book a Service</Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Booking History</h2>
              <Badge variant="secondary">{pastBookings.length} completed</Badge>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading bookings...</span>
              </div>
            ) : (
              <div className="grid gap-4">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showActions={false} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
