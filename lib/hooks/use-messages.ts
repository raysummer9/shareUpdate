"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { Database } from "@/lib/supabase/types";
import { RealtimeChannel } from "@supabase/supabase-js";

type Conversation = Database["public"]["Tables"]["conversations"]["Row"];
type Message = Database["public"]["Tables"]["messages"]["Row"];
type Profile = Database["public"]["Tables"]["profiles"]["Row"];

export interface ConversationWithDetails extends Conversation {
  other_participant?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url" | "is_verified">;
  listing?: {
    id: string;
    title: string;
    images: string[] | null;
  } | null;
  order?: {
    id: string;
    order_number: string;
    status: string | null;
  } | null;
}

export interface MessageWithSender extends Message {
  sender?: Pick<Profile, "id" | "username" | "full_name" | "avatar_url">;
}

// Hook for fetching user's conversations
export function useConversations(userId: string | null) {
  const [conversations, setConversations] = useState<ConversationWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  const fetchConversations = useCallback(async () => {
    if (!userId) {
      setConversations([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Fetch conversations where user is a participant
      const { data, error: fetchError } = await supabase
        .from("conversations")
        .select(`
          *,
          listing:listings!conversations_listing_id_fkey(
            id,
            title,
            images
          ),
          order:orders!conversations_order_id_fkey(
            id,
            order_number,
            status
          )
        `)
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`)
        .order("last_message_at", { ascending: false, nullsFirst: false });

      if (fetchError) throw fetchError;

      // Fetch other participant details for each conversation
      const conversationsWithDetails: ConversationWithDetails[] = await Promise.all(
        (data || []).map(async (conv) => {
          const otherParticipantId = conv.participant_1 === userId ? conv.participant_2 : conv.participant_1;
          
          const { data: profile } = await supabase
            .from("profiles")
            .select("id, username, full_name, avatar_url, is_verified")
            .eq("id", otherParticipantId)
            .single();

          return {
            ...conv,
            other_participant: profile || undefined,
          };
        })
      );

      setConversations(conversationsWithDetails);

      // Calculate total unread count
      const totalUnread = conversationsWithDetails.reduce((sum, conv) => {
        if (conv.participant_1 === userId) {
          return sum + (conv.participant_1_unread || 0);
        } else {
          return sum + (conv.participant_2_unread || 0);
        }
      }, 0);
      setUnreadCount(totalUnread);

    } catch (err) {
      console.error("Error fetching conversations:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch conversations");
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Set up real-time subscription for conversation updates
  useEffect(() => {
    if (!userId) return;

    const channel: RealtimeChannel = supabase
      .channel(`conversations:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `participant_1=eq.${userId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "conversations",
          filter: `participant_2=eq.${userId}`,
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchConversations]);

  return { conversations, loading, error, unreadCount, refetch: fetchConversations };
}

// Hook for fetching messages in a conversation
export function useMessages(conversationId: string | null, userId: string | null) {
  const [messages, setMessages] = useState<MessageWithSender[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  const fetchMessages = useCallback(async () => {
    if (!conversationId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select(`
          *,
          sender:profiles!messages_sender_id_fkey(
            id,
            username,
            full_name,
            avatar_url
          )
        `)
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;

      setMessages(data || []);

      // Mark messages as read
      if (userId && data && data.length > 0) {
        const unreadMessages = data.filter(m => !m.is_read && m.sender_id !== userId);
        if (unreadMessages.length > 0) {
          await supabase
            .from("messages")
            .update({ is_read: true, read_at: new Date().toISOString() })
            .eq("conversation_id", conversationId)
            .neq("sender_id", userId)
            .eq("is_read", false);

          // Update conversation unread count
          const { data: conv } = await supabase
            .from("conversations")
            .select("participant_1, participant_2")
            .eq("id", conversationId)
            .single();

          if (conv) {
            const updateField = conv.participant_1 === userId 
              ? "participant_1_unread" 
              : "participant_2_unread";
            
            await supabase
              .from("conversations")
              .update({ [updateField]: 0 })
              .eq("id", conversationId);
          }
        }
      }

    } catch (err) {
      console.error("Error fetching messages:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch messages");
    } finally {
      setLoading(false);
    }
  }, [conversationId, userId, supabase]);

  useEffect(() => {
    fetchMessages();
  }, [fetchMessages]);

  // Set up real-time subscription for new messages
  useEffect(() => {
    if (!conversationId) return;

    const channel: RealtimeChannel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        async (payload) => {
          // Fetch the new message with sender details
          const { data: newMessage } = await supabase
            .from("messages")
            .select(`
              *,
              sender:profiles!messages_sender_id_fkey(
                id,
                username,
                full_name,
                avatar_url
              )
            `)
            .eq("id", payload.new.id)
            .single();

          if (newMessage) {
            setMessages((prev) => [...prev, newMessage]);

            // Mark as read if from other user
            if (userId && newMessage.sender_id !== userId) {
              await supabase
                .from("messages")
                .update({ is_read: true, read_at: new Date().toISOString() })
                .eq("id", newMessage.id);
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, userId, supabase]);

  return { messages, loading, error, refetch: fetchMessages };
}

// Hook for message mutations (send, etc.)
export function useMessageMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const supabase = useMemo(() => createClient(), []);

  // Get or create a conversation between two users
  const getOrCreateConversation = async (
    userId: string,
    otherUserId: string,
    listingId?: string,
    orderId?: string
  ): Promise<string | null> => {
    setLoading(true);
    setError(null);

    try {
      // Check if conversation already exists
      const { data: existing } = await supabase
        .from("conversations")
        .select("id")
        .or(
          `and(participant_1.eq.${userId},participant_2.eq.${otherUserId}),and(participant_1.eq.${otherUserId},participant_2.eq.${userId})`
        )
        .maybeSingle();

      if (existing) {
        return existing.id;
      }

      // Create new conversation
      const { data: newConv, error: createError } = await supabase
        .from("conversations")
        .insert({
          participant_1: userId,
          participant_2: otherUserId,
          listing_id: listingId || null,
          order_id: orderId || null,
        })
        .select("id")
        .single();

      if (createError) throw createError;

      return newConv.id;

    } catch (err) {
      console.error("Error getting/creating conversation:", err);
      setError(err instanceof Error ? err.message : "Failed to create conversation");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a message
  const sendMessage = async (
    conversationId: string,
    senderId: string,
    content: string,
    attachments?: { type: string; url: string }[]
  ): Promise<Message | null> => {
    setLoading(true);
    setError(null);

    try {
      // Insert the message
      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: senderId,
          content,
          attachments: attachments || null,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Update conversation last message info and increment unread count
      const { data: conv } = await supabase
        .from("conversations")
        .select("participant_1, participant_2, participant_1_unread, participant_2_unread")
        .eq("id", conversationId)
        .single();

      if (conv) {
        const isParticipant1 = conv.participant_1 === senderId;
        const unreadField = isParticipant1 ? "participant_2_unread" : "participant_1_unread";
        const currentUnread = isParticipant1 
          ? (conv.participant_2_unread || 0) 
          : (conv.participant_1_unread || 0);

        await supabase
          .from("conversations")
          .update({
            last_message_at: new Date().toISOString(),
            last_message_preview: content.substring(0, 100),
            [unreadField]: currentUnread + 1,
          })
          .eq("id", conversationId);
      }

      return message;

    } catch (err) {
      console.error("Error sending message:", err);
      setError(err instanceof Error ? err.message : "Failed to send message");
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Send a system message (order updates, etc.)
  const sendSystemMessage = async (
    conversationId: string,
    content: string,
    systemType: string
  ): Promise<Message | null> => {
    setLoading(true);
    setError(null);

    try {
      // Get any participant to use as sender (system messages don't have real sender)
      const { data: conv } = await supabase
        .from("conversations")
        .select("participant_1")
        .eq("id", conversationId)
        .single();

      if (!conv) throw new Error("Conversation not found");

      const { data: message, error: messageError } = await supabase
        .from("messages")
        .insert({
          conversation_id: conversationId,
          sender_id: conv.participant_1, // Required field, but marked as system
          content,
          is_system: true,
          system_type: systemType,
        })
        .select()
        .single();

      if (messageError) throw messageError;

      // Update conversation
      await supabase
        .from("conversations")
        .update({
          last_message_at: new Date().toISOString(),
          last_message_preview: content.substring(0, 100),
        })
        .eq("id", conversationId);

      return message;

    } catch (err) {
      console.error("Error sending system message:", err);
      setError(err instanceof Error ? err.message : "Failed to send system message");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return {
    getOrCreateConversation,
    sendMessage,
    sendSystemMessage,
    loading,
    error,
  };
}

// Hook for getting unread message count (for sidebar badges)
export function useUnreadMessageCount(userId: string | null) {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const supabase = useMemo(() => createClient(), []);

  const fetchCount = useCallback(async () => {
    if (!userId) {
      setCount(0);
      setLoading(false);
      return;
    }

    try {
      // Get all conversations where user is a participant
      const { data } = await supabase
        .from("conversations")
        .select("participant_1, participant_2, participant_1_unread, participant_2_unread")
        .or(`participant_1.eq.${userId},participant_2.eq.${userId}`);

      if (data) {
        const totalUnread = data.reduce((sum, conv) => {
          if (conv.participant_1 === userId) {
            return sum + (conv.participant_1_unread || 0);
          } else {
            return sum + (conv.participant_2_unread || 0);
          }
        }, 0);
        setCount(totalUnread);
      }
    } catch (err) {
      console.error("Error fetching unread count:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, supabase]);

  useEffect(() => {
    fetchCount();
  }, [fetchCount]);

  // Real-time subscription for updates
  useEffect(() => {
    if (!userId) return;

    const channel = supabase
      .channel(`unread:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "conversations",
        },
        () => {
          fetchCount();
        }
      )
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        () => {
          fetchCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, supabase, fetchCount]);

  return { count, loading, refetch: fetchCount };
}

