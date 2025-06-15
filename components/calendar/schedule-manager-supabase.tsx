"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BookingService, type BookingWithDetails } from "@/lib/supabase/booking-service"
import { Clock, Calendar, User, MapPin, Phone, MessageCircle, Settings, Plus, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface ScheduleManagerSupabaseProps {
  userId: string
}

export function ScheduleManagerSupabase({ userId }: ScheduleManagerSupabaseProps) {
  const [activeTab, setActiveTab] = useState("today")
  const [isAvailable, setIsAvailable] = useState(true)
  const [loading, setLoading] = useState(false)
  const [todayBookings, setTodayBookings] = useState<BookingWithDetails[]>([])
  const [upcomingBookings, setUpcomingBookings] = useState<BookingWithDetails[]>([])
  const [stats, setStats] = useState({
    today: 0,
    thisWeek: 0,
    pending: 0,
    availableHours: 0,
  })

  useEffect(() => {
    loadBookings()
    loadStats()
  }, [userId])

  const loadBookings = async () => {
    setLoading(true)
    try {
      const bookings = await BookingService.getUserBookings(userId, "worker")

      const today = new Date().toISOString().split("T")[0]
      const todayBookings = bookings.filter((booking) => booking.booking_date === today)
      const upcomingBookings = bookings.filter((booking) => booking.booking_date > today)

      setTodayBookings(todayBookings)
      setUpcomingBookings(upcomingBookings)
    } catch (error) {
      console.error("Error loading bookings:", error)
      toast.error("Failed to load bookings")
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const bookingStats = await BookingService.getBookingStats(userId, "worker")
      setStats({
        today: todayBookings.length,
        thisWeek: bookingStats.confirmed,
        pending: bookingStats.pending,
        availableHours: 6, // Mock data - could be calculated from availability
      })
    } catch (error) {
      console.error("Error loading stats:", error)
    }
  }

  const handleStatusUpdate = async (bookingId: string, status: "confirmed" | "cancelled" | "completed") => {
    try {
      await BookingService.updateBookingStatus(bookingId, status)
      toast.success(`Booking ${status} successfully`)
      loadBookings() // Reload bookings
    } catch (error) {
      console.error("Error updating booking status:", error)
      toast.error("Failed to update booking status")
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

  const BookingCard = ({ booking }: { booking: BookingWithDetails }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={booking.customer.avatar_url || "/placeholder.svg?height=40&width=40"} />
              <AvatarFallback>
                {booking.customer.full_name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{booking.customer.full_name}</h4>
              <p className="text-sm text-muted-foreground">{booking.title}</p>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.start_time} - {booking.end_time} ({booking.duration_hours}h)
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>

        {booking.notes && <p className="text-sm text-muted-foreground mb-3 p-2 bg-gray-50 rounded">{booking.notes}</p>}

        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">Rs. {booking.amount}</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
            {booking.status === "pending" && (
              <Button size="sm" onClick={() => handleStatusUpdate(booking.id, "confirmed")}>
                Confirm
              </Button>
            )}
            {booking.status === "confirmed" && (
              <Button size="sm" onClick={() => handleStatusUpdate(booking.id, "completed")}>
                Complete
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Schedule Manager</h1>
          <p className="text-muted-foreground">Manage your bookings and availability</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Label htmlFor="availability">Available for bookings</Label>
            <Switch id="availability" checked={isAvailable} onCheckedChange={setIsAvailable} />
          </div>
          <div className={`w-3 h-3 rounded-full ${isAvailable ? "bg-green-500" : "bg-gray-400"}`} />
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm text-muted-foreground">Today</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm text-muted-foreground">This Week</p>
                <p className="text-2xl font-bold">{stats.thisWeek}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <User className="h-5 w-5 text-purple-600" />
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
              <Settings className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm text-muted-foreground">Available Hours</p>
                <p className="text-2xl font-bold">{stats.availableHours}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="today">Today's Schedule</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="availability">Availability</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="today" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Today's Bookings</h2>
            <Badge variant="secondary">{todayBookings.length} bookings</Badge>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading bookings...</span>
            </div>
          ) : (
            <div className="grid gap-4">
              {todayBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}

          {!loading && todayBookings.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-semibold mb-2">No bookings today</h3>
                <p className="text-muted-foreground">Your schedule is clear for today</p>
              </CardContent>
            </Card>
          )}
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
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Availability</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>

          <Card>
            <CardContent className="p-6">
              <p className="text-center text-muted-foreground">
                Availability management will be implemented here. This would allow workers to set their working hours
                for each day of the week.
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Booking Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Auto-accept bookings</h4>
                  <p className="text-sm text-muted-foreground">
                    Automatically accept bookings that match your availability
                  </p>
                </div>
                <Switch />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Buffer time between bookings</h4>
                  <p className="text-sm text-muted-foreground">Add travel time between appointments</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 minutes</SelectItem>
                    <SelectItem value="30">30 minutes</SelectItem>
                    <SelectItem value="45">45 minutes</SelectItem>
                    <SelectItem value="60">1 hour</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Advance booking limit</h4>
                  <p className="text-sm text-muted-foreground">How far in advance can customers book</p>
                </div>
                <Select defaultValue="30">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                    <SelectItem value="30">1 month</SelectItem>
                    <SelectItem value="60">2 months</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium">Minimum booking notice</h4>
                  <p className="text-sm text-muted-foreground">Minimum time required before booking</p>
                </div>
                <Select defaultValue="2">
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour</SelectItem>
                    <SelectItem value="2">2 hours</SelectItem>
                    <SelectItem value="4">4 hours</SelectItem>
                    <SelectItem value="24">1 day</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
