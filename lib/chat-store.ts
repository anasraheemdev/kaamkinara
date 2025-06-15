"use client"

import { create } from "zustand"

export interface Message {
  id: string
  senderId: string
  senderName: string
  senderRole: "customer" | "worker"
  content: string
  timestamp: Date
  type: "text" | "image" | "location" | "system"
  read: boolean
}

export interface ChatRoom {
  id: string
  customerId: string
  customerName: string
  workerId: string
  workerName: string
  jobId: string
  jobTitle: string
  lastMessage?: Message
  unreadCount: number
  isActive: boolean
  createdAt: Date
}

interface ChatStore {
  chatRooms: ChatRoom[]
  messages: Record<string, Message[]>
  currentUserId: string
  currentUserRole: "customer" | "worker"
  activeChatId: string | null

  // Actions
  setCurrentUser: (userId: string, role: "customer" | "worker") => void
  setActiveChat: (chatId: string | null) => void
  addChatRoom: (chatRoom: ChatRoom) => void
  sendMessage: (chatId: string, content: string, type?: Message["type"]) => void
  markMessagesAsRead: (chatId: string) => void
  simulateIncomingMessage: (
    chatId: string,
    content: string,
    senderId: string,
    senderName: string,
    senderRole: "customer" | "worker",
  ) => void
}

export const useChatStore = create<ChatStore>((set, get) => ({
  chatRooms: [
    {
      id: "chat-1",
      customerId: "customer-1",
      customerName: "John Doe",
      workerId: "worker-1",
      workerName: "Ahmed Hassan",
      jobId: "job-1",
      jobTitle: "Plumbing - Kitchen Sink Repair",
      unreadCount: 2,
      isActive: true,
      createdAt: new Date("2024-01-15T10:00:00"),
    },
    {
      id: "chat-2",
      customerId: "customer-1",
      customerName: "John Doe",
      workerId: "worker-2",
      workerName: "Muhammad Ali",
      jobId: "job-2",
      jobTitle: "Electrical - Wiring Issue",
      unreadCount: 0,
      isActive: false,
      createdAt: new Date("2024-01-14T14:30:00"),
    },
  ],

  messages: {
    "chat-1": [
      {
        id: "msg-1",
        senderId: "worker-1",
        senderName: "Ahmed Hassan",
        senderRole: "worker",
        content:
          "Hello! I received your job request for kitchen sink repair. I can come today at 2 PM. Is that convenient for you?",
        timestamp: new Date("2024-01-15T10:15:00"),
        type: "text",
        read: true,
      },
      {
        id: "msg-2",
        senderId: "customer-1",
        senderName: "John Doe",
        senderRole: "customer",
        content: "Yes, 2 PM works perfectly. Do you need any specific details about the issue?",
        timestamp: new Date("2024-01-15T10:20:00"),
        type: "text",
        read: true,
      },
      {
        id: "msg-3",
        senderId: "worker-1",
        senderName: "Ahmed Hassan",
        senderRole: "worker",
        content: "Could you please share a photo of the sink area? It will help me bring the right tools.",
        timestamp: new Date("2024-01-15T10:25:00"),
        type: "text",
        read: false,
      },
      {
        id: "msg-4",
        senderId: "worker-1",
        senderName: "Ahmed Hassan",
        senderRole: "worker",
        content: "Also, I'm on my way to another job nearby. I'll message you when I'm heading to your location.",
        timestamp: new Date("2024-01-15T10:26:00"),
        type: "text",
        read: false,
      },
    ],
    "chat-2": [
      {
        id: "msg-5",
        senderId: "customer-1",
        senderName: "John Doe",
        senderRole: "customer",
        content: "Thank you for completing the electrical work yesterday. Everything is working perfectly!",
        timestamp: new Date("2024-01-14T18:00:00"),
        type: "text",
        read: true,
      },
      {
        id: "msg-6",
        senderId: "worker-2",
        senderName: "Muhammad Ali",
        senderRole: "worker",
        content: "You're welcome! Please don't hesitate to contact me if you need any electrical work in the future.",
        timestamp: new Date("2024-01-14T18:05:00"),
        type: "text",
        read: true,
      },
    ],
  },

  currentUserId: "customer-1",
  currentUserRole: "customer",
  activeChatId: null,

  setCurrentUser: (userId, role) => {
    set({ currentUserId: userId, currentUserRole: role })
  },

  setActiveChat: (chatId) => {
    set({ activeChatId: chatId })
    if (chatId) {
      get().markMessagesAsRead(chatId)
    }
  },

  addChatRoom: (chatRoom) => {
    set((state) => ({
      chatRooms: [...state.chatRooms, chatRoom],
      messages: { ...state.messages, [chatRoom.id]: [] },
    }))
  },

  sendMessage: (chatId, content, type = "text") => {
    const { currentUserId, currentUserRole, chatRooms } = get()
    const chatRoom = chatRooms.find((room) => room.id === chatId)

    if (!chatRoom) return

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId: currentUserId,
      senderName: currentUserRole === "customer" ? chatRoom.customerName : chatRoom.workerName,
      senderRole: currentUserRole,
      content,
      timestamp: new Date(),
      type,
      read: true,
    }

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]: [...(state.messages[chatId] || []), newMessage],
      },
      chatRooms: state.chatRooms.map((room) => (room.id === chatId ? { ...room, lastMessage: newMessage } : room)),
    }))

    // Simulate response after 2-5 seconds
    setTimeout(
      () => {
        const responses = [
          "Got it, thanks for the update!",
          "I'll be there shortly.",
          "Perfect, see you then.",
          "Let me check and get back to you.",
          "Understood, I'll bring the necessary tools.",
        ]

        const otherUserId = currentUserRole === "customer" ? chatRoom.workerId : chatRoom.customerId
        const otherUserName = currentUserRole === "customer" ? chatRoom.workerName : chatRoom.customerName
        const otherUserRole = currentUserRole === "customer" ? "worker" : "customer"

        get().simulateIncomingMessage(
          chatId,
          responses[Math.floor(Math.random() * responses.length)],
          otherUserId,
          otherUserName,
          otherUserRole,
        )
      },
      Math.random() * 3000 + 2000,
    )
  },

  markMessagesAsRead: (chatId) => {
    const { currentUserId } = get()

    set((state) => ({
      messages: {
        ...state.messages,
        [chatId]:
          state.messages[chatId]?.map((msg) => (msg.senderId !== currentUserId ? { ...msg, read: true } : msg)) || [],
      },
      chatRooms: state.chatRooms.map((room) => (room.id === chatId ? { ...room, unreadCount: 0 } : room)),
    }))
  },

  simulateIncomingMessage: (chatId, content, senderId, senderName, senderRole) => {
    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      senderId,
      senderName,
      senderRole,
      content,
      timestamp: new Date(),
      type: "text",
      read: false,
    }

    set((state) => {
      const isActiveChat = state.activeChatId === chatId

      return {
        messages: {
          ...state.messages,
          [chatId]: [...(state.messages[chatId] || []), newMessage],
        },
        chatRooms: state.chatRooms.map((room) =>
          room.id === chatId
            ? {
                ...room,
                lastMessage: newMessage,
                unreadCount: isActiveChat ? 0 : room.unreadCount + 1,
              }
            : room,
        ),
      }
    })

    // Mark as read if chat is active
    if (get().activeChatId === chatId) {
      setTimeout(() => get().markMessagesAsRead(chatId), 1000)
    }
  },
}))
