"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Wrench,
  DollarSign,
  TrendingUp,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Calendar,
  MapPin,
  Star,
} from "lucide-react"

export default function AdminDashboard() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")

  const stats = [
    { label: "Total Users", value: "12,543", icon: Users, color: "text-blue-600", change: "+12%" },
    { label: "Active Workers", value: "3,421", icon: Wrench, color: "text-green-600", change: "+8%" },
    { label: "Total Revenue", value: "Rs. 2.4M", icon: DollarSign, color: "text-purple-600", change: "+15%" },
    { label: "Jobs Completed", value: "45,678", icon: TrendingUp, color: "text-orange-600", change: "+23%" },
  ]

  const pendingVerifications = [
    {
      id: 1,
      name: "Ahmed Hassan",
      service: "Plumber",
      location: "Karachi",
      experience: "5 years",
      documents: ["CNIC", "Certificate"],
      submittedDate: "2024-01-15",
      status: "pending",
    },
    {
      id: 2,
      name: "Muhammad Ali",
      service: "Electrician",
      location: "Lahore",
      experience: "3 years",
      documents: ["CNIC", "Experience Letter"],
      submittedDate: "2024-01-14",
      status: "pending",
    },
    {
      id: 3,
      name: "Hassan Sheikh",
      service: "Mason",
      location: "Islamabad",
      experience: "7 years",
      documents: ["CNIC"],
      submittedDate: "2024-01-13",
      status: "under_review",
    },
  ]

  const recentDisputes = [
    {
      id: 1,
      customer: "Sarah Ahmed",
      worker: "Ali Khan",
      service: "Plumbing",
      issue: "Work not completed as agreed",
      amount: "Rs. 2,500",
      date: "2024-01-15",
      status: "open",
    },
    {
      id: 2,
      customer: "John Doe",
      worker: "Usman Sheikh",
      service: "Electrical",
      issue: "Payment dispute",
      amount: "Rs. 1,800",
      date: "2024-01-14",
      status: "resolved",
    },
  ]

  const topWorkers = [
    {
      id: 1,
      name: "Ali Hassan",
      service: "Plumber",
      rating: 4.9,
      jobs: 156,
      earnings: "Rs. 45,000",
      location: "Karachi",
    },
    {
      id: 2,
      name: "Muhammad Tariq",
      service: "Electrician",
      rating: 4.8,
      jobs: 142,
      earnings: "Rs. 38,500",
      location: "Lahore",
    },
    {
      id: 3,
      name: "Hassan Ahmed",
      service: "Mason",
      rating: 4.7,
      jobs: 128,
      earnings: "Rs. 52,000",
      location: "Islamabad",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "under_review":
        return "bg-blue-100 text-blue-800"
      case "approved":
        return "bg-green-100 text-green-800"
      case "rejected":
        return "bg-red-100 text-red-800"
      case "open":
        return "bg-red-100 text-red-800"
      case "resolved":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">Kaam Kinara Admin</span>
            </Link>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <MessageSquare className="h-5 w-5" />
              </Button>
              <Avatar>
                <AvatarImage src="/placeholder.svg?height=32&width=32" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage users, workers, and platform operations</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.label}</p>
                    <p className="text-2xl font-bold">{stat.value}</p>
                    <p className="text-sm text-green-600">{stat.change} from last month</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="verifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="verifications">Worker Verifications</TabsTrigger>
            <TabsTrigger value="disputes">Disputes</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          {/* Worker Verifications */}
          <TabsContent value="verifications">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Pending Worker Verifications</CardTitle>
                    <CardDescription>Review and approve new worker applications</CardDescription>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                      <Input
                        placeholder="Search workers..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-10 w-64"
                      />
                    </div>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="under_review">Under Review</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {pendingVerifications.map((worker) => (
                    <div key={worker.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>
                              {worker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold text-lg">{worker.name}</h4>
                            <p className="text-gray-600">{worker.service}</p>
                            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                              <div className="flex items-center">
                                <MapPin className="h-4 w-4 mr-1" />
                                {worker.location}
                              </div>
                              <div className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                {worker.experience}
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getStatusColor(worker.status)}>{worker.status.replace("_", " ")}</Badge>
                          <p className="text-sm text-gray-500 mt-1">Submitted: {worker.submittedDate}</p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Documents Submitted:</p>
                        <div className="flex space-x-2">
                          {worker.documents.map((doc) => (
                            <Badge key={doc} variant="outline">
                              {doc}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button size="sm" variant="destructive">
                          <XCircle className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes */}
          <TabsContent value="disputes">
            <Card>
              <CardHeader>
                <CardTitle>Recent Disputes</CardTitle>
                <CardDescription>Manage customer and worker disputes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentDisputes.map((dispute) => (
                    <div key={dispute.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="font-semibold">Dispute #{dispute.id}</h4>
                          <p className="text-sm text-gray-600">
                            {dispute.customer} vs {dispute.worker}
                          </p>
                        </div>
                        <Badge className={getStatusColor(dispute.status)}>{dispute.status}</Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Service: {dispute.service}</p>
                          <p className="text-sm text-gray-600">Amount: {dispute.amount}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Date: {dispute.date}</p>
                        </div>
                      </div>

                      <p className="text-sm mb-4">{dispute.issue}</p>

                      <div className="flex space-x-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                        <Button size="sm" variant="outline">
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Contact Parties
                        </Button>
                        {dispute.status === "open" && (
                          <Button size="sm">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Resolve
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics */}
          <TabsContent value="analytics">
            <div className="grid lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Top Performing Workers</CardTitle>
                  <CardDescription>Workers with highest ratings and earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {topWorkers.map((worker, index) => (
                      <div key={worker.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 rounded-full w-8 h-8 flex items-center justify-center font-semibold">
                            {index + 1}
                          </div>
                          <Avatar>
                            <AvatarImage src="/placeholder.svg?height=40&width=40" />
                            <AvatarFallback>
                              {worker.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h4 className="font-semibold">{worker.name}</h4>
                            <p className="text-sm text-gray-600">
                              {worker.service} • {worker.location}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-1 mb-1">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span className="text-sm font-semibold">{worker.rating}</span>
                          </div>
                          <p className="text-sm text-gray-600">{worker.jobs} jobs</p>
                          <p className="text-sm font-semibold text-green-600">{worker.earnings}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Platform Metrics</CardTitle>
                  <CardDescription>Key performance indicators</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Worker Verification Rate</span>
                        <span>92%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Customer Satisfaction</span>
                        <span>4.6/5</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full" style={{ width: "92%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Job Completion Rate</span>
                        <span>89%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-purple-600 h-2 rounded-full" style={{ width: "89%" }}></div>
                      </div>
                    </div>

                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>Payment Success Rate</span>
                        <span>96%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-600 h-2 rounded-full" style={{ width: "96%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* User Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle>User Management</CardTitle>
                <CardDescription>Manage customers and workers on the platform</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">User Management</h3>
                  <p className="text-gray-600 mb-4">Advanced user management features coming soon</p>
                  <Button variant="outline">View All Users</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
