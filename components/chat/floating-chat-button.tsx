"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageCircle } from "lucide-react"
import { ChatInterface } from "./chat-interface"
import { useChatStore } from "@/lib/chat-store"

export function FloatingChatButton() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const { chatRooms } = useChatStore()

  const totalUnread = chatRooms.reduce((total, room) => total + room.unreadCount, 0)

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <Button
          onClick={() => setIsChatOpen(true)}
          size="lg"
          className="rounded-full h-14 w-14 shadow-lg hover:shadow-xl transition-shadow relative"
        >
          <MessageCircle className="h-6 w-6" />
          {totalUnread > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-2 -right-2 h-6 w-6 flex items-center justify-center p-0 text-xs"
            >
              {totalUnread > 9 ? "9+" : totalUnread}
            </Badge>
          )}
        </Button>
      </div>

      <ChatInterface isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
    </>
  )
}
