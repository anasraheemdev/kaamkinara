"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Wrench, Search, Phone, Video, MoreVertical, ArrowLeft } from "lucide-react"
import { useChatStore } from "@/lib/chat-store"
import { ChatInterface } from "@/components/chat/chat-interface"

export default function MessagesPage() {
  const { chatRooms, currentUserRole, setCurrentUser } = useChatStore()

  useEffect(() => {
    // Set current user based on route or context
    setCurrentUser("customer-1", "customer")
  }, [setCurrentUser])

  const getOtherUser = (chatRoom: any) => {
    return currentUserRole === "customer"
      ? { id: chatRoom.workerId, name: chatRoom.workerName, role: "worker" as const }
      : { id: chatRoom.customerId, name: chatRoom.customerName, role: "customer" as const }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/customer/dashboard">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <Link href="/" className="flex items-center space-x-2">
                <Wrench className="h-6 w-6 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">Kaam Kinara</span>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Messages</h1>
          <p className="text-gray-600">Communicate with your workers and customers</p>
        </div>

        {/* Search */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input placeholder="Search conversations..." className="pl-10" />
            </div>
          </CardContent>
        </Card>

        {/* Conversations List */}
        <div className="grid gap-4">
          {chatRooms.map((chatRoom) => {
            const otherUser = getOtherUser(chatRoom)

            return (
              <Card key={chatRoom.id} className="hover:shadow-md transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src="/placeholder.svg?height=48&width=48" />
                        <AvatarFallback>
                          {otherUser.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-lg">{otherUser.name}</h3>
                        <p className="text-gray-600 mb-1">{chatRoom.jobTitle}</p>
                        {chatRoom.lastMessage && (
                          <p className="text-sm text-gray-500">
                            {chatRoom.lastMessage.content.length > 50
                              ? `${chatRoom.lastMessage.content.substring(0, 50)}...`
                              : chatRoom.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      {chatRoom.unreadCount > 0 && <Badge variant="destructive">{chatRoom.unreadCount}</Badge>}
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm">
                          <Phone className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Video className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {chatRooms.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No conversations yet</h3>
              <p className="text-gray-600 mb-4">Start a conversation by booking a service or accepting a job</p>
              <Link href="/customer/dashboard">
                <Button>Browse Services</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Full-screen chat interface */}
      <ChatInterface isOpen={false} onClose={() => {}} />
    </div>
  )
}
