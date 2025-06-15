import { supabase } from "./client"
import type { RealtimeChannel } from "@supabase/supabase-js"

export interface ChatRoom {
  id: string
  customer_id: string
  worker_id: string
  booking_id?: string
  service_title: string
  status: "active" | "archived" | "blocked"
  last_message_at: string
  created_at: string
  updated_at: string
  customer?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  worker?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  unread_count?: number
  last_message?: Message
}

export interface Message {
  id: string
  chat_room_id: string
  sender_id: string
  content: string
  message_type: "text" | "image" | "file" | "location" | "system" | "call_request" | "call_ended"
  file_url?: string
  file_name?: string
  file_size?: number
  location_lat?: number
  location_lng?: number
  location_address?: string
  is_read: boolean
  is_edited: boolean
  edited_at?: string
  reply_to_id?: string
  created_at: string
  updated_at: string
  sender?: {
    first_name: string
    last_name: string
    avatar_url?: string
  }
  reactions?: MessageReaction[]
}

export interface CallSession {
  id: string
  chat_room_id: string
  caller_id: string
  receiver_id: string
  call_type: "voice" | "video"
  status: "ringing" | "active" | "ended" | "missed" | "declined"
  started_at: string
  answered_at?: string
  ended_at?: string
  duration_seconds: number
  end_reason?: "completed" | "declined" | "missed" | "network_error" | "user_ended"
  created_at: string
}

export interface MessageReaction {
  id: string
  message_id: string
  user_id: string
  reaction: "👍" | "👎" | "❤️" | "😂" | "😮" | "😢" | "😡"
  created_at: string
}

export class MessagingService {
  private static instance: MessagingService
  private channels: Map<string, RealtimeChannel> = new Map()

  static getInstance(): MessagingService {
    if (!MessagingService.instance) {
      MessagingService.instance = new MessagingService()
    }
    return MessagingService.instance
  }

  // Chat Room Management
  async getChatRooms(userId: string): Promise<ChatRoom[]> {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select(`
          *,
          customer:users!customer_id(first_name, last_name, avatar_url),
          worker:users!worker_id(first_name, last_name, avatar_url)
        `)
        .or(`customer_id.eq.${userId},worker_id.eq.${userId}`)
        .order("last_message_at", { ascending: false })

      if (error) throw error

      // Get unread counts and last messages
      const chatRoomsWithDetails = await Promise.all(
        (data || []).map(async (room) => {
          const [unreadCount, lastMessage] = await Promise.all([
            this.getUnreadCount(room.id, userId),
            this.getLastMessage(room.id),
          ])

          return {
            ...room,
            unread_count: unreadCount,
            last_message: lastMessage,
          }
        }),
      )

      return chatRoomsWithDetails
    } catch (error) {
      console.error("Error fetching chat rooms:", error)
      throw error
    }
  }

  async createChatRoom(
    customerId: string,
    workerId: string,
    serviceTitle: string,
    bookingId?: string,
  ): Promise<ChatRoom> {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .insert({
          customer_id: customerId,
          worker_id: workerId,
          service_title: serviceTitle,
          booking_id: bookingId,
        })
        .select(`
          *,
          customer:users!customer_id(first_name, last_name, avatar_url),
          worker:users!worker_id(first_name, last_name, avatar_url)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error creating chat room:", error)
      throw error
    }
  }

  async getChatRoom(chatRoomId: string): Promise<ChatRoom | null> {
    try {
      const { data, error } = await supabase
        .from("chat_rooms")
        .select(`
          *,
          customer:users!customer_id(first_name, last_name, avatar_url),
          worker:users!worker_id(first_name, last_name, avatar_url)
        `)
        .eq("id", chatRoomId)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error fetching chat room:", error)
      return null
    }
  }

  // Message Management
  async getMessages(chatRoomId: string, limit = 50, offset = 0): Promise<Message[]> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!sender_id(first_name, last_name, avatar_url),
          reactions:message_reactions(*)
        `)
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1)

      if (error) throw error
      return (data || []).reverse()
    } catch (error) {
      console.error("Error fetching messages:", error)
      throw error
    }
  }

  async sendMessage(
    chatRoomId: string,
    senderId: string,
    content: string,
    messageType: Message["message_type"] = "text",
    fileUrl?: string,
    fileName?: string,
    fileSize?: number,
    replyToId?: string,
  ): Promise<Message> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .insert({
          chat_room_id: chatRoomId,
          sender_id: senderId,
          content,
          message_type: messageType,
          file_url: fileUrl,
          file_name: fileName,
          file_size: fileSize,
          reply_to_id: replyToId,
        })
        .select(`
          *,
          sender:users!sender_id(first_name, last_name, avatar_url)
        `)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error("Error sending message:", error)
      throw error
    }
  }

  async markMessagesAsRead(chatRoomId: string, userId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("messages")
        .update({ is_read: true })
        .eq("chat_room_id", chatRoomId)
        .neq("sender_id", userId)
        .eq("is_read", false)

      if (error) throw error
    } catch (error) {
      console.error("Error marking messages as read:", error)
      throw error
    }
  }

  async getUnreadCount(chatRoomId: string, userId: string): Promise<number> {
    try {
      const { count, error } = await supabase
        .from("messages")
        .select("*", { count: "exact", head: true })
        .eq("chat_room_id", chatRoomId)
        .neq("sender_id", userId)
        .eq("is_read", false)

      if (error) throw error
      return count || 0
    } catch (error) {
      console.error("Error getting unread count:", error)
      return 0
    }
  }

  async getLastMessage(chatRoomId: string): Promise<Message | null> {
    try {
      const { data, error } = await supabase
        .from("messages")
        .select(`
          *,
          sender:users!sender_id(first_name, last_name, avatar_url)
        `)
        .eq("chat_room_id", chatRoomId)
        .order("created_at", { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      return null
    }
  }

  // Call Management
  async initiateCall(
    chatRoomId: string,
    callerId: string,
    receiverId: string,
    callType: "voice" | "video",
  ): Promise<CallSession> {
    try {
      const { data, error } = await supabase
        .from("call_sessions")
        .insert({
          chat_room_id: chatRoomId,
          caller_id: callerId,
          receiver_id: receiverId,
          call_type: callType,
          status: "ringing",
        })
        .select()
        .single()

      if (error) throw error

      // Send system message about call
      await this.sendMessage(
        chatRoomId,
        callerId,
        `${callType === "voice" ? "Voice" : "Video"} call initiated`,
        "call_request",
      )

      return data
    } catch (error) {
      console.error("Error initiating call:", error)
      throw error
    }
  }

  async answerCall(callId: string): Promise<void> {
    try {
      const { error } = await supabase
        .from("call_sessions")
        .update({
          status: "active",
          answered_at: new Date().toISOString(),
        })
        .eq("id", callId)

      if (error) throw error
    } catch (error) {
      console.error("Error answering call:", error)
      throw error
    }
  }

  async endCall(callId: string, endReason: CallSession["end_reason"] = "completed"): Promise<void> {
    try {
      const { data: callData, error: fetchError } = await supabase
        .from("call_sessions")
        .select("started_at, answered_at, chat_room_id")
        .eq("id", callId)
        .single()

      if (fetchError) throw fetchError

      const endTime = new Date()
      const startTime = new Date(callData.answered_at || callData.started_at)
      const durationSeconds = Math.floor((endTime.getTime() - startTime.getTime()) / 1000)

      const { error } = await supabase
        .from("call_sessions")
        .update({
          status: "ended",
          ended_at: endTime.toISOString(),
          duration_seconds: durationSeconds,
          end_reason: endReason,
        })
        .eq("id", callId)

      if (error) throw error

      // Send system message about call end
      await this.sendMessage(
        callData.chat_room_id,
        "", // System message
        `Call ended - Duration: ${Math.floor(durationSeconds / 60)}:${(durationSeconds % 60).toString().padStart(2, "0")}`,
        "call_ended",
      )
    } catch (error) {
      console.error("Error ending call:", error)
      throw error
    }
  }

  // Real-time subscriptions
  subscribeToMessages(chatRoomId: string, callback: (message: Message) => void): RealtimeChannel {
    const channelName = `messages:${chatRoomId}`

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        async (payload) => {
          // Fetch complete message with sender info
          const { data } = await supabase
            .from("messages")
            .select(`
              *,
              sender:users!sender_id(first_name, last_name, avatar_url)
            `)
            .eq("id", payload.new.id)
            .single()

          if (data) {
            callback(data)
          }
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  subscribeToCallUpdates(chatRoomId: string, callback: (call: CallSession) => void): RealtimeChannel {
    const channelName = `calls:${chatRoomId}`

    if (this.channels.has(channelName)) {
      return this.channels.get(channelName)!
    }

    const channel = supabase
      .channel(channelName)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "call_sessions",
          filter: `chat_room_id=eq.${chatRoomId}`,
        },
        (payload) => {
          callback(payload.new as CallSession)
        },
      )
      .subscribe()

    this.channels.set(channelName, channel)
    return channel
  }

  unsubscribe(channelName: string): void {
    const channel = this.channels.get(channelName)
    if (channel) {
      supabase.removeChannel(channel)
      this.channels.delete(channelName)
    }
  }

  unsubscribeAll(): void {
    this.channels.forEach((channel, channelName) => {
      supabase.removeChannel(channel)
    })
    this.channels.clear()
  }

  // File upload for messages
  async uploadMessageFile(
    file: File,
    chatRoomId: string,
  ): Promise<{ url: string; fileName: string; fileSize: number }> {
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}.${fileExt}`
      const filePath = `messages/${chatRoomId}/${fileName}`

      const { error: uploadError } = await supabase.storage.from("chat-files").upload(filePath, file)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("chat-files").getPublicUrl(filePath)

      return {
        url: publicUrl,
        fileName: file.name,
        fileSize: file.size,
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      throw error
    }
  }

  // Message reactions
  async addReaction(messageId: string, userId: string, reaction: MessageReaction["reaction"]): Promise<void> {
    try {
      const { error } = await supabase.from("message_reactions").insert({
        message_id: messageId,
        user_id: userId,
        reaction,
      })

      if (error) throw error
    } catch (error) {
      console.error("Error adding reaction:", error)
      throw error
    }
  }

  async removeReaction(messageId: string, userId: string, reaction: MessageReaction["reaction"]): Promise<void> {
    try {
      const { error } = await supabase
        .from("message_reactions")
        .delete()
        .eq("message_id", messageId)
        .eq("user_id", userId)
        .eq("reaction", reaction)

      if (error) throw error
    } catch (error) {
      console.error("Error removing reaction:", error)
      throw error
    }
  }
}

export const messagingService = MessagingService.getInstance()
