import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  TextField,
  Button,
  ScrollArea,
  Flex,
} from "@radix-ui/themes";
import { supabase } from "../../../supabase";

interface ChatProps {
  gameId: string;
  playerId: string;
  playerName: string;
}

interface ChatMessage {
  id: string;
  player_id: string;
  player_name: string;
  message: string;
  created_at: string;
}

export default function Chat({ gameId, playerId, playerName }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("chat_messages")
        .select("*")
        .eq("game_id", gameId)
        .order("created_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data || []);
      }
    };

    fetchMessages();

    const chatSubscription = supabase
      .channel(`chat:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "chat_messages",
          filter: `game_id=eq.${gameId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as ChatMessage]);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(chatSubscription);
    };
  }, [gameId]);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      try {
        const { error } = await supabase.from("chat_messages").insert({
          game_id: gameId,
          player_id: playerId,
          player_name: playerName,
          message: newMessage.trim(),
        });

        if (error) throw error;
        setNewMessage("");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <Box
      width="100%"
      p="2"
      style={{ border: "1px solid #ccc", borderRadius: "4px" }}
    >
      <Text size="3" mb="2" weight="bold">
        Chat
      </Text>
      <ScrollArea style={{ height: "200px" }} mb="2">
        {messages.map((msg) => (
          <Box key={msg.id} mb="1">
            <Text size="2" weight="bold">
              {msg.player_name}:{" "}
            </Text>
            <Text size="2">{msg.message}</Text>
          </Box>
        ))}
      </ScrollArea>
      <Flex gap="2">
        <TextField.Root
          style={{ flex: 1 }}
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
        />

        <Button onClick={handleSendMessage}>Send</Button>
      </Flex>
    </Box>
  );
}
