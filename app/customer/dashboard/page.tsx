"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Plus,
  MapPin,
  Clock,
  Star,
  TrendingUp,
  Calendar,
  DollarSign,
  CheckCircle,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Wrench,
  Sparkles,
  ArrowRight,
  Filter,
} from "lucide-react"

export default function CustomerDashboard() {
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Active Bookings",
      value: "3",
      change: "+2 from last month",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Total Spent",
      value: "Rs. 15,420",
      change: "+12% from last month",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Completed Jobs",
      value: "28",
      change: "+4 this month",
      icon: CheckCircle,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Avg Rating Given",
      value: "4.8",
      change: "Excellent feedback",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const services = [
    { icon: Droplets, name: "Plumber", jobs: 156, avgPrice: "Rs. 800", color: "text-blue-600", bg: "bg-blue-50" },
    { icon: Zap, name: "Electrician", jobs: 89, avgPrice: "Rs. 600", color: "text-yellow-600", bg: "bg-yellow-50" },
    { icon: Hammer, name: "Mason", jobs: 67, avgPrice: "Rs. 1200", color: "text-gray-600", bg: "bg-gray-50" },
    { icon: Paintbrush, name: "Painter", jobs: 45, avgPrice: "Rs. 500", color: "text-green-600", bg: "bg-green-50" },
    { icon: Wrench, name: "Carpenter", jobs: 78, avgPrice: "Rs. 900", color: "text-orange-600", bg: "bg-orange-50" },
    { icon: Sparkles, name: "Cleaner", jobs: 234, avgPrice: "Rs. 400", color: "text-purple-600", bg: "bg-purple-50" },
  ]

  const recentBookings = [
    {
      id: 1,
      service: "Plumbing",
      worker: "Ahmed Hassan",
      date: "Today, 2:00 PM",
      status: "in-progress",
      amount: "Rs. 1,200",
      rating: null,
      progress: 60,
    },
    {
      id: 2,
      service: "Electrical",
      worker: "Muhammad Ali",
      date: "Yesterday",
      status: "completed",
      amount: "Rs. 800",
      rating: 5,
      progress: 100,
    },
    {
      id: 3,
      service: "Cleaning",
      worker: "Fatima Khan",
      date: "Jan 12",
      status: "completed",
      amount: "Rs. 600",
      rating: 4,
      progress: 100,
    },
    {
      id: 4,
      service: "Painting",
      worker: "Hassan Ahmed",
      date: "Jan 10",
      status: "scheduled",
      amount: "Rs. 2,500",
      rating: null,
      progress: 0,
    },
  ]

  const topWorkers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      service: "Plumber",
      rating: 4.9,
      jobs: 156,
      price: "Rs. 800/hr",
      avatar: "/placeholder.svg?height=40&width=40",
      available: true,
      distance: "0.8 km",
    },
    {
      id: 2,
      name: "Muhammad Ali",
      service: "Electrician",
      rating: 4.8,
      jobs: 142,
      price: "Rs. 600/hr",
      avatar: "/placeholder.svg?height=40&width=40",
      available: true,
      distance: "1.2 km",
    },
    {
      id: 3,
      name: "Fatima Khan",
      service: "Cleaner",
      rating: 4.7,
      jobs: 89,
      price: "Rs. 400/hr",
      avatar: "/placeholder.svg?height=40&width=40",
      available: false,
      distance: "2.1 km",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "in-progress":
        return "bg-blue-100 text-blue-800"
      case "scheduled":
        return "bg-yellow-100 text-yellow-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout userRole="customer" userName="John Doe">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, John!</h1>
            <p className="text-muted-foreground">Here's what's happening with your services today.</p>
          </div>
          <Button size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Book Service
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <stat.icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-muted-foreground">{stat.change}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">My Bookings</TabsTrigger>
            <TabsTrigger value="services">Services</TabsTrigger>
            <TabsTrigger value="workers">Top Workers</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Recent Activity */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Recent Bookings</CardTitle>
                  <CardDescription>Your latest service requests and their status</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentBookings.slice(0, 4).map((booking) => (
                      <div key={booking.id} className="flex items-center space-x-4 rounded-lg border p-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {booking.worker
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium leading-none">
                              {booking.service} - {booking.worker}
                            </p>
                            <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{booking.date}</span>
                            <span>•</span>
                            <span>{booking.amount}</span>
                          </div>
                          {booking.status === "in-progress" && (
                            <div className="space-y-1">
                              <div className="flex justify-between text-xs">
                                <span>Progress</span>
                                <span>{booking.progress}%</span>
                              </div>
                              <Progress value={booking.progress} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>Common tasks and shortcuts</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button className="w-full justify-start" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Book Emergency Service
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Schedule for Later
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Star className="mr-2 h-4 w-4" />
                    Rate Recent Services
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <TrendingUp className="mr-2 h-4 w-4" />
                    View Spending Analytics
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">My Bookings</h2>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </div>
            <div className="grid gap-4">
              {recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src="/placeholder.svg?height=48&width=48" />
                          <AvatarFallback>
                            {booking.worker
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{booking.service}</h3>
                          <p className="text-sm text-muted-foreground">{booking.worker}</p>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground mt-1">
                            <Clock className="h-3 w-3" />
                            <span>{booking.date}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(booking.status)}>{booking.status}</Badge>
                        <p className="text-lg font-semibold mt-2">{booking.amount}</p>
                        {booking.rating && (
                          <div className="flex items-center mt-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm ml-1">{booking.rating}</span>
                          </div>
                        )}
                      </div>
                    </div>
                    {booking.status === "in-progress" && (
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Progress</span>
                          <span>{booking.progress}%</span>
                        </div>
                        <Progress value={booking.progress} />
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="services" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Available Services</h2>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <Card key={service.name} className="hover:shadow-md transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-lg ${service.bg} flex items-center justify-center mb-4`}>
                      <service.icon className={`h-6 w-6 ${service.color}`} />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{service.name}</h3>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{service.jobs} available workers</p>
                      <p>Starting from {service.avgPrice}</p>
                    </div>
                    <Button className="w-full mt-4" variant="outline">
                      Book Now
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="workers" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Top Rated Workers</h2>
              <Button variant="outline" size="sm">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {topWorkers.map((worker) => (
                <Card key={worker.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                        <AvatarFallback>
                          {worker.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <h3 className="font-semibold">{worker.name}</h3>
                        <p className="text-sm text-muted-foreground">{worker.service}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs ml-1">{worker.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">•</span>
                          <span className="text-xs text-muted-foreground">{worker.jobs} jobs</span>
                        </div>
                      </div>
                      <div className={`w-2 h-2 rounded-full ${worker.available ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex items-center justify-between text-sm mb-4">
                      <span className="font-medium">{worker.price}</span>
                      <div className="flex items-center text-muted-foreground">
                        <MapPin className="h-3 w-3 mr-1" />
                        <span>{worker.distance}</span>
                      </div>
                    </div>
                    <Button className="w-full" disabled={!worker.available}>
                      {worker.available ? "Book Now" : "Unavailable"}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
