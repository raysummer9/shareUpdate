"use client";

import { useState } from "react";
import Image from "next/image";
import { Search, MoreVertical, Send, Paperclip, Check, CheckCheck, Star, Filter } from "lucide-react";
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
  isBuyer: boolean;
  orderRelated?: string;
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
    name: "Michael Chen",
    avatar: "/placeholder-image.png",
    lastMessage: "Is the Instagram account still available?",
    time: "Just now",
    unread: 2,
    online: true,
    isBuyer: true,
    orderRelated: "Instagram Account - Fashion",
  },
  {
    id: "2",
    name: "Sarah Johnson",
    avatar: "/placeholder-image.png",
    lastMessage: "Thank you! The account transfer was smooth.",
    time: "30 min ago",
    unread: 0,
    online: true,
    isBuyer: true,
  },
  {
    id: "3",
    name: "David Williams",
    avatar: "/placeholder-image.png",
    lastMessage: "Can you provide more analytics screenshots?",
    time: "2 hours ago",
    unread: 1,
    online: false,
    isBuyer: true,
    orderRelated: "YouTube Channel - Tech",
  },
  {
    id: "4",
    name: "Emily Brown",
    avatar: "/placeholder-image.png",
    lastMessage: "I'll proceed with the purchase now",
    time: "Yesterday",
    unread: 0,
    online: false,
    isBuyer: true,
  },
  {
    id: "5",
    name: "Support Team",
    avatar: "/placeholder-image.png",
    lastMessage: "Your listing has been approved!",
    time: "2 days ago",
    unread: 1,
    online: true,
    isBuyer: false,
  },
];

const messages: Message[] = [
  { id: "1", content: "Hi! I saw your Instagram Fashion account listing", time: "10:30 AM", isSent: false, isRead: true },
  { id: "2", content: "Hello! Yes, how can I help you?", time: "10:32 AM", isSent: true, isRead: true },
  { id: "3", content: "Can you tell me more about the engagement rate?", time: "10:35 AM", isSent: false, isRead: true },
  { id: "4", content: "Sure! The engagement rate is consistently 4.5-5.2%. Most followers are real and active, aged 18-34. I can share recent analytics if you'd like.", time: "10:38 AM", isSent: true, isRead: true },
  { id: "5", content: "That sounds great! Yes please share the analytics", time: "10:42 AM", isSent: false, isRead: true },
  { id: "6", content: "Is the Instagram account still available?", time: "Just now", isSent: false, isRead: false },
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
            {conversation.isBuyer && <span className="ml-1 text-xs text-gray-400">(Buyer)</span>}
          </p>
          <span className="text-xs text-gray-500">{conversation.time}</span>
        </div>
        {conversation.orderRelated && (
          <p className="text-xs text-blue-600 truncate">Re: {conversation.orderRelated}</p>
        )}
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

export default function SellerMessagesPage() {
  const [activeConversation, setActiveConversation] = useState<string>("1");
  const [newMessage, setNewMessage] = useState("");
  const [showConversations, setShowConversations] = useState(true);
  const [filterType, setFilterType] = useState<"all" | "buyers" | "support">("all");

  const activeChat = conversations.find((c) => c.id === activeConversation);

  const filteredConversations = conversations.filter((c) => {
    if (filterType === "all") return true;
    if (filterType === "buyers") return c.isBuyer;
    if (filterType === "support") return !c.isBuyer;
    return true;
  });

  const handleSend = () => {
    if (newMessage.trim()) {
      console.log("Sending:", newMessage);
      setNewMessage("");
    }
  };

  const totalUnread = conversations.reduce((acc, c) => acc + c.unread, 0);

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Messages</h1>
          <p className="text-gray-600 mt-1">{totalUnread} unread messages from buyers</p>
        </div>
        <div className="flex gap-2">
          {(["all", "buyers", "support"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={cn(
                "px-3 py-1.5 text-sm font-medium rounded-lg transition-colors capitalize",
                filterType === type ? "bg-red-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              )}
            >
              {type}
            </button>
          ))}
        </div>
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
            {filteredConversations.map((conversation) => (
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
                    <p className="text-sm font-semibold text-gray-900">{activeChat.name}</p>
                    <p className="text-xs text-gray-500">{activeChat.online ? "Online" : "Offline"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {activeChat.isBuyer && (
                    <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">Buyer</span>
                  )}
                  <button className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg">
                    <MoreVertical className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Order Context Banner */}
              {activeChat.orderRelated && (
                <div className="px-4 py-2 bg-blue-50 border-b border-blue-100 flex items-center justify-between">
                  <p className="text-sm text-blue-700">
                    <span className="font-medium">Related to:</span> {activeChat.orderRelated}
                  </p>
                  <Button size="sm" variant="outline" className="h-7 text-xs">
                    View Order
                  </Button>
                </div>
              )}

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

              {/* Quick Responses */}
              <div className="px-4 py-2 border-t border-gray-100 flex gap-2 overflow-x-auto">
                {["Yes, still available!", "Let me check...", "I'll send details now", "Thanks for your interest!"].map((response) => (
                  <button
                    key={response}
                    onClick={() => setNewMessage(response)}
                    className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 whitespace-nowrap"
                  >
                    {response}
                  </button>
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

