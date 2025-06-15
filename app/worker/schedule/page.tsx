"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ScheduleManager } from "@/components/calendar/schedule-manager"

export default function WorkerSchedulePage() {
  return (
    <DashboardLayout userRole="worker" userName="Ahmed Hassan">
      <ScheduleManager />
    </DashboardLayout>
  )
}
