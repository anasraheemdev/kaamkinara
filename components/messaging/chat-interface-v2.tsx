"use client"

import type React from "react"
import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Textarea } from "@/components/ui/textarea"
import { messagingService, type ChatRoom, type Message } from "@/lib/supabase/messaging-service"
import { getCurrentUser } from "@/lib/supabase/client"
import {
  Send,
  Phone,
  Video,
  MoreVertical,
  ImageIcon,
  MapPin,
  Check,
  CheckCheck,
  X,
  Paperclip,
  Smile,
  Reply,
  PhoneCall,
  PhoneOff,
  Mic,
  MicOff,
  VideoIcon,
  VideoOff,
} from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useToast } from "@/hooks/use-toast"

interface ChatInterfaceV2Props {
  isOpen: boolean
  onClose: () => void
  initialChatId?: string
  customerId?: string
  workerId?: string
  serviceTitle?: string
}

export function ChatInterfaceV2({
  isOpen,
  onClose,
  initialChatId,
  customerId,
  workerId,
  serviceTitle,
}: ChatInterfaceV2Props) {
  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([])
  const [selectedChat, setSelectedChat] = useState<ChatRoom | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [messageInput, setMessageInput] = useState("")
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [isCallActive, setIsCallActive] = useState(false)
  const [callType, setCallType] = useState<"voice" | "video" | null>(null)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [replyingTo, setReplyingTo] = useState<Message | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Initialize user and chat rooms
  useEffect(() => {
    const initializeChat = async () => {
      try {
        const user = await getCurrentUser()
        if (!user) return

        setCurrentUser(user)

        // If we have customer and worker IDs, create or find chat room
        if (customerId && workerId && serviceTitle) {
          try {
            const chatRoom = await messagingService.createChatRoom(customerId, workerId, serviceTitle)
            setSelectedChat(chatRoom)
            loadMessages(chatRoom.id)
          } catch (error) {
            console.error("Error creating chat room:", error)
          }
        }

        // Load existing chat rooms
        const rooms = await messagingService.getChatRooms(user.id)
        setChatRooms(rooms)

        // Select initial chat if provided
        if (initialChatId) {
          const room = rooms.find((r) => r.id === initialChatId)
          if (room) {
            setSelectedChat(room)
            loadMessages(room.id)
          }
        }
      } catch (error) {
        console.error("Error initializing chat:", error)
        toast({
          title: "Error",
          description: "Failed to load chat. Please try again.",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (isOpen) {
      initializeChat()
    }
  }, [isOpen, initialChatId, customerId, workerId, serviceTitle])

  // Load messages for selected chat
  const loadMessages = useCallback(
    async (chatRoomId: string) => {
      try {
        const msgs = await messagingService.getMessages(chatRoomId)
        setMessages(msgs)

        // Mark messages as read
        if (currentUser) {
          await messagingService.markMessagesAsRead(chatRoomId, currentUser.id)
        }

        // Subscribe to real-time messages
        const channel = messagingService.subscribeToMessages(chatRoomId, (newMessage) => {
          setMessages((prev) => [...prev, newMessage])
          // Auto-scroll to bottom
          setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100)
        })

        return () => {
          messagingService.unsubscribe(`messages:${chatRoomId}`)
        }
      } catch (error) {
        console.error("Error loading messages:", error)
        toast({
          title: "Error",
          description: "Failed to load messages.",
          variant: "destructive",
        })
      }
    },
    [currentUser, toast],
  )

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Handle chat selection
  const handleChatSelect = (chatRoom: ChatRoom) => {
    setSelectedChat(chatRoom)
    setMessages([])
    loadMessages(chatRoom.id)
  }

  // Send message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedChat || !currentUser || sending) return

    setSending(true)
    try {
      await messagingService.sendMessage(
        selectedChat.id,
        currentUser.id,
        messageInput.trim(),
        "text",
        undefined,
        undefined,
        undefined,
        replyingTo?.id,
      )

      setMessageInput("")
      setReplyingTo(null)
      inputRef.current?.focus()
    } catch (error) {
      console.error("Error sending message:", error)
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      })
    } finally {
      setSending(false)
    }
  }

  // Handle file upload
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file || !selectedChat || !currentUser) return

    try {
      const { url, fileName, fileSize } = await messagingService.uploadMessageFile(file, selectedChat.id)

      await messagingService.sendMessage(
        selectedChat.id,
        currentUser.id,
        fileName,
        file.type.startsWith("image/") ? "image" : "file",
        url,
        fileName,
        fileSize,
      )

      toast({
        title: "Success",
        description: "File uploaded successfully.",
      })
    } catch (error) {
      console.error("Error uploading file:", error)
      toast({
        title: "Error",
        description: "Failed to upload file. Please try again.",
        variant: "destructive",
      })
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  // Handle voice call
  const handleVoiceCall = async () => {
    if (!selectedChat || !currentUser) return

    try {
      const otherUserId =
        selectedChat.customer_id === currentUser.id ? selectedChat.worker_id : selectedChat.customer_id

      await messagingService.initiateCall(selectedChat.id, currentUser.id, otherUserId, "voice")
      setIsCallActive(true)
      setCallType("voice")

      toast({
        title: "Call Started",
        description: "Voice call initiated.",
      })
    } catch (error) {
      console.error("Error starting voice call:", error)
      toast({
        title: "Error",
        description: "Failed to start call. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Handle video call
  const handleVideoCall = async () => {
    if (!selectedChat || !currentUser) return

    try {
      const otherUserId =
        selectedChat.customer_id === currentUser.id ? selectedChat.worker_id : selectedChat.customer_id

      await messagingService.initiateCall(selectedChat.id, currentUser.id, otherUserId, "video")
      setIsCallActive(true)
      setCallType("video")

      toast({
        title: "Call Started",
        description: "Video call initiated.",
      })
    } catch (error) {
      console.error("Error starting video call:", error)
      toast({
        title: "Error",
        description: "Failed to start call. Please try again.",
        variant: "destructive",
      })
    }
  }

  // End call
  const handleEndCall = () => {
    setIsCallActive(false)
    setCallType(null)
    setIsMuted(false)
    setIsVideoOff(false)

    toast({
      title: "Call Ended",
      description: "Call has been ended.",
    })
  }

  // Handle keyboard shortcuts
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  // Format message time
  const formatMessageTime = (timestamp: string) => {
    return new Intl.DateTimeFormat("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }).format(new Date(timestamp))
  }

  // Get other user info
  const getOtherUser = (chatRoom: ChatRoom) => {
    if (!currentUser) return null

    return currentUser.id === chatRoom.customer_id
      ? { ...chatRoom.worker, role: "worker" as const }
      : { ...chatRoom.customer, role: "customer" as const }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-6xl h-[700px] flex flex-col">
        <CardHeader className="flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center space-x-2">
            <span>Messages</span>
            {chatRooms.reduce((total, room) => total + (room.unread_count || 0), 0) > 0 && (
              <Badge variant="destructive" className="ml-2">
                {chatRooms.reduce((total, room) => total + (room.unread_count || 0), 0)}
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
                {loading ? (
                  <div className="text-center py-8">Loading chats...</div>
                ) : chatRooms.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No conversations yet</div>
                ) : (
                  chatRooms.map((chatRoom) => {
                    const otherUser = getOtherUser(chatRoom)
                    const isActive = selectedChat?.id === chatRoom.id

                    return (
                      <div
                        key={chatRoom.id}
                        onClick={() => handleChatSelect(chatRoom)}
                        className={`p-3 rounded-lg cursor-pointer transition-colors ${
                          isActive ? "bg-blue-100 border-blue-200" : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="flex items-start space-x-3">
                          <Avatar className="h-10 w-10">
                            <AvatarImage src={otherUser?.avatar_url || "/placeholder.svg?height=40&width=40"} />
                            <AvatarFallback>
                              {otherUser ? `${otherUser.first_name?.[0] || ""}${otherUser.last_name?.[0] || ""}` : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-sm truncate">
                                {otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : "Unknown User"}
                              </h4>
                              {(chatRoom.unread_count || 0) > 0 && (
                                <Badge variant="destructive" className="text-xs">
                                  {chatRoom.unread_count}
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mb-1">{chatRoom.service_title}</p>
                            {chatRoom.last_message && (
                              <div className="flex items-center justify-between">
                                <p className="text-xs text-gray-500 truncate">{chatRoom.last_message.content}</p>
                                <span className="text-xs text-gray-400 ml-2">
                                  {formatDistanceToNow(new Date(chatRoom.last_message.created_at), {
                                    addSuffix: true,
                                  })}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })
                )}
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
                        <AvatarImage
                          src={getOtherUser(selectedChat)?.avatar_url || "/placeholder.svg?height=40&width=40"}
                        />
                        <AvatarFallback>
                          {(() => {
                            const otherUser = getOtherUser(selectedChat)
                            return otherUser
                              ? `${otherUser.first_name?.[0] || ""}${otherUser.last_name?.[0] || ""}`
                              : "U"
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold">
                          {(() => {
                            const otherUser = getOtherUser(selectedChat)
                            return otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : "Unknown User"
                          })()}
                        </h3>
                        <p className="text-sm text-gray-600">{selectedChat.service_title}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {isCallActive ? (
                        <div className="flex items-center space-x-2">
                          <Button
                            variant={isMuted ? "destructive" : "outline"}
                            size="sm"
                            onClick={() => setIsMuted(!isMuted)}
                          >
                            {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                          </Button>
                          {callType === "video" && (
                            <Button
                              variant={isVideoOff ? "destructive" : "outline"}
                              size="sm"
                              onClick={() => setIsVideoOff(!isVideoOff)}
                            >
                              {isVideoOff ? <VideoOff className="h-4 w-4" /> : <VideoIcon className="h-4 w-4" />}
                            </Button>
                          )}
                          <Button variant="destructive" size="sm" onClick={handleEndCall}>
                            <PhoneOff className="h-4 w-4" />
                          </Button>
                        </div>
                      ) : (
                        <>
                          <Button variant="ghost" size="sm" onClick={handleVoiceCall}>
                            <Phone className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={handleVideoCall}>
                            <Video className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Call Interface */}
                {isCallActive && (
                  <div className="bg-gray-900 text-white p-8 text-center">
                    <div className="mb-4">
                      <Avatar className="h-20 w-20 mx-auto mb-4">
                        <AvatarImage
                          src={getOtherUser(selectedChat)?.avatar_url || "/placeholder.svg?height=80&width=80"}
                        />
                        <AvatarFallback className="text-2xl">
                          {(() => {
                            const otherUser = getOtherUser(selectedChat)
                            return otherUser
                              ? `${otherUser.first_name?.[0] || ""}${otherUser.last_name?.[0] || ""}`
                              : "U"
                          })()}
                        </AvatarFallback>
                      </Avatar>
                      <h3 className="text-xl font-semibold">
                        {(() => {
                          const otherUser = getOtherUser(selectedChat)
                          return otherUser ? `${otherUser.first_name} ${otherUser.last_name}` : "Unknown User"
                        })()}
                      </h3>
                      <p className="text-gray-300">{callType === "voice" ? "Voice Call" : "Video Call"} - Connected</p>
                    </div>
                    {callType === "video" && (
                      <div className="bg-gray-800 rounded-lg p-4 mb-4">
                        <p className="text-gray-300">Video call interface would be implemented here</p>
                        <p className="text-sm text-gray-400">
                          Integration with WebRTC or third-party video calling service
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => {
                      const isOwn = message.sender_id === currentUser?.id
                      const showAvatar = !isOwn

                      return (
                        <div key={message.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-xs lg:max-w-md ${isOwn ? "order-2" : "order-1"}`}>
                            {/* Reply indicator */}
                            {message.reply_to_id && (
                              <div className="text-xs text-gray-500 mb-1 px-2">
                                <Reply className="h-3 w-3 inline mr-1" />
                                Replying to message
                              </div>
                            )}

                            <div
                              className={`px-4 py-2 rounded-lg ${
                                isOwn ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                              }`}
                            >
                              {message.message_type === "text" && <p className="text-sm">{message.content}</p>}
                              {message.message_type === "image" && (
                                <div>
                                  <img
                                    src={message.file_url || "/placeholder.svg"}
                                    alt={message.file_name}
                                    className="max-w-full rounded mb-2"
                                  />
                                  <p className="text-sm">{message.content}</p>
                                </div>
                              )}
                              {message.message_type === "file" && (
                                <div className="flex items-center space-x-2">
                                  <Paperclip className="h-4 w-4" />
                                  <a
                                    href={message.file_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm underline"
                                  >
                                    {message.file_name}
                                  </a>
                                </div>
                              )}
                              {(message.message_type === "call_request" || message.message_type === "call_ended") && (
                                <div className="flex items-center space-x-2">
                                  <PhoneCall className="h-4 w-4" />
                                  <p className="text-sm italic">{message.content}</p>
                                </div>
                              )}
                              {message.message_type === "system" && (
                                <p className="text-xs text-center text-gray-500 italic">{message.content}</p>
                              )}
                            </div>

                            <div
                              className={`flex items-center mt-1 space-x-1 ${isOwn ? "justify-end" : "justify-start"}`}
                            >
                              <span className="text-xs text-gray-500">{formatMessageTime(message.created_at)}</span>
                              {isOwn && (
                                <div className="text-gray-500">
                                  {message.is_read ? (
                                    <CheckCheck className="h-3 w-3 text-blue-600" />
                                  ) : (
                                    <Check className="h-3 w-3" />
                                  )}
                                </div>
                              )}
                              {!isOwn && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-auto p-0 text-xs"
                                  onClick={() => setReplyingTo(message)}
                                >
                                  <Reply className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          {showAvatar && (
                            <Avatar className="h-8 w-8 order-1 mr-2">
                              <AvatarImage src={message.sender?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                              <AvatarFallback className="text-xs">
                                {message.sender
                                  ? `${message.sender.first_name?.[0] || ""}${message.sender.last_name?.[0] || ""}`
                                  : "U"}
                              </AvatarFallback>
                            </Avatar>
                          )}
                        </div>
                      )
                    })}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Reply indicator */}
                {replyingTo && (
                  <div className="px-4 py-2 bg-gray-50 border-t flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Reply className="h-4 w-4 text-gray-500" />
                      <span className="text-sm text-gray-600">
                        Replying to: {replyingTo.content.substring(0, 50)}...
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setReplyingTo(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}

                {/* Message Input */}
                <div className="p-4 border-t bg-white">
                  <div className="flex items-end space-x-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt"
                    />
                    <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} disabled={sending}>
                      <Paperclip className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={sending}>
                      <ImageIcon className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" disabled={sending}>
                      <MapPin className="h-4 w-4" />
                    </Button>
                    <div className="flex-1 relative">
                      <Textarea
                        ref={inputRef}
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Type a message..."
                        className="min-h-[40px] max-h-[120px] resize-none pr-12"
                        disabled={sending}
                      />
                      <Button
                        onClick={handleSendMessage}
                        disabled={!messageInput.trim() || sending}
                        size="sm"
                        className="absolute right-2 bottom-2 h-8 w-8 p-0"
                      >
                        <Send className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button variant="ghost" size="sm" disabled={sending}>
                      <Smile className="h-4 w-4" />
                    </Button>
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
