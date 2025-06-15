"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  DollarSign,
  Clock,
  Star,
  CheckCircle,
  XCircle,
  MapPin,
  Phone,
  MessageCircle,
  Users,
  Target,
  Award,
  Briefcase,
} from "lucide-react"

export default function WorkerDashboard() {
  const [isOnline, setIsOnline] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")

  const stats = [
    {
      title: "Today's Earnings",
      value: "Rs. 4,200",
      change: "+15% from yesterday",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Active Jobs",
      value: "3",
      change: "2 scheduled today",
      icon: Briefcase,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Completion Rate",
      value: "96%",
      change: "+2% this month",
      icon: Target,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      title: "Average Rating",
      value: "4.9",
      change: "From 127 reviews",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const pendingJobs = [
    {
      id: 1,
      customer: "Sarah Ahmed",
      service: "Plumbing",
      location: "DHA Phase 5, Karachi",
      time: "2:00 PM - 4:00 PM",
      budget: "Rs. 2,000",
      description: "Kitchen sink repair needed urgently",
      distance: "1.2 km",
      urgency: "high",
      postedTime: "2 hours ago",
    },
    {
      id: 2,
      customer: "Ali Hassan",
      service: "Plumbing",
      location: "Gulshan-e-Iqbal, Karachi",
      time: "4:30 PM - 6:00 PM",
      budget: "Rs. 1,500",
      description: "Bathroom pipe leakage fix",
      distance: "2.8 km",
      urgency: "medium",
      postedTime: "4 hours ago",
    },
    {
      id: 3,
      customer: "Fatima Khan",
      service: "Plumbing",
      location: "Clifton, Karachi",
      time: "Tomorrow, 10:00 AM",
      budget: "Rs. 3,500",
      description: "Complete bathroom renovation plumbing work",
      distance: "3.5 km",
      urgency: "low",
      postedTime: "6 hours ago",
    },
  ]

  const activeJobs = [
    {
      id: 1,
      customer: "Muhammad Khan",
      service: "Plumbing",
      location: "Clifton, Karachi",
      time: "10:00 AM - 12:00 PM",
      budget: "Rs. 3,000",
      description: "Complete bathroom renovation plumbing",
      status: "in-progress",
      progress: 75,
      startTime: "10:15 AM",
    },
  ]

  const recentEarnings = [
    { date: "Today", amount: "Rs. 4,200", jobs: 3, hours: 6 },
    { date: "Yesterday", amount: "Rs. 3,800", jobs: 4, hours: 7 },
    { date: "Jan 13", amount: "Rs. 2,800", jobs: 2, hours: 5 },
    { date: "Jan 12", amount: "Rs. 5,100", jobs: 5, hours: 8 },
    { date: "Jan 11", amount: "Rs. 3,200", jobs: 3, hours: 6 },
  ]

  const achievements = [
    {
      title: "Top Performer",
      description: "Ranked #1 in your area this month",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
    {
      title: "Quick Responder",
      description: "Average response time: 5 minutes",
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Customer Favorite",
      description: "98% customer satisfaction rate",
      icon: Users,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
  ]

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "low":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <DashboardLayout userRole="worker" userName="Ahmed Hassan">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Welcome back, Ahmed!</h1>
            <p className="text-muted-foreground">You have 3 pending job requests and Rs. 45,200 earned this month.</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <span className="text-sm font-medium">{isOnline ? "Online" : "Offline"}</span>
              <Switch checked={isOnline} onCheckedChange={setIsOnline} />
            </div>
            <div className={`w-3 h-3 rounded-full ${isOnline ? "bg-green-500" : "bg-gray-400"}`} />
          </div>
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
            <TabsTrigger value="jobs">Job Requests</TabsTrigger>
            <TabsTrigger value="active">Active Jobs</TabsTrigger>
            <TabsTrigger value="earnings">Earnings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Active Job */}
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="h-5 w-5 mr-2 text-blue-600" />
                    Current Job
                  </CardTitle>
                  <CardDescription>Job in progress - track your current work</CardDescription>
                </CardHeader>
                <CardContent>
                  {activeJobs.length > 0 ? (
                    <div className="space-y-4">
                      {activeJobs.map((job) => (
                        <div key={job.id} className="border rounded-lg p-4 bg-blue-50">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <Avatar>
                                <AvatarImage src="/placeholder.svg?height=40&width=40" />
                                <AvatarFallback>
                                  {job.customer
                                    .split(" ")
                                    .map((n) => n[0])
                                    .join("")}
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <h4 className="font-semibold">{job.customer}</h4>
                                <p className="text-sm text-muted-foreground">{job.service}</p>
                              </div>
                            </div>
                            <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">{job.location}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm">Started: {job.startTime}</span>
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                          <div className="space-y-2 mb-4">
                            <div className="flex justify-between text-sm">
                              <span>Progress</span>
                              <span>{job.progress}%</span>
                            </div>
                            <Progress value={job.progress} />
                          </div>

                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-green-600">{job.budget}</span>
                            <div className="flex space-x-2">
                              <Button size="sm" variant="outline">
                                <Phone className="h-4 w-4 mr-1" />
                                Call
                              </Button>
                              <Button size="sm" variant="outline">
                                <MessageCircle className="h-4 w-4 mr-1" />
                                Chat
                              </Button>
                              <Button size="sm">Mark Complete</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <CheckCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">No active jobs</h3>
                      <p className="text-sm text-muted-foreground">Check pending requests to start working</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Achievements & Profile */}
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your recent accomplishments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${achievement.bgColor}`}>
                        <achievement.icon className={`h-4 w-4 ${achievement.color}`} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">{achievement.description}</p>
                      </div>
                    </div>
                  ))}

                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Profile Completion</span>
                        <span>85%</span>
                      </div>
                      <Progress value={85} />
                      <p className="text-xs text-muted-foreground">Add portfolio images to reach 100%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Pending Job Requests</h2>
              <Badge variant="secondary">{pendingJobs.length} new requests</Badge>
            </div>
            <div className="grid gap-4">
              {pendingJobs.map((job) => (
                <Card key={job.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {job.customer
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold">{job.customer}</h3>
                          <p className="text-sm text-muted-foreground">{job.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-semibold text-green-600 text-lg">{job.budget}</div>
                        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{job.distance}</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">{job.time}</span>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">{job.description}</p>

                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <Badge className={getUrgencyColor(job.urgency)}>{job.urgency} priority</Badge>
                        <span className="text-xs text-muted-foreground">Posted {job.postedTime}</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept Job
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <XCircle className="h-4 w-4 mr-1" />
                        Decline
                      </Button>
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-4 w-4 mr-1" />
                        Chat
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="active" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Active Jobs</h2>
              <Badge variant="secondary">{activeJobs.length} active</Badge>
            </div>
            {activeJobs.length > 0 ? (
              <div className="grid gap-4">
                {activeJobs.map((job) => (
                  <Card key={job.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-4">
                          <Avatar className="h-12 w-12">
                            <AvatarImage src="/placeholder.svg?height=48&width=48" />
                            <AvatarFallback>
                              {job.customer
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <h3 className="font-semibold text-lg">{job.customer}</h3>
                            <p className="text-muted-foreground">{job.service}</p>
                          </div>
                        </div>
                        <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
                      </div>

                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span>Job Progress</span>
                          <span>{job.progress}%</span>
                        </div>
                        <Progress value={job.progress} />
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold text-green-600">{job.budget}</span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <Button size="sm" variant="outline">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Chat
                          </Button>
                          <Button size="sm">Complete Job</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <Briefcase className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold mb-2">No active jobs</h3>
                  <p className="text-muted-foreground">Accept pending requests to start working</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="earnings" className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-tight">Earnings Overview</h2>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-600">Rs. 45,200</div>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
            </div>
            <div className="grid gap-4">
              {recentEarnings.map((earning, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold">{earning.date}</h4>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <span>{earning.jobs} jobs completed</span>
                          <span>•</span>
                          <span>{earning.hours} hours worked</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-semibold text-green-600">{earning.amount}</div>
                        <div className="text-sm text-muted-foreground">
                          Rs.{" "}
                          {Math.round(
                            Number.parseInt(earning.amount.replace("Rs. ", "").replace(",", "")) / earning.hours,
                          )}
                          /hr avg
                        </div>
                      </div>
                    </div>
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
