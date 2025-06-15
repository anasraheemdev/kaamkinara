"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { useChatStore } from "@/lib/chat-store"

interface ChatButtonProps {
  chatId?: string
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg"
  className?: string
}

export function ChatButton({ chatId, variant = "outline", size = "sm", className }: ChatButtonProps) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { chatRooms } = useChatStore()

  const totalUnread = chatRooms.reduce((total, room) => total + room.unreadCount, 0)

  return (
    <>
      <Button variant={variant} size={size} className={`relative ${className}`} onClick={() => setIsChatOpen(true)}>
        <MessageCircle className="h-4 w-4 mr-1" />
        Chat
        {totalUnread > 0 && (
          <Badge
            variant="destructive"
            className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
          >
            {totalUnread > 9 ? "9+" : totalUnread}
          </Badge>
        )}
      </Button>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} initialChatId={chatId} />
    </>
  )
}
