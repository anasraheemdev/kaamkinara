"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { BookingCalendar } from "@/components/calendar/booking-calendar"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, MapPin, User, CheckCircle, Edit, MessageCircle, Phone } from "lucide-react"

export default function CustomerSchedulePage() {
  const [activeTab, setActiveTab] = useState("calendar")

  const upcomingBookings = [
    {
      id: "1",
      service: "Kitchen Plumbing",
      worker: "Ahmed Hassan",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "2 hours",
      location: "DHA Phase 5, Karachi",
      status: "confirmed",
      amount: "Rs. 2,500",
      workerRating: 4.9,
      workerImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "2",
      service: "Electrical Repair",
      worker: "Muhammad Ali",
      date: "Jan 18",
      time: "2:00 PM",
      duration: "3 hours",
      location: "Gulshan-e-Iqbal, Karachi",
      status: "confirmed",
      amount: "Rs. 1,800",
      workerRating: 4.8,
      workerImage: "/placeholder.svg?height=40&width=40",
    },
    {
      id: "3",
      service: "House Cleaning",
      worker: "Fatima Khan",
      date: "Jan 20",
      time: "9:00 AM",
      duration: "4 hours",
      location: "Clifton, Karachi",
      status: "pending",
      amount: "Rs. 3,200",
      workerRating: 4.9,
      workerImage: "/placeholder.svg?height=40&width=40",
    },
  ]

  const pastBookings = [
    {
      id: "4",
      service: "Bathroom Renovation",
      worker: "Hassan Ahmed",
      date: "Jan 10",
      time: "11:00 AM",
      duration: "6 hours",
      location: "North Nazimabad, Karachi",
      status: "completed",
      amount: "Rs. 8,000",
      workerRating: 4.7,
      workerImage: "/placeholder.svg?height=40&width=40",
      customerRating: 5,
    },
    {
      id: "5",
      service: "AC Repair",
      worker: "Usman Sheikh",
      date: "Jan 5",
      time: "3:00 PM",
      duration: "2 hours",
      location: "Malir, Karachi",
      status: "completed",
      amount: "Rs. 1,500",
      workerRating: 4.6,
      workerImage: "/placeholder.svg?height=40&width=40",
      customerRating: 4,
    },
  ]

  const handleBookingConfirm = (date: Date, time: string) => {
    console.log("Booking confirmed for:", date, "at", time)
    // Handle booking confirmation logic
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

  const BookingCard = ({ booking, showActions = true }: { booking: any; showActions?: boolean }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={booking.workerImage || "/placeholder.svg"} />
              <AvatarFallback>
                {booking.worker
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{booking.service}</h4>
              <p className="text-sm text-muted-foreground">{booking.worker}</p>
              <div className="flex items-center space-x-1 mt-1">
                <div className="flex items-center">
                  <span className="text-xs">⭐</span>
                  <span className="text-xs ml-1">{booking.workerRating}</span>
                </div>
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <span>{booking.date}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.time} ({booking.duration})
            </span>
          </div>
          <div className="flex items-center space-x-2 col-span-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">{booking.amount}</span>
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

        {booking.customerRating && (
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Your rating:</span>
              <div className="flex items-center">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i} className={i < booking.customerRating ? "text-yellow-400" : "text-gray-300"}>
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
                  <p className="text-2xl font-bold">{upcomingBookings.length}</p>
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
                  <p className="text-2xl font-bold">{pastBookings.length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-muted-foreground">Pending</p>
                  <p className="text-2xl font-bold">{upcomingBookings.filter((b) => b.status === "pending").length}</p>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <User className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="text-sm text-muted-foreground">This Month</p>
                  <p className="text-2xl font-bold">Rs. 15,500</p>
                </div>
              </div>
            </div>
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
            <BookingCalendar userRole="customer" onBookingConfirm={handleBookingConfirm} />
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Upcoming Bookings</h2>
              <Badge variant="secondary">{upcomingBookings.length} bookings</Badge>
            </div>

            <div className="grid gap-4">
              {upcomingBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>

            {upcomingBookings.length === 0 && (
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

            <div className="grid gap-4">
              {pastBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} showActions={false} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
