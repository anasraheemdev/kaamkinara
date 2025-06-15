"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ProfileService, type UserProfile, type WorkerProfile } from "@/lib/supabase/profile-service"
import { supabase } from "@/lib/supabase/client"
import { Camera, Briefcase, Star, Award } from "lucide-react"

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [workerProfile, setWorkerProfile] = useState<WorkerProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        console.error("Auth error:", authError)
        router.push("/auth/login")
        return
      }

      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      const profile = await ProfileService.getUserProfile(user.id)

      if (!profile) {
        console.error("No profile found for user")
        toast({
          title: "Error",
          description: "Profile not found. Please contact support.",
          variant: "destructive",
        })
        return
      }

      setUserProfile(profile)

      if (profile?.role === "worker") {
        const workerData = await ProfileService.getWorkerProfile(user.id)
        setWorkerProfile(workerData)
      }
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load profile data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleProfileUpdate = async (updates: Partial<UserProfile>) => {
    if (!user || !userProfile) return

    setSaving(true)
    try {
      const success = await ProfileService.updateUserProfile(user.id, updates)
      if (success) {
        setUserProfile({ ...userProfile, ...updates })
        toast({
          title: "Success",
          description: "Profile updated successfully",
        })
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleWorkerProfileUpdate = async (updates: Partial<WorkerProfile>) => {
    if (!user || !workerProfile) return

    setSaving(true)
    try {
      const success = await ProfileService.updateWorkerProfile(user.id, updates)
      if (success) {
        setWorkerProfile({ ...workerProfile, ...updates })
        toast({
          title: "Success",
          description: "Worker profile updated successfully",
        })
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update worker profile",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !user) return

    setImageUploading(true)
    try {
      const imageUrl = await ProfileService.uploadProfileImage(user.id, file)
      if (imageUrl) {
        await handleProfileUpdate({ profile_image: imageUrl })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setImageUploading(false)
    }
  }

  if (loading) {
    return (
      <DashboardLayout userRole={userProfile?.role || "customer"}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    )
  }

  if (!userProfile) {
    return (
      <DashboardLayout userRole="customer">
        <div className="text-center py-8">
          <p>Profile not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout
      userRole={userProfile?.role || "customer"}
      userName={userProfile ? `${userProfile.first_name} ${userProfile.last_name}` : "Loading..."}
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Profile</h1>
          <Badge variant={userProfile.is_verified ? "default" : "secondary"}>
            {userProfile.is_verified ? "Verified" : "Unverified"}
          </Badge>
        </div>

        <Tabs defaultValue="personal" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Info</TabsTrigger>
            <TabsTrigger value="professional" disabled={userProfile.role !== "worker"}>
              Professional
            </TabsTrigger>
            <TabsTrigger value="portfolio" disabled={userProfile.role !== "worker"}>
              Portfolio
            </TabsTrigger>
          </TabsList>

          <TabsContent value="personal" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details and contact information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Profile Image */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.profile_image || "/placeholder.svg"} />
                    <AvatarFallback className="text-lg">
                      {userProfile.first_name[0]}
                      {userProfile.last_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Label htmlFor="profile-image" className="cursor-pointer">
                      <Button variant="outline" size="sm" disabled={imageUploading}>
                        <Camera className="h-4 w-4 mr-2" />
                        {imageUploading ? "Uploading..." : "Change Photo"}
                      </Button>
                    </Label>
                    <Input
                      id="profile-image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </div>
                </div>

                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <Input
                      id="firstName"
                      value={userProfile.first_name}
                      onChange={(e) => setUserProfile({ ...userProfile, first_name: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      value={userProfile.last_name}
                      onChange={(e) => setUserProfile({ ...userProfile, last_name: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={userProfile.email} disabled />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone || ""}
                      onChange={(e) => setUserProfile({ ...userProfile, phone: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dateOfBirth">Date of Birth</Label>
                    <Input
                      id="dateOfBirth"
                      type="date"
                      value={userProfile.date_of_birth || ""}
                      onChange={(e) => setUserProfile({ ...userProfile, date_of_birth: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={userProfile.gender || ""}
                      onValueChange={(value) => setUserProfile({ ...userProfile, gender: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City</Label>
                  <Input
                    id="city"
                    value={userProfile.city || ""}
                    onChange={(e) => setUserProfile({ ...userProfile, city: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={userProfile.address || ""}
                    onChange={(e) => setUserProfile({ ...userProfile, address: e.target.value })}
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={userProfile.bio || ""}
                    onChange={(e) => setUserProfile({ ...userProfile, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={4}
                  />
                </div>

                <Button onClick={() => handleProfileUpdate(userProfile)} disabled={saving} className="w-full md:w-auto">
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {userProfile.role === "worker" && workerProfile && (
            <>
              <TabsContent value="professional" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Professional Information</CardTitle>
                    <CardDescription>Manage your professional details and service offerings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="experienceLevel">Experience Level</Label>
                        <Select
                          value={workerProfile.experience_level || ""}
                          onValueChange={(value) => setWorkerProfile({ ...workerProfile, experience_level: value })}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Beginner (0-2 years)</SelectItem>
                            <SelectItem value="intermediate">Intermediate (2-5 years)</SelectItem>
                            <SelectItem value="experienced">Experienced (5-10 years)</SelectItem>
                            <SelectItem value="expert">Expert (10+ years)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="hourlyRate">Hourly Rate (PKR)</Label>
                        <Input
                          id="hourlyRate"
                          type="number"
                          value={workerProfile.hourly_rate || ""}
                          onChange={(e) =>
                            setWorkerProfile({ ...workerProfile, hourly_rate: Number.parseFloat(e.target.value) })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="skills">Skills</Label>
                      <Input
                        id="skills"
                        value={workerProfile.skills.join(", ")}
                        onChange={(e) =>
                          setWorkerProfile({ ...workerProfile, skills: e.target.value.split(", ").filter(Boolean) })
                        }
                        placeholder="Enter skills separated by commas"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="languages">Languages</Label>
                      <Input
                        id="languages"
                        value={workerProfile.languages.join(", ")}
                        onChange={(e) =>
                          setWorkerProfile({ ...workerProfile, languages: e.target.value.split(", ").filter(Boolean) })
                        }
                        placeholder="Enter languages separated by commas"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="serviceRadius">Service Radius (km)</Label>
                      <Input
                        id="serviceRadius"
                        type="number"
                        value={workerProfile.service_radius}
                        onChange={(e) =>
                          setWorkerProfile({ ...workerProfile, service_radius: Number.parseInt(e.target.value) })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="professionalBio">Professional Bio</Label>
                      <Textarea
                        id="professionalBio"
                        value={workerProfile.bio || ""}
                        onChange={(e) => setWorkerProfile({ ...workerProfile, bio: e.target.value })}
                        placeholder="Describe your professional experience and services..."
                        rows={4}
                      />
                    </div>

                    <Button
                      onClick={() => handleWorkerProfileUpdate(workerProfile)}
                      disabled={saving}
                      className="w-full md:w-auto"
                    >
                      {saving ? "Saving..." : "Save Professional Info"}
                    </Button>
                  </CardContent>
                </Card>

                {/* Stats Card */}
                <Card>
                  <CardHeader>
                    <CardTitle>Performance Stats</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Star className="h-5 w-5 text-yellow-500 mr-1" />
                          <span className="text-2xl font-bold">{workerProfile.rating.toFixed(1)}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Average Rating</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Briefcase className="h-5 w-5 text-blue-500 mr-1" />
                          <span className="text-2xl font-bold">{workerProfile.total_jobs}</span>
                        </div>
                        <p className="text-sm text-muted-foreground">Jobs Completed</p>
                      </div>
                      <div className="text-center">
                        <div className="flex items-center justify-center mb-2">
                          <Award className="h-5 w-5 text-green-500 mr-1" />
                          <Badge variant={workerProfile.verification_status === "verified" ? "default" : "secondary"}>
                            {workerProfile.verification_status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">Verification Status</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="portfolio" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Portfolio & Certifications</CardTitle>
                    <CardDescription>Showcase your work and professional certifications</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label>Portfolio Images</Label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {workerProfile.portfolio_images.map((image, index) => (
                          <div
                            key={index}
                            className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center"
                          >
                            <img
                              src={image || "/placeholder.svg"}
                              alt={`Portfolio ${index + 1}`}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          </div>
                        ))}
                        <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-gray-400">
                          <Camera className="h-8 w-8 text-gray-400" />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="certifications">Certifications</Label>
                      <Input
                        id="certifications"
                        value={workerProfile.certifications.join(", ")}
                        onChange={(e) =>
                          setWorkerProfile({
                            ...workerProfile,
                            certifications: e.target.value.split(", ").filter(Boolean),
                          })
                        }
                        placeholder="Enter certifications separated by commas"
                      />
                    </div>

                    <Button
                      onClick={() => handleWorkerProfileUpdate(workerProfile)}
                      disabled={saving}
                      className="w-full md:w-auto"
                    >
                      {saving ? "Saving..." : "Save Portfolio"}
                    </Button>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
