"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Wrench, MapPin, Star, Phone, ArrowLeft } from "lucide-react"
import { ChatButton } from "@/components/chat/chat-button"

export default function BookServicePage() {
  const params = useParams()
  const router = useRouter()
  const service = params.service as string
  const [step, setStep] = useState(1)
  const [selectedWorker, setSelectedWorker] = useState<number | null>(null)
  const [jobDetails, setJobDetails] = useState({
    description: "",
    location: "",
    date: "",
    time: "",
    budget: "",
    urgency: "normal",
  })

  const availableWorkers = [
    {
      id: 1,
      name: "Ali Hassan",
      rating: 4.8,
      reviews: 127,
      distance: "0.5 km",
      price: "Rs. 500/hour",
      experience: "5 years",
      completedJobs: 156,
      avatar: "/placeholder.svg?height=60&width=60",
      specialties: ["Pipe Repair", "Installation", "Emergency"],
      availability: "Available now",
    },
    {
      id: 2,
      name: "Muhammad Tariq",
      rating: 4.9,
      reviews: 89,
      distance: "1.2 km",
      price: "Rs. 600/hour",
      experience: "7 years",
      completedJobs: 203,
      avatar: "/placeholder.svg?height=60&width=60",
      specialties: ["Bathroom Renovation", "Kitchen Plumbing"],
      availability: "Available in 2 hours",
    },
    {
      id: 3,
      name: "Hassan Ahmed",
      rating: 4.7,
      reviews: 156,
      distance: "2.1 km",
      price: "Rs. 450/hour",
      experience: "4 years",
      completedJobs: 98,
      avatar: "/placeholder.svg?height=60&width=60",
      specialties: ["Leak Repair", "Drain Cleaning"],
      availability: "Available tomorrow",
    },
  ]

  const handleJobSubmit = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && selectedWorker) {
      setStep(3)
    }
  }

  const handleBooking = () => {
    // Handle booking logic here
    router.push("/customer/dashboard")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" onClick={() => router.back()}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <Link href="/" className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Kaam Kinara</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-4">
            <div className={`flex items-center space-x-2 ${step >= 1 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                1
              </div>
              <span className="font-medium">Job Details</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 2 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                2
              </div>
              <span className="font-medium">Choose Worker</span>
            </div>
            <div className={`w-8 h-0.5 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`}></div>
            <div className={`flex items-center space-x-2 ${step >= 3 ? "text-blue-600" : "text-gray-400"}`}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200"}`}
              >
                3
              </div>
              <span className="font-medium">Confirm Booking</span>
            </div>
          </div>
        </div>

        {/* Step 1: Job Details */}
        {step === 1 && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="capitalize">Book a {service}</CardTitle>
                <CardDescription>Tell us about your project to find the right worker</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="description">Job Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what work you need done..."
                    value={jobDetails.description}
                    onChange={(e) => setJobDetails({ ...jobDetails, description: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter your address"
                    value={jobDetails.location}
                    onChange={(e) => setJobDetails({ ...jobDetails, location: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={jobDetails.date}
                      onChange={(e) => setJobDetails({ ...jobDetails, date: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select
                      value={jobDetails.time}
                      onValueChange={(value) => setJobDetails({ ...jobDetails, time: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8AM - 12PM)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12PM - 5PM)</SelectItem>
                        <SelectItem value="evening">Evening (5PM - 8PM)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="budget">Budget Range (Optional)</Label>
                  <Select
                    value={jobDetails.budget}
                    onValueChange={(value) => setJobDetails({ ...jobDetails, budget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="under-1000">Under Rs. 1,000</SelectItem>
                      <SelectItem value="1000-3000">Rs. 1,000 - 3,000</SelectItem>
                      <SelectItem value="3000-5000">Rs. 3,000 - 5,000</SelectItem>
                      <SelectItem value="5000-10000">Rs. 5,000 - 10,000</SelectItem>
                      <SelectItem value="above-10000">Above Rs. 10,000</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label>Urgency Level</Label>
                  <RadioGroup
                    value={jobDetails.urgency}
                    onValueChange={(value) => setJobDetails({ ...jobDetails, urgency: value })}
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="emergency" id="emergency" />
                      <Label htmlFor="emergency">Emergency (ASAP)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="urgent" id="urgent" />
                      <Label htmlFor="urgent">Urgent (Within 24 hours)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="normal" id="normal" />
                      <Label htmlFor="normal">Normal (Within a few days)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="flexible" id="flexible" />
                      <Label htmlFor="flexible">Flexible (Anytime this week)</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button
                  onClick={handleJobSubmit}
                  className="w-full"
                  size="lg"
                  disabled={!jobDetails.description || !jobDetails.location}
                >
                  Find Workers
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Step 2: Choose Worker */}
        {step === 2 && (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Available Workers</h2>
              <p className="text-gray-600">Choose from verified professionals in your area</p>
            </div>

            <div className="grid gap-6">
              {availableWorkers.map((worker) => (
                <Card
                  key={worker.id}
                  className={`cursor-pointer transition-all ${selectedWorker === worker.id ? "ring-2 ring-blue-500 bg-blue-50" : "hover:shadow-md"}`}
                  onClick={() => setSelectedWorker(worker.id)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4">
                        <Avatar className="h-16 w-16">
                          <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h3 className="text-xl font-semibold text-gray-900 mb-1">{worker.name}</h3>
                          <div className="flex items-center space-x-4 mb-3">
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current mr-1" />
                              <span className="font-medium">{worker.rating}</span>
                              <span className="text-gray-600 ml-1">({worker.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 mr-1" />
                              <span>{worker.distance}</span>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {worker.specialties.map((specialty) => (
                              <Badge key={specialty} variant="secondary">
                                {specialty}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>Experience: {worker.experience}</div>
                            <div>Jobs completed: {worker.completedJobs}</div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-green-600 mb-2">{worker.price}</div>
                        <Badge className="mb-3">{worker.availability}</Badge>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline">
                            <Phone className="h-4 w-4 mr-1" />
                            Call
                          </Button>
                          <ChatButton />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="flex justify-between mt-8">
              <Button variant="outline" onClick={() => setStep(1)}>
                Back to Job Details
              </Button>
              <Button onClick={handleJobSubmit} disabled={!selectedWorker} size="lg">
                Continue to Booking
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Confirm Booking */}
        {step === 3 && selectedWorker && (
          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle>Confirm Your Booking</CardTitle>
                <CardDescription>Review your job details and confirm the booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Selected Worker */}
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h3 className="font-semibold mb-3">Selected Worker</h3>
                  {(() => {
                    const worker = availableWorkers.find((w) => w.id === selectedWorker)
                    return worker ? (
                      <div className="flex items-center space-x-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={worker.avatar || "/placeholder.svg"} />
                          <AvatarFallback>
                            {worker.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold">{worker.name}</h4>
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Star className="h-4 w-4 text-yellow-400 fill-current" />
                            <span>
                              {worker.rating} ({worker.reviews} reviews)
                            </span>
                            <span>•</span>
                            <span>{worker.price}</span>
                          </div>
                        </div>
                      </div>
                    ) : null
                  })()}
                </div>

                {/* Job Details Summary */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold mb-3">Job Details</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Service:</strong> {service}
                    </div>
                    <div>
                      <strong>Description:</strong> {jobDetails.description}
                    </div>
                    <div>
                      <strong>Location:</strong> {jobDetails.location}
                    </div>
                    <div>
                      <strong>Date:</strong> {jobDetails.date}
                    </div>
                    <div>
                      <strong>Time:</strong> {jobDetails.time}
                    </div>
                    {jobDetails.budget && (
                      <div>
                        <strong>Budget:</strong> {jobDetails.budget}
                      </div>
                    )}
                    <div>
                      <strong>Urgency:</strong> {jobDetails.urgency}
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-3">
                  <Label>Payment Method</Label>
                  <RadioGroup defaultValue="cash">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="cash" id="cash" />
                      <Label htmlFor="cash">Cash Payment</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="wallet" id="wallet" />
                      <Label htmlFor="wallet">Kaam Kinara Wallet</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="online" id="online" />
                      <Label htmlFor="online">Online Payment</Label>
                    </div>
                  </RadioGroup>
                </div>

                <div className="flex space-x-4">
                  <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
                    Back to Workers
                  </Button>
                  <Button onClick={handleBooking} className="flex-1" size="lg">
                    Confirm Booking
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
