"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore, type ChatRoom } from "@/lib/chat-store"
import { Send, Phone, Video, MoreVertical, ImageIcon, MapPin, Check, CheckCheck, X } from "lucide-react"
import { formatDistanceToNow } from "date-fns"

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
  initialChatId?: string
}

export function ChatInterface({ isOpen, onClose, initialChatId }: ChatInterfaceProps) {
  const {
    chatRooms,
    messages,
    currentUserId,
    currentUserRole,
    activeChatId,
    setActiveChat,
    sendMessage,
    markMessagesAsRead,
  } = useChatStore()

  const [messageInput, setMessageInput] = useState("")
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (initialChatId && isOpen) {
      setActiveChat(initialChatId)
    }
  }, [initialChatId, isOpen, setActiveChat])

  useEffect(() => {
    if (activeChatId) {
      const chat = chatRooms.find((room) => room.id === activeChatId)
      setSelectedChat(chat || null)
    }
  }, [activeChatId, chatRooms])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages, activeChatId])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen, selectedChat])

  const handleSendMessage = () => {
    if (!messageInput.trim() || !activeChatId) return

    sendMessage(activeChatId, messageInput.trim())
    setMessageInput("")
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatMessageTime = (timestamp: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(timestamp)
  }

  const getOtherUser = (chatRoom: ChatRoom) => {
    return currentUserRole === "customer"
      ? { id: chatRoom.workerId, name: chatRoom.workerName, role: "worker" as const }
      : { id: chatRoom.customerId, name: chatRoom.customerName, role: "customer" as const }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl h-[600px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <span>Messages</span>
            {chatRooms.reduce((total, room) => total + room.unreadCount, 0) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {chatRooms.reduce((total, room) => total + room.unreadCount, 0)}
              </Badge>
            )}
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="flex-1 flex p-0 overflow-hidden">
          {/* Chat List */}
          <div className="w-1/3 border-r">
            <ScrollArea className="h-full">
              <div className="p-4 space-y-2">
                {chatRooms.map((chatRoom) => {
                  const otherUser = getOtherUser(chatRoom)
                  const isActive = activeChatId === chatRoom.id

                  return (
                    <div
                      key={chatRoom.id}
                      onClick={() => setActiveChat(chatRoom.id)}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive ? "bg-blue-100 border-blue-200" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src="/placeholder.svg?height=40&width=40" />
                          <AvatarFallback>
                            {otherUser.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h4 className="font-semibold text-sm truncate">{otherUser.name}</h4>
                            {chatRoom.unreadCount > 0 && (
                              <Badge variant="destructive" className="text-xs">
                                {chatRoom.unreadCount}
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mb-1">{chatRoom.jobTitle}</p>
                          {chatRoom.lastMessage && (
                            <div className="flex items-center justify-between">
                              <p className="text-xs text-gray-500 truncate">{chatRoom.lastMessage.content}</p>
                              <span className="text-xs text-gray-400 ml-2">
                                {formatDistanceToNow(chatRoom.lastMessage.timestamp, { addSuffix: true })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 flex flex-col">
            {selectedChat ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b bg-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src="/placeholder.svg?height=40&width=40" />
                        <AvatarFallback>
                          {getOtherUser(selectedChat)
                            .name.split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">{getOtherUser(selectedChat).name}</h3>
                        <p className="text-sm text-gray-600">{selectedChat.jobTitle}</p>
                      </div>
                    </div>
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

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages[selectedChat.id]?.map((message) => {
                      const isOwn = message.senderId === currentUserId

                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {message.type === "text" && <p className="text-sm">{message.content}</p>}
                              {message.type === "system" && (
                                <p className="text-xs text-center text-gray-500 italic">{message.content}</p>
                              )}
                            </div>
                            <div
                              className={`flex items-center mt-1 space-x-1 ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <span className="text-xs text-gray-500">{formatMessageTime(message.timestamp)}</span>
                              {isOwn && (
                                <div className="text-gray-500">
                                  {message.read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-600" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          {!isOwn && (
                            <Avatar className="h-8 w-8 order-1 mr-2">
                              <AvatarImage src="/placeholder.svg?height=32&width=32" />
                              <AvatarFallback className="text-xs">
                                {message.senderName
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="sm">
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm">
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="pr-12"
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim()}
                        size="sm"
                        className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                <div className="text-center">
                  <div className="text-4xl mb-4">💬</div>
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
