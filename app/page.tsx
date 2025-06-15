"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, Clock, Users, Search } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Services", count: 150 },
    { id: "cleaning", name: "Cleaning", count: 45 },
    { id: "plumbing", name: "Plumbing", count: 32 },
    { id: "electrical", name: "Electrical", count: 28 },
    { id: "painting", name: "Painting", count: 25 },
    { id: "carpentry", name: "Carpentry", count: 20 },
  ]

  const featuredWorkers = [
    {
      id: 1,
      name: "Ahmed Hassan",
      category: "Plumbing",
      rating: 4.9,
      reviews: 127,
      location: "Downtown",
      price: 50,
      image: "/placeholder-user.jpg",
      verified: true,
      responseTime: "< 1 hour",
    },
    {
      id: 2,
      name: "Fatima Ali",
      category: "Cleaning",
      rating: 4.8,
      reviews: 89,
      location: "City Center",
      price: 35,
      image: "/placeholder-user.jpg",
      verified: true,
      responseTime: "< 30 min",
    },
    {
      id: 3,
      name: "Omar Khan",
      category: "Electrical",
      rating: 4.7,
      reviews: 156,
      location: "North Side",
      price: 60,
      image: "/placeholder-user.jpg",
      verified: true,
      responseTime: "< 2 hours",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-blue-600">Kaam Kinara</h1>
              <Badge variant="secondary">Urban Work Platform</Badge>
            </div>
            <nav className="hidden md:flex space-x-8">
              <Link href="/customer/services" className="text-gray-600 hover:text-blue-600">
                Find Services
              </Link>
              <Link href="/messages" className="text-gray-600 hover:text-blue-600">
                Messages
              </Link>
              <Link href="/customer/schedule" className="text-gray-600 hover:text-blue-600">
                My Bookings
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline">Login</Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-6xl font-bold mb-6">Find Skilled Workers for Any Job</h2>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">Connect with verified professionals in your area</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-2xl mx-auto">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="What service do you need?"
                  className="w-full pl-10 pr-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-300"
                />
              </div>
            </div>
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Search Services
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">Popular Categories</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Card
                key={category.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedCategory === category.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardContent className="p-4 text-center">
                  <h4 className="font-semibold text-gray-900">{category.name}</h4>
                  <p className="text-sm text-gray-500">{category.count} workers</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Workers */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900">Top Rated Workers</h3>
            <Link href="/customer/services">
              <Button variant="outline">View All</Button>
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredWorkers.map((worker) => (
              <Card key={worker.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{worker.name}</CardTitle>
                        <CardDescription>{worker.category}</CardDescription>
                      </div>
                    </div>
                    {worker.verified && (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        Verified
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-semibold">{worker.rating}</span>
                        <span className="text-gray-500">({worker.reviews} reviews)</span>
                      </div>
                      <span className="font-bold text-lg">${worker.price}/hr</span>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-4 w-4" />
                        <span>{worker.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{worker.responseTime}</span>
                      </div>
                    </div>
                    <div className="flex space-x-2 pt-2">
                      <Link href={`/customer/book/${worker.category.toLowerCase()}`} className="flex-1">
                        <Button className="w-full">Book Now</Button>
                      </Link>
                      <Button variant="outline" size="sm">
                        Message
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">1,500+</div>
              <div className="text-gray-600">Verified Workers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">10,000+</div>
              <div className="text-gray-600">Jobs Completed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">4.8</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600">24/7</div>
              <div className="text-gray-600">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="text-lg font-semibold mb-4">Kaam Kinara</h4>
              <p className="text-gray-400">Connecting customers with skilled workers for all urban services.</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Customers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/customer/services">Find Services</Link>
                </li>
                <li>
                  <Link href="/customer/schedule">My Bookings</Link>
                </li>
                <li>
                  <Link href="/messages">Messages</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">For Workers</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/worker/dashboard">Dashboard</Link>
                </li>
                <li>
                  <Link href="/worker/gigs">Find Gigs</Link>
                </li>
                <li>
                  <Link href="/worker/schedule">My Schedule</Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link href="/help">Help Center</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 Kaam Kinara. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
