"use client"

import type React from "react"

import { useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Wrench, Users, Loader2 } from "lucide-react"
import { AuthService, type SignUpData } from "@/lib/auth/auth-service"
import { useToast } from "@/hooks/use-toast"

function SignUpForm() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const defaultRole = searchParams.get("role") || "customer"

  const [selectedRole, setSelectedRole] = useState<"customer" | "worker">(defaultRole as "customer" | "worker")
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    city: "",
    address: "",
    cnic: "",
    experienceLevel: "",
    bio: "",
  })

  const skills = [
    "Plumber",
    "Electrician",
    "Mason",
    "Painter",
    "Carpenter",
    "Cleaner",
    "AC Repair",
    "Appliance Repair",
    "Gardening",
    "Moving",
    "Pest Control",
  ]

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) => (prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]))
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive",
      })
      return
    }

    if (selectedRole === "worker" && selectedSkills.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one skill",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      const signUpData: SignUpData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        role: selectedRole,
        city: formData.city,
        address: formData.address,
      }

      if (selectedRole === "worker") {
        signUpData.cnic = formData.cnic
        signUpData.skills = selectedSkills
        signUpData.experienceLevel = formData.experienceLevel
        signUpData.bio = formData.bio
      }

      await AuthService.signUp(signUpData)

      toast({
        title: "Success!",
        description:
          selectedRole === "worker"
            ? "Account created! Please check your email to verify your account. Your worker profile will be reviewed for verification."
            : "Account created! Please check your email to verify your account.",
      })

      // Redirect based on role
      setTimeout(() => {
        if (selectedRole === "worker") {
          router.push("/worker/dashboard")
        } else {
          router.push("/customer/dashboard")
        }
      }, 2000)
    } catch (error: any) {
      console.error("Sign up error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to create account. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-2 mb-4">
            <Wrench className="h-8 w-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">Kaam Kinara</span>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Create Your Account</h1>
          <p className="text-gray-600">Join thousands of satisfied customers and workers</p>
        </div>

        <Card>
          <CardHeader>
            <Tabs
              value={selectedRole}
              onValueChange={(value) => setSelectedRole(value as "customer" | "worker")}
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="customer" className="flex items-center space-x-2">
                  <Users className="h-4 w-4" />
                  <span>I Need Work Done</span>
                </TabsTrigger>
                <TabsTrigger value="worker" className="flex items-center space-x-2">
                  <Wrench className="h-4 w-4" />
                  <span>I Want to Work</span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="customer" className="mt-6">
                <CardTitle>Customer Registration</CardTitle>
                <CardDescription>Create an account to hire skilled workers for your projects</CardDescription>
              </TabsContent>

              <TabsContent value="worker" className="mt-6">
                <CardTitle>Worker Registration</CardTitle>
                <CardDescription>Join our platform and start earning by offering your services</CardDescription>
              </TabsContent>
            </Tabs>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    id="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    id="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+92 300 1234567"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Create a strong password"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                />
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Select value={formData.city} onValueChange={(value) => handleInputChange("city", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your city" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="karachi">Karachi</SelectItem>
                    <SelectItem value="lahore">Lahore</SelectItem>
                    <SelectItem value="islamabad">Islamabad</SelectItem>
                    <SelectItem value="rawalpindi">Rawalpindi</SelectItem>
                    <SelectItem value="faisalabad">Faisalabad</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  placeholder="Enter your complete address"
                  value={formData.address}
                  onChange={(e) => handleInputChange("address", e.target.value)}
                />
              </div>

              {/* Worker-specific fields */}
              {selectedRole === "worker" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="cnic">CNIC Number</Label>
                    <Input
                      id="cnic"
                      placeholder="12345-6789012-3"
                      value={formData.cnic}
                      onChange={(e) => handleInputChange("cnic", e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Skills & Services</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {skills.map((skill) => (
                        <div
                          key={skill}
                          onClick={() => toggleSkill(skill)}
                          className={`cursor-pointer p-2 rounded-lg border text-center text-sm transition-colors ${
                            selectedSkills.includes(skill)
                              ? "bg-blue-100 border-blue-300 text-blue-700"
                              : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                          }`}
                        >
                          {skill}
                        </div>
                      ))}
                    </div>
                    {selectedSkills.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {selectedSkills.map((skill) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="experience">Years of Experience</Label>
                    <Select
                      value={formData.experienceLevel}
                      onValueChange={(value) => handleInputChange("experienceLevel", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select experience level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1">0-1 years</SelectItem>
                        <SelectItem value="2-5">2-5 years</SelectItem>
                        <SelectItem value="6-10">6-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">About Yourself</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell customers about your experience and expertise..."
                      rows={3}
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                    />
                  </div>
                </>
              )}

              {/* Terms and Conditions */}
              <div className="flex items-center space-x-2">
                <Checkbox id="terms" required />
                <Label htmlFor="terms" className="text-sm">
                  I agree to the{" "}
                  <Link href="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link href="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {selectedRole === "worker" && (
                <div className="flex items-center space-x-2">
                  <Checkbox id="verification" required />
                  <Label htmlFor="verification" className="text-sm">
                    I understand that my account will be reviewed and verified before activation
                  </Label>
                </div>
              )}

              <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : selectedRole === "worker" ? (
                  "Submit for Verification"
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-blue-600 hover:underline">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Loading...</p>
          </div>
        </div>
      }
    >
      <SignUpForm />
    </Suspense>
  )
}
