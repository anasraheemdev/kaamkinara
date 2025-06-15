"use client"

import { useState } from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Search,
  Filter,
  MapPin,
  Star,
  Clock,
  Zap,
  Droplets,
  Hammer,
  Paintbrush,
  Wrench,
  Sparkles,
  Users,
  Shield,
  Award,
  Heart,
  MessageCircle,
} from "lucide-react"

export default function CustomerServices() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [sortBy, setSortBy] = useState("rating")
  const [priceRange, setPriceRange] = useState("all")

  const categories = [
    { id: "all", name: "All Services", icon: Users, count: 1250 },
    { id: "plumbing", name: "Plumbing", icon: Droplets, count: 156 },
    { id: "electrical", name: "Electrical", icon: Zap, count: 89 },
    { id: "carpentry", name: "Carpentry", icon: Hammer, count: 67 },
    { id: "painting", name: "Painting", icon: Paintbrush, count: 45 },
    { id: "repair", name: "Repair", icon: Wrench, count: 78 },
    { id: "cleaning", name: "Cleaning", icon: Sparkles, count: 234 },
  ]

  const services = [
    {
      id: 1,
      title: "Professional Plumbing Services",
      provider: "Ahmed Hassan",
      category: "Plumbing",
      description:
        "Expert plumbing solutions for residential and commercial properties. 24/7 emergency service available with guaranteed quality work.",
      price: "Rs. 800/hour",
      rating: 4.9,
      reviews: 127,
      orders: 45,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Emergency", "Residential", "Commercial", "24/7"],
      deliveryTime: "Same day",
      location: "Karachi",
      distance: "0.8 km",
      verified: true,
      topRated: true,
      responseTime: "5 min",
    },
    {
      id: 2,
      title: "Kitchen & Bathroom Renovation",
      provider: "Muhammad Tariq",
      category: "Plumbing",
      description:
        "Complete kitchen and bathroom renovation services with modern fixtures and quality workmanship. Free consultation included.",
      price: "Rs. 15,000 - Rs. 50,000",
      rating: 4.8,
      reviews: 89,
      orders: 23,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Renovation", "Modern", "Quality", "Consultation"],
      deliveryTime: "3-7 days",
      location: "Karachi",
      distance: "1.2 km",
      verified: true,
      topRated: false,
      responseTime: "10 min",
    },
    {
      id: 3,
      title: "Emergency Electrical Repair",
      provider: "Ali Raza",
      category: "Electrical",
      description:
        "Quick and reliable emergency electrical repair services. Licensed electrician with 10+ years experience.",
      price: "Rs. 1,200/hour",
      rating: 4.7,
      reviews: 156,
      orders: 78,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Emergency", "Licensed", "Experienced", "Quick"],
      deliveryTime: "Within 2 hours",
      location: "Karachi",
      distance: "2.1 km",
      verified: true,
      topRated: true,
      responseTime: "3 min",
    },
    {
      id: 4,
      title: "Home Painting & Decoration",
      provider: "Hassan Ahmed",
      category: "Painting",
      description:
        "Professional home painting services with premium quality paints. Interior and exterior painting available.",
      price: "Rs. 25/sq ft",
      rating: 4.6,
      reviews: 92,
      orders: 34,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Interior", "Exterior", "Premium", "Professional"],
      deliveryTime: "2-5 days",
      location: "Karachi",
      distance: "3.5 km",
      verified: false,
      topRated: false,
      responseTime: "15 min",
    },
    {
      id: 5,
      title: "Deep Cleaning Services",
      provider: "Fatima Khan",
      category: "Cleaning",
      description:
        "Comprehensive deep cleaning services for homes and offices. Eco-friendly products and professional equipment.",
      price: "Rs. 2,500 - Rs. 8,000",
      rating: 4.9,
      reviews: 203,
      orders: 156,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Deep Clean", "Eco-friendly", "Professional", "Equipment"],
      deliveryTime: "Same day",
      location: "Karachi",
      distance: "1.8 km",
      verified: true,
      topRated: true,
      responseTime: "2 min",
    },
    {
      id: 6,
      title: "Custom Furniture Making",
      provider: "Usman Sheikh",
      category: "Carpentry",
      description:
        "Custom furniture design and manufacturing. High-quality wood work with modern designs and traditional craftsmanship.",
      price: "Rs. 5,000 - Rs. 25,000",
      rating: 4.8,
      reviews: 67,
      orders: 28,
      image: "/placeholder.svg?height=200&width=300",
      tags: ["Custom", "Quality", "Modern", "Traditional"],
      deliveryTime: "1-2 weeks",
      location: "Karachi",
      distance: "4.2 km",
      verified: true,
      topRated: false,
      responseTime: "20 min",
    },
  ]

  const filteredServices = services.filter((service) => {
    const matchesSearch =
      service.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.provider.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || service.category.toLowerCase() === selectedCategory
    return matchesSearch && matchesCategory
  })

  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "price":
        return Number.parseInt(a.price.replace(/[^\d]/g, "")) - Number.parseInt(b.price.replace(/[^\d]/g, ""))
      case "reviews":
        return b.reviews - a.reviews
      case "distance":
        return Number.parseFloat(a.distance) - Number.parseFloat(b.distance)
      default:
        return 0
    }
  })

  return (
    <DashboardLayout userRole="customer" userName="John Doe">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Find Services</h1>
            <p className="text-muted-foreground">Discover and book professional services in your area</p>
          </div>
        </div>

        {/* Search and Filters */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search services, providers, or keywords..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name} ({category.count})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Highest Rated</SelectItem>
                  <SelectItem value="price">Lowest Price</SelectItem>
                  <SelectItem value="reviews">Most Reviews</SelectItem>
                  <SelectItem value="distance">Nearest</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" className="gap-2">
                <Filter className="h-4 w-4" />
                More Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Card
              key={category.id}
              className={`cursor-pointer transition-all hover:shadow-md ${
                selectedCategory === category.id ? "ring-2 ring-blue-500 bg-blue-50" : ""
              }`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <CardContent className="p-4 text-center">
                <category.icon className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <h3 className="font-medium text-sm">{category.name}</h3>
                <p className="text-xs text-muted-foreground">{category.count}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Results */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">{sortedServices.length} services found</h2>
          <div className="text-sm text-muted-foreground">
            Showing results for "
            {selectedCategory === "all" ? "All Services" : categories.find((c) => c.id === selectedCategory)?.name}"
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sortedServices.map((service) => (
            <Card key={service.id} className="overflow-hidden hover:shadow-lg transition-all duration-300 group">
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                <img
                  src={service.image || "/placeholder.svg"}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 flex flex-col gap-1">
                  {service.topRated && (
                    <Badge className="bg-yellow-500 text-white">
                      <Award className="h-3 w-3 mr-1" />
                      Top Rated
                    </Badge>
                  )}
                  {service.verified && (
                    <Badge className="bg-blue-500 text-white">
                      <Shield className="h-3 w-3 mr-1" />
                      Verified
                    </Badge>
                  )}
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <Heart className="h-3 w-3" />
                </Button>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-lg line-clamp-1">{service.title}</h3>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Avatar className="h-5 w-5">
                        <AvatarImage src="/placeholder.svg?height=20&width=20" />
                        <AvatarFallback className="text-xs">
                          {service.provider
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <span>{service.provider}</span>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{service.description}</p>

                  <div className="flex flex-wrap gap-1">
                    {service.tags.slice(0, 3).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {service.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{service.tags.length - 3}
                      </Badge>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-current" />
                        <span className="font-medium">{service.rating}</span>
                        <span className="text-muted-foreground">({service.reviews})</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        <span className="text-muted-foreground">{service.distance}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-1">
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      <span className="text-muted-foreground">{service.deliveryTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MessageCircle className="h-3 w-3 text-green-500" />
                      <span className="text-green-600 text-xs">Responds in {service.responseTime}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div>
                      <div className="font-semibold text-green-600">{service.price}</div>
                      <div className="text-xs text-muted-foreground">{service.orders} orders completed</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" variant="outline">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        Chat
                      </Button>
                      <Button size="sm">Book Now</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More */}
        {sortedServices.length > 0 && (
          <div className="text-center">
            <Button variant="outline" size="lg">
              Load More Services
            </Button>
          </div>
        )}

        {/* No Results */}
        {sortedServices.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No services found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search criteria or browse different categories
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory("all")
                }}
              >
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  )
}
