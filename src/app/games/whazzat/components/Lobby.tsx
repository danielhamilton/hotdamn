import React, { useState, useEffect } from "react";
import { Box, Text, Button, Flex, TextField } from "@radix-ui/themes";
import { motion } from "framer-motion";
import { supabase } from "../../../supabase";

interface Player {
  id: string;
  name: string;
}

interface LobbyProps {
  gameId: string;
  onStartGame: () => void;
  onPlayerJoined: (playerId: string) => void;
  onAddBot: () => void;
}

export default function Lobby({
  gameId,
  onStartGame,
  onPlayerJoined,
  onAddBot,
}: LobbyProps) {
  const [players, setPlayers] = useState<Player[]>([]);
  const [playerName, setPlayerName] = useState("");
  const [isJoining, setIsJoining] = useState(false);
  const [hasJoined, setHasJoined] = useState(false);
  const [canStartGame, setCanStartGame] = useState(false);

  useEffect(() => {
    const fetchPlayers = async () => {
      const { data, error } = await supabase
        .from("players")
        .select("id, name")
        .eq("game_id", gameId);

      if (error) {
        console.error("Error fetching players:", error);
        return;
      }

      setPlayers(data || []);
      setCanStartGame(data && data.length >= 2);
    };

    fetchPlayers();

    const playersSubscription = supabase
      .channel(`players:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "players",
          filter: `game_id=eq.${gameId}`,
        },
        fetchPlayers,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(playersSubscription);
    };
  }, [gameId]);

  const handleJoinGame = async () => {
    if (playerName.trim()) {
      setIsJoining(true);
      const { data, error } = await supabase
        .from("players")
        .insert({
          name: playerName.trim(),
          game_id: gameId,
        })
        .select()
        .single();

      if (error) {
        console.error("Error joining game:", error);
        alert("Error joining the game. Please try again.");
        setIsJoining(false);
        return;
      }

      setPlayerName("");
      onPlayerJoined(data.id);
      setIsJoining(false);
      setHasJoined(true);
      if (data) {
        setPlayers((prevPlayers) => [...prevPlayers, data]);
        setCanStartGame(players.length + 1 >= 2);
      }
    } else {
      alert("Please enter your name");
    }
  };

  const handleAddBot = () => {
    onAddBot();
    setPlayers((prevPlayers) => [
      ...prevPlayers,
      { id: `bot-${Date.now()}`, name: "Bot Player" },
    ]);
    setCanStartGame(players.length + 1 >= 2);
  };

  return (
    <Box p="4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Text size="5" mb="4">
          Game Lobby
        </Text>
        <Text size="3" mb="2">
          Game ID: {gameId}
        </Text>

        {!hasJoined ? (
          <Flex direction="column" gap="2" mb="4">
            <TextField.Root
              placeholder="Enter your name"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
            />

            <Button onClick={handleJoinGame} disabled={isJoining}>
              {isJoining ? "Joining..." : "Join Game"}
            </Button>
          </Flex>
        ) : (
          <Text size="3" mb="2" color="green">
            You have joined the game!
          </Text>
        )}

        <Text size="3" mb="2">
          Players: {players.length}
        </Text>
        <Box>
          {players.map((player) => (
            <Text key={player.id}>{player.name}</Text>
          ))}
        </Box>

        <Flex direction="column" gap="2" mt="4">
          <Button onClick={onStartGame} disabled={!canStartGame}>
            Start Game
          </Button>
          <Button onClick={handleAddBot} disabled={!hasJoined}>
            Add Bot Player
          </Button>
        </Flex>
        {!canStartGame && (
          <Text size="2" color="red" mt="2">
            {players.length < 2
              ? "At least 2 players are required to start the game."
              : !hasJoined
                ? "You need to join the game before starting."
                : ""}
          </Text>
        )}
      </motion.div>
    </Box>
  );
}
