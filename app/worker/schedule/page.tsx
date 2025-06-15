"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ScheduleManagerSupabase } from "@/components/calendar/schedule-manager-supabase"

export default function WorkerSchedulePage() {
  // Mock user ID - in real app, this would come from auth context
  const userId = "550e8400-e29b-41d4-a716-446655440002"

  return (
    <DashboardLayout userRole="worker" userName="Ahmed Hassan">
      <ScheduleManagerSupabase userId={userId} />
    </DashboardLayout>
  )
}
