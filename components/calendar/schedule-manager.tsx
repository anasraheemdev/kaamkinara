"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Clock, Calendar, User, MapPin, Phone, MessageCircle, Settings, Plus, Edit, Trash2 } from "lucide-react"

interface Booking {
  id: string
  customer: string
  service: string
  date: string
  time: string
  duration: string
  location: string
  status: "confirmed" | "pending" | "completed" | "cancelled"
  amount: string
  notes?: string
}

interface AvailabilitySlot {
  id: string
  day: string
  startTime: string
  endTime: string
  isAvailable: boolean
}

export function ScheduleManager() {
  const [activeTab, setActiveTab] = useState("today")
  const [isAvailable, setIsAvailable] = useState(true)

  const todayBookings: Booking[] = [
    {
      id: "1",
      customer: "Sarah Ahmed",
      service: "Kitchen Plumbing",
      date: "Today",
      time: "09:00 AM",
      duration: "2 hours",
      location: "DHA Phase 5, Karachi",
      status: "confirmed",
      amount: "Rs. 2,500",
      notes: "Kitchen sink repair needed urgently",
    },
    {
      id: "2",
      customer: "Ali Hassan",
      service: "Bathroom Renovation",
      date: "Today",
      time: "02:00 PM",
      duration: "4 hours",
      location: "Gulshan-e-Iqbal, Karachi",
      status: "confirmed",
      amount: "Rs. 5,000",
    },
    {
      id: "3",
      customer: "Muhammad Khan",
      service: "Emergency Repair",
      date: "Today",
      time: "06:00 PM",
      duration: "1 hour",
      location: "Clifton, Karachi",
      status: "pending",
      amount: "Rs. 1,200",
    },
  ]

  const upcomingBookings: Booking[] = [
    {
      id: "4",
      customer: "Fatima Sheikh",
      service: "Complete Plumbing",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "6 hours",
      location: "North Nazimabad, Karachi",
      status: "confirmed",
      amount: "Rs. 8,000",
    },
    {
      id: "5",
      customer: "Hassan Ahmed",
      service: "Pipe Installation",
      date: "Jan 18",
      time: "11:00 AM",
      duration: "3 hours",
      location: "Malir, Karachi",
      status: "confirmed",
      amount: "Rs. 3,500",
    },
  ]

  const weeklyAvailability: AvailabilitySlot[] = [
    { id: "1", day: "Monday", startTime: "08:00", endTime: "18:00", isAvailable: true },
    { id: "2", day: "Tuesday", startTime: "08:00", endTime: "18:00", isAvailable: true },
    { id: "3", day: "Wednesday", startTime: "08:00", endTime: "18:00", isAvailable: true },
    { id: "4", day: "Thursday", startTime: "08:00", endTime: "18:00", isAvailable: true },
    { id: "5", day: "Friday", startTime: "08:00", endTime: "16:00", isAvailable: true },
    { id: "6", day: "Saturday", startTime: "09:00", endTime: "15:00", isAvailable: true },
    { id: "7", day: "Sunday", startTime: "10:00", endTime: "14:00", isAvailable: false },
  ]

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

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" />
              <AvatarFallback>
                {booking.customer
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div>
              <h4 className="font-semibold">{booking.customer}</h4>
              <p className="text-sm text-muted-foreground">{booking.service}</p>
            </div>
          </div>
          <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>
              {booking.time} ({booking.duration})
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="truncate">{booking.location}</span>
          </div>
        </div>

        {booking.notes && <p className="text-sm text-muted-foreground mb-3 p-2 bg-gray-50 rounded">{booking.notes}</p>}

        <div className="flex items-center justify-between">
          <span className="font-semibold text-green-600">{booking.amount}</span>
          <div className="flex space-x-2">
            <Button size="sm" variant="outline">
              <Phone className="h-3 w-3 mr-1" />
              Call
            </Button>
            <Button size="sm" variant="outline">
              <MessageCircle className="h-3 w-3 mr-1" />
              Chat
            </Button>
            {booking.status === "pending" && <Button size="sm">Confirm</Button>}
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
                <p className="text-2xl font-bold">{todayBookings.length}</p>
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
                <p className="text-2xl font-bold">{todayBookings.length + upcomingBookings.length}</p>
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
                <p className="text-2xl font-bold">{todayBookings.filter((b) => b.status === "pending").length}</p>
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
                <p className="text-2xl font-bold">6</p>
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

          <div className="grid gap-4">
            {todayBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>

          {todayBookings.length === 0 && (
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

          <div className="grid gap-4">
            {upcomingBookings.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="availability" className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Weekly Availability</h2>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Add Time Slot
            </Button>
          </div>

          <div className="grid gap-4">
            {weeklyAvailability.map((slot) => (
              <Card key={slot.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-20">
                        <h4 className="font-semibold">{slot.day}</h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Select defaultValue={slot.startTime}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <span>to</span>
                        <Select defaultValue={slot.endTime}>
                          <SelectTrigger className="w-24">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 24 }, (_, i) => (
                              <SelectItem key={i} value={`${i.toString().padStart(2, "0")}:00`}>
                                {`${i.toString().padStart(2, "0")}:00`}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <Switch
                        checked={slot.isAvailable}
                        onCheckedChange={() => {
                          // Handle availability toggle
                        }}
                      />
                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
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
