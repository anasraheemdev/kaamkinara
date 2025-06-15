"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  LayoutDashboard,
  Search,
  Calendar,
  MessageSquare,
  Star,
  Settings,
  User,
  Briefcase,
  TrendingUp,
  Clock,
  Wallet,
} from "lucide-react"

interface SidebarNavProps {
  userRole: "customer" | "worker"
  className?: string
}

export function SidebarNav({ userRole, className }: SidebarNavProps) {
  const pathname = usePathname()

  const customerNavItems = [
    {
      title: "Dashboard",
      href: "/customer/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Find Services",
      href: "/customer/services",
      icon: Search,
    },
    {
      title: "My Bookings",
      href: "/customer/bookings",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: 3,
    },
    {
      title: "Reviews",
      href: "/customer/reviews",
      icon: Star,
    },
    {
      title: "Profile",
      href: "/customer/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/customer/settings",
      icon: Settings,
    },
  ]

  const workerNavItems = [
    {
      title: "Dashboard",
      href: "/worker/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "My Gigs",
      href: "/worker/gigs",
      icon: Briefcase,
    },
    {
      title: "Job Requests",
      href: "/worker/jobs",
      icon: Clock,
      badge: 5,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
      badge: 2,
    },
    {
      title: "Analytics",
      href: "/worker/analytics",
      icon: TrendingUp,
    },
    {
      title: "Earnings",
      href: "/worker/earnings",
      icon: Wallet,
    },
    {
      title: "Reviews",
      href: "/worker/reviews",
      icon: Star,
    },
    {
      title: "Profile",
      href: "/worker/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/worker/settings",
      icon: Settings,
    },
  ]

  const navItems = userRole === "customer" ? customerNavItems : workerNavItems

  return (
    <nav className={cn("space-y-2", className)}>
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <Button variant={pathname === item.href ? "secondary" : "ghost"} className="w-full justify-start">
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
            {item.badge && (
              <Badge variant="destructive" className="ml-auto">
                {item.badge}
              </Badge>
            )}
          </Button>
        </Link>
      ))}
    </nav>
  )
}
