"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ProfileService, type UserProfile, type UserSettings, type UserAddress } from "@/lib/supabase/profile-service"
import { supabase } from "@/lib/supabase/client"
import {
  Bell,
  Shield,
  Globe,
  MapPin,
  Plus,
  Trash2,
  Edit,
  Key,
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  Moon,
  Sun,
} from "lucide-react"

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null)
  const [userAddresses, setUserAddresses] = useState<UserAddress[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    loadUserData()
  }, [])

  const loadUserData = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      if (!user) {
        router.push("/auth/login")
        return
      }

      setUser(user)
      const [profile, settings, addresses] = await Promise.all([
        ProfileService.getUserProfile(user.id),
        ProfileService.getUserSettings(user.id),
        ProfileService.getUserAddresses(user.id),
      ])

      setUserProfile(profile)
      setUserSettings(settings)
      setUserAddresses(addresses)
    } catch (error) {
      console.error("Error loading user data:", error)
      toast({
        title: "Error",
        description: "Failed to load settings",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSettingsUpdate = async (updates: Partial<UserSettings>) => {
    if (!user) return

    setSaving(true)
    try {
      const success = await ProfileService.updateUserSettings(user.id, updates)
      if (success) {
        setUserSettings((prev) => (prev ? { ...prev, ...updates } : null))
        toast({
          title: "Success",
          description: "Settings updated successfully",
        })
      } else {
        throw new Error("Update failed")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handleAddAddress = async () => {
    if (!user) return

    const newAddress: Omit<UserAddress, "id" | "user_id"> = {
      label: "Home",
      address_line_1: "",
      city: "",
      country: "Pakistan",
      is_default: userAddresses.length === 0,
    }

    const success = await ProfileService.addUserAddress(user.id, newAddress)
    if (success) {
      loadUserData() // Reload to get the new address
      toast({
        title: "Success",
        description: "Address added successfully",
      })
    }
  }

  const handleDeleteAddress = async (addressId: string) => {
    const success = await ProfileService.deleteUserAddress(addressId)
    if (success) {
      setUserAddresses((prev) => prev.filter((addr) => addr.id !== addressId))
      toast({
        title: "Success",
        description: "Address deleted successfully",
      })
    }
  }

  const handlePasswordChange = async () => {
    // This would typically open a modal or redirect to a password change form
    toast({
      title: "Password Change",
      description: "Password change functionality would be implemented here",
    })
  }

  const handleAccountDeactivation = async () => {
    // This would typically show a confirmation dialog
    toast({
      title: "Account Deactivation",
      description: "Account deactivation would require additional confirmation",
      variant: "destructive",
    })
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

  if (!userProfile || !userSettings) {
    return (
      <DashboardLayout userRole="customer">
        <div className="text-center py-8">
          <p>Settings not found</p>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout userRole={userProfile.role} userName={`${userProfile.first_name} ${userProfile.last_name}`}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="preferences">Preferences</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Bell className="h-5 w-5 mr-2" />
                  Notification Settings
                </CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive push notifications on your device</p>
                  </div>
                  <Switch
                    checked={userSettings.push_notifications}
                    onCheckedChange={(checked) => handleSettingsUpdate({ push_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center">
                      <Mail className="h-4 w-4 mr-2" />
                      Email Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <Switch
                    checked={userSettings.email_notifications}
                    onCheckedChange={(checked) => handleSettingsUpdate({ email_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      SMS Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground">Receive notifications via SMS</p>
                  </div>
                  <Switch
                    checked={userSettings.sms_notifications}
                    onCheckedChange={(checked) => handleSettingsUpdate({ sms_notifications: checked })}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Marketing Emails</Label>
                    <p className="text-sm text-muted-foreground">Receive promotional emails and updates</p>
                  </div>
                  <Switch
                    checked={userSettings.marketing_emails}
                    onCheckedChange={(checked) => handleSettingsUpdate({ marketing_emails: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Eye className="h-5 w-5 mr-2" />
                  Privacy Settings
                </CardTitle>
                <CardDescription>Control your privacy and data sharing preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="profileVisibility">Profile Visibility</Label>
                  <Select
                    value={userSettings.privacy_profile}
                    onValueChange={(value) => handleSettingsUpdate({ privacy_profile: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public - Visible to everyone</SelectItem>
                      <SelectItem value="private">Private - Only visible to connections</SelectItem>
                      <SelectItem value="hidden">Hidden - Not visible in search</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-muted-foreground">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={userSettings.two_factor_enabled}
                    onCheckedChange={(checked) => handleSettingsUpdate({ two_factor_enabled: checked })}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="addresses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <div className="flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Saved Addresses
                  </div>
                  <Button onClick={handleAddAddress} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Address
                  </Button>
                </CardTitle>
                <CardDescription>Manage your saved addresses for quick booking</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {userAddresses.length === 0 ? (
                  <p className="text-center text-muted-foreground py-8">No addresses saved yet</p>
                ) : (
                  userAddresses.map((address) => (
                    <div key={address.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{address.label}</span>
                          {address.is_default && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Default</span>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {address.address_line_1}
                          {address.address_line_2 && `, ${address.address_line_2}`}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.country}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => handleDeleteAddress(address.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Globe className="h-5 w-5 mr-2" />
                  App Preferences
                </CardTitle>
                <CardDescription>Customize your app experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select
                    value={userSettings.language}
                    onValueChange={(value) => handleSettingsUpdate({ language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="ur">Urdu</SelectItem>
                      <SelectItem value="hi">Hindi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select
                    value={userSettings.timezone}
                    onValueChange={(value) => handleSettingsUpdate({ timezone: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Asia/Karachi">Pakistan Standard Time</SelectItem>
                      <SelectItem value="UTC">UTC</SelectItem>
                      <SelectItem value="Asia/Dubai">Gulf Standard Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="theme">Theme</Label>
                  <Select value={userSettings.theme} onValueChange={(value) => handleSettingsUpdate({ theme: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="light">
                        <div className="flex items-center">
                          <Sun className="h-4 w-4 mr-2" />
                          Light
                        </div>
                      </SelectItem>
                      <SelectItem value="dark">
                        <div className="flex items-center">
                          <Moon className="h-4 w-4 mr-2" />
                          Dark
                        </div>
                      </SelectItem>
                      <SelectItem value="system">System</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="h-5 w-5 mr-2" />
                  Security Settings
                </CardTitle>
                <CardDescription>Manage your account security</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center">
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Label>
                    <p className="text-sm text-muted-foreground">Update your account password</p>
                  </div>
                  <Button variant="outline" onClick={handlePasswordChange}>
                    Change
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-base flex items-center">
                      <Smartphone className="h-4 w-4 mr-2" />
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-muted-foreground">
                      {userSettings.two_factor_enabled ? "Enabled" : "Add extra security to your account"}
                    </p>
                  </div>
                  <Button variant="outline">{userSettings.two_factor_enabled ? "Manage" : "Enable"}</Button>
                </div>

                <div className="border-t pt-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label className="text-base">Deactivate Account</Label>
                        <p className="text-sm text-muted-foreground">Temporarily disable your account</p>
                      </div>
                      <Button variant="destructive" onClick={handleAccountDeactivation}>
                        Deactivate
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  )
}
