"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Eye,
  Star,
  Clock,
  DollarSign,
  Users,
  TrendingUp,
  Package,
  Settings,
  ImageIcon,
  Upload,
} from "lucide-react"

export default function WorkerGigs() {
  const [activeTab, setActiveTab] = useState("my-gigs")
  const [showCreateForm, setShowCreateForm] = useState(false)

  const myGigs = [
    {
      id: 1,
      title: "Professional Plumbing Services",
      description:
        "Expert plumbing solutions for residential and commercial properties. 24/7 emergency service available.",
      category: "Plumbing",
      price: "Rs. 800/hour",
      rating: 4.9,
      reviews: 127,
      orders: 45,
      status: "active",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Emergency", "Residential", "Commercial"],
      deliveryTime: "Same day",
      revisions: "2 free revisions",
    },
    {
      id: 2,
      title: "Kitchen & Bathroom Renovation",
      description: "Complete kitchen and bathroom renovation services with modern fixtures and quality workmanship.",
      category: "Plumbing",
      price: "Rs. 15,000 - Rs. 50,000",
      rating: 4.8,
      reviews: 89,
      orders: 23,
      status: "active",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Renovation", "Modern", "Quality"],
      deliveryTime: "3-7 days",
      revisions: "1 free revision",
    },
    {
      id: 3,
      title: "Emergency Pipe Repair",
      description: "Quick and reliable emergency pipe repair services available 24/7 with guaranteed quality.",
      category: "Plumbing",
      price: "Rs. 1,200/hour",
      rating: 4.7,
      reviews: 156,
      orders: 78,
      status: "paused",
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Emergency", "24/7", "Guaranteed"],
      deliveryTime: "Within 2 hours",
      revisions: "No revisions",
    },
  ]

  const gigStats = [
    {
      title: "Total Gigs",
      value: "3",
      change: "+1 this month",
      icon: Package,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
    {
      title: "Active Orders",
      value: "12",
      change: "+3 this week",
      icon: Clock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      title: "Total Revenue",
      value: "Rs. 45,200",
      change: "+15% this month",
      icon: DollarSign,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      title: "Avg. Rating",
      value: "4.8",
      change: "From 372 reviews",
      icon: Star,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "paused":
        return "bg-yellow-100 text-yellow-800"
      case "draft":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const CreateGigForm = () => (
    <Card>
      <CardHeader>
        <CardTitle>Create New Gig</CardTitle>
        <CardDescription>Create a new service offering to attract more customers</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Gig Title</Label>
          <Input id="title" placeholder="e.g., Professional Plumbing Services" />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="carpentry">Carpentry</SelectItem>
              <SelectItem value="painting">Painting</SelectItem>
              <SelectItem value="cleaning">Cleaning</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea id="description" placeholder="Describe your service in detail..." rows={4} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" placeholder="e.g., Rs. 800/hour" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="delivery">Delivery Time</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery time" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="same-day">Same day</SelectItem>
                <SelectItem value="1-2-days">1-2 days</SelectItem>
                <SelectItem value="3-7-days">3-7 days</SelectItem>
                <SelectItem value="1-2-weeks">1-2 weeks</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma separated)</Label>
          <Input id="tags" placeholder="e.g., Emergency, Residential, Commercial" />
        </div>

        <div className="space-y-2">
          <Label>Gig Images</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-4" />
            <p className="text-sm text-gray-600 mb-2">Upload gig images</p>
            <p className="text-xs text-gray-500">PNG, JPG up to 5MB each</p>
            <Button variant="outline" size="sm" className="mt-4">
              <ImageIcon className="h-4 w-4 mr-2" />
              Choose Files
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <Switch id="active" />
          <Label htmlFor="active">Make gig active immediately</Label>
        </div>

        <div className="flex space-x-4">
          <Button onClick={() => setShowCreateForm(false)} variant="outline" className="flex-1">
            Cancel
          </Button>
          <Button className="flex-1">Create Gig</Button>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <DashboardLayout userRole="worker" userName="Ahmed Hassan">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Gigs</h1>
            <p className="text-muted-foreground">Manage your service offerings and track performance</p>
          </div>
          <Button onClick={() => setShowCreateForm(true)} size="lg" className="gap-2">
            <Plus className="h-4 w-4" />
            Create New Gig
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {gigStats.map((stat) => (
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

        {/* Main Content */}
        {showCreateForm ? (
          <CreateGigForm />
        ) : (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <TabsList>
              <TabsTrigger value="my-gigs">My Gigs</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="my-gigs" className="space-y-4">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {myGigs.map((gig) => (
                  <Card key={gig.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="aspect-video bg-gray-100 relative">
                      <img
                        src={gig.image || "/placeholder.svg"}
                        alt={gig.title}
                        className="w-full h-full object-cover"
                      />
                      <Badge className={`absolute top-2 right-2 ${getStatusColor(gig.status)}`}>{gig.status}</Badge>
                    </div>
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        <div>
                          <h3 className="font-semibold text-lg line-clamp-2">{gig.title}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{gig.description}</p>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {gig.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center space-x-1">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="font-medium">{gig.rating}</span>
                            <span className="text-muted-foreground">({gig.reviews})</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Users className="h-3 w-3 text-muted-foreground" />
                            <span className="text-muted-foreground">{gig.orders} orders</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-green-600">{gig.price}</div>
                            <div className="text-xs text-muted-foreground">{gig.deliveryTime}</div>
                          </div>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline">
                              <Eye className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Edit className="h-3 w-3" />
                            </Button>
                            <Button size="sm" variant="outline">
                              <Settings className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Gig Performance</CardTitle>
                    <CardDescription>Track how your gigs are performing</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {myGigs.map((gig) => (
                        <div key={gig.id} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <h4 className="font-medium text-sm">{gig.title}</h4>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                              <span>{gig.orders} orders</span>
                              <span>•</span>
                              <span>{gig.rating} rating</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="font-semibold text-green-600">Rs. {gig.orders * 1200}</div>
                            <div className="text-xs text-muted-foreground">Revenue</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Monthly Trends</CardTitle>
                    <CardDescription>Your gig performance over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Orders</span>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">+23%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Revenue</span>
                        <div className="flex items-center space-x-2">
                          <TrendingUp className="h-4 w-4 text-green-600" />
                          <span className="text-sm font-medium">+15%</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Rating</span>
                        <div className="flex items-center space-x-2">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm font-medium">4.8</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Gig Settings</CardTitle>
                  <CardDescription>Configure your gig preferences and notifications</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Auto-accept orders</h4>
                      <p className="text-sm text-muted-foreground">
                        Automatically accept orders that match your criteria
                      </p>
                    </div>
                    <Switch />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">Email notifications</h4>
                      <p className="text-sm text-muted-foreground">Get notified about new orders and messages</p>
                    </div>
                    <Switch defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">SMS notifications</h4>
                      <p className="text-sm text-muted-foreground">Receive SMS alerts for urgent orders</p>
                    </div>
                    <Switch />
                  </div>

                  <div className="space-y-2">
                    <Label>Maximum orders per day</Label>
                    <Select defaultValue="5">
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 orders</SelectItem>
                        <SelectItem value="5">5 orders</SelectItem>
                        <SelectItem value="10">10 orders</SelectItem>
                        <SelectItem value="unlimited">Unlimited</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Working hours</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-xs">Start time</Label>
                        <Input type="time" defaultValue="08:00" />
                      </div>
                      <div>
                        <Label className="text-xs">End time</Label>
                        <Input type="time" defaultValue="18:00" />
                      </div>
                    </div>
                  </div>

                  <Button className="w-full">Save Settings</Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </DashboardLayout>
  )
}
