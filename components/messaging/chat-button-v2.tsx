"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { ChatInterfaceV2 } from "./chat-interface-v2"
import { messagingService } from "@/lib/supabase/messaging-service"
import { getCurrentUser } from "@/lib/supabase/client"

interface ChatButtonV2Props {
  chatId?: string
  customerId?: string
  workerId?: string
  serviceTitle?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ChatButtonV2({
  chatId,
  customerId,
  workerId,
  serviceTitle,
  variant = "outline",
  size = "sm",
  className,
}: ChatButtonV2Props) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    const loadUnreadCount = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        const chatRooms = await messagingService.getChatRooms(user.id)
        const total = chatRooms.reduce((sum, room) => sum + (room.unread_count || 0), 0)
        setUnreadCount(total)
      } catch (error) {
        console.error("Error loading unread count:", error)
      }
    }

    loadUnreadCount()
  }, [])

  return (
    <>
      <Button variant={variant} size={size} className={`relative ${className}`} onClick={() => setIsChatOpen(true)}>
        <MessageCircle className="h-4 w-4 mr-1" />
        Chat
        {unreadCount > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      <ChatInterfaceV2
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialChatId={chatId}
        customerId={customerId}
        workerId={workerId}
        serviceTitle={serviceTitle}
      />
    </>
  )
}
