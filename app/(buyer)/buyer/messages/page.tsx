"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreVertical, Send, Paperclip, Check, CheckCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unread: number;
  online: boolean;
  isVerified: boolean;
}

interface Message {
  id: string;
  content: string;
  time: string;
  isSent: boolean;
  isRead: boolean;
}

const conversations: Conversation[] = [
  {
    id: "1",
    name: "Digital Assets Pro",
    avatar: "/placeholder-image.png",
    lastMessage: "The Instagram account has been transferred successfully!",
    time: "2 min ago",
    unread: 2,
    online: true,
    isVerified: true,
  },
  {
    id: "2",
    name: "WebDev Solutions",
    avatar: "/placeholder-image.png",
    lastMessage: "I'll start working on your landing page today",
    time: "1 hour ago",
    unread: 0,
    online: true,
    isVerified: true,
  },
  {
    id: "3",
    name: "SocialMedia Expert",
    avatar: "/placeholder-image.png",
    lastMessage: "Here are the account analytics you requested",
    time: "3 hours ago",
    unread: 1,
    online: false,
    isVerified: false,
  },
  {
    id: "4",
    name: "TechChannel Store",
    avatar: "/placeholder-image.png",
    lastMessage: "Thank you for your purchase!",
    time: "Yesterday",
    unread: 0,
    online: false,
    isVerified: true,
  },
];

const messages: Message[] = [
  { id: "1", content: "Hi! I'm interested in the Instagram Fashion account", time: "10:30 AM", isSent: true, isRead: true },
  { id: "2", content: "Hello! Yes, it's still available. The account has 12.5K engaged followers.", time: "10:32 AM", isSent: false, isRead: true },
  { id: "3", content: "Great! Can you share the analytics?", time: "10:35 AM", isSent: true, isRead: true },
  { id: "4", content: "Of course! Here are the latest insights. The engagement rate is 4.2% with mostly female audience aged 18-34.", time: "10:38 AM", isSent: false, isRead: true },
  { id: "5", content: "That looks perfect. I'd like to proceed with the purchase.", time: "10:42 AM", isSent: true, isRead: true },
  { id: "6", content: "The Instagram account has been transferred successfully!", time: "Just now", isSent: false, isRead: false },
];

function ConversationItem({ conversation, isActive, onClick }: { conversation: Conversation; isActive: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg transition-colors text-left",
        isActive ? "bg-red-50" : "hover:bg-gray-50"
      )}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
          <Image src={conversation.avatar} alt={conversation.name} width={48} height={48} className="w-full h-full object-cover" />
        </div>
        {conversation.online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className={cn("text-sm font-semibold truncate", isActive ? "text-red-600" : "text-gray-900")}>
            {conversation.name}
            {conversation.isVerified && (
              <span className="inline-flex ml-1 text-blue-500">
                <Check className="h-3 w-3" />
              </span>
            )}
          </p>
          <span className="text-xs text-gray-500">{conversation.time}</span>
        </div>
        <div className="flex items-center justify-between mt-0.5">
          <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
          {conversation.unread > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full">
              {conversation.unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

export default function MessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [showConversations, setShowConversations] = useState(true);

  const activeChat = conversations.find((c) => c.id === activeConversation);

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log("Sending:", newMessage);
      setNewMessage("");
    }
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
        <p className="text-gray-600 mt-1">Chat with sellers and manage your conversations</p>
      </div>

      {/* Chat Container */}
      <div className="flex-1 bg-white rounded-xl border border-gray-200 overflow-hidden flex">
        {/* Conversations List */}
        <div className={cn(
          "w-full md:w-80 border-r border-gray-200 flex flex-col",
          !showConversations && "hidden md:flex"
        )}>
          {/* Search */}
          <div className="p-3 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                className="w-full pl-9 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto p-2">
            {conversations.map((conversation) => (
              <ConversationItem
                key={conversation.id}
                conversation={conversation}
                isActive={activeConversation === conversation.id}
                onClick={() => {
                  setActiveConversation(conversation.id);
                  setShowConversations(false);
                }}
              />
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className={cn(
          "flex-1 flex flex-col",
          showConversations && "hidden md:flex"
        )}>
          {activeChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setShowConversations(true)}
                    className="md:hidden p-1 -ml-1 text-gray-500 hover:text-gray-700"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                      <Image src={activeChat.avatar} alt={activeChat.name} width={40} height={40} className="w-full h-full object-cover" />
                    </div>
                    {activeChat.online && (
                      <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 flex items-center gap-1">
                      {activeChat.name}
                      {activeChat.isVerified && <Check className="h-4 w-4 text-blue-500" />}
                    </p>
                    <p className="text-xs text-gray-500">{activeChat.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                  <MoreVertical className="h-5 w-5" />
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                  <div key={message.id} className={cn("flex", message.isSent ? "justify-end" : "justify-start")}>
                    <div className={cn(
                      "max-w-[75%] px-4 py-2 rounded-2xl",
                      message.isSent
                        ? "bg-red-600 text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    )}>
                      <p className="text-sm">{message.content}</p>
                      <div className={cn("flex items-center justify-end gap-1 mt-1", message.isSent ? "text-red-200" : "text-gray-400")}>
                        <span className="text-xs">{message.time}</span>
                        {message.isSent && (
                          message.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex items-center gap-2">
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <Paperclip className="h-5 w-5" />
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  />
                  <Button onClick={handleSend} className="bg-red-600 hover:bg-red-700 text-white px-4">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

