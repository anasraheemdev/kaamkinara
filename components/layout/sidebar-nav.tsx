"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  Briefcase,
  Settings,
  User,
  Search,
  Star,
  CreditCard,
  BarChart3,
  Users,
  Shield,
} from "lucide-react"

interface SidebarNavProps {
  userRole: "customer" | "worker" | "admin"
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
      href: "/customer/schedule",
      icon: Calendar,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
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
      title: "My Schedule",
      href: "/worker/schedule",
      icon: Calendar,
    },
    {
      title: "Gigs",
      href: "/worker/gigs",
      icon: Briefcase,
    },
    {
      title: "Messages",
      href: "/messages",
      icon: MessageSquare,
    },
    {
      title: "Reviews",
      href: "/worker/reviews",
      icon: Star,
    },
    {
      title: "Earnings",
      href: "/worker/earnings",
      icon: CreditCard,
    },
    {
      title: "Profile",
      href: "/profile",
      icon: User,
    },
    {
      title: "Settings",
      href: "/settings",
      icon: Settings,
    },
  ]

  const adminNavItems = [
    {
      title: "Dashboard",
      href: "/admin/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Users",
      href: "/admin/users",
      icon: Users,
    },
    {
      title: "Workers",
      href: "/admin/workers",
      icon: Shield,
    },
    {
      title: "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      title: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const getNavItems = () => {
    switch (userRole) {
      case "customer":
        return customerNavItems
      case "worker":
        return workerNavItems
      case "admin":
        return adminNavItems
      default:
        return customerNavItems
    }
  }

  const navItems = getNavItems()

  return (
    <nav className={cn("flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1", className)}>
      {navItems.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn("w-full justify-start", pathname === item.href && "bg-muted font-medium")}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
