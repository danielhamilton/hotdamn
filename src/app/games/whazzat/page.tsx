"use client";

import { useState, useEffect } from "react";
import { Button, Heading, Text, Flex, TextField } from "@radix-ui/themes";
import { motion } from "framer-motion";
import Lobby from "./components/Lobby";
import GameFlow from "./components/GameFlow";
import { createClient } from "@supabase/supabase-js";
import { createBotPlayer, submitBotDrawing } from "./utils/botPlayer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function WhazzatLanding() {
  const [gameOption, setGameOption] = useState<"create" | "join" | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [playerId, setPlayerId] = useState<string | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [joinGameId, setJoinGameId] = useState("");
  const [botPlayerId, setBotPlayerId] = useState<string | null>(null);
  const [currentPlayerIndex, setCurrentPlayerIndex] = useState(0);
  const [players, setPlayers] = useState([]);

  useEffect(() => {
    if (gameId) {
      const gameSubscription = supabase
        .channel(`game:${gameId}`)
        .on(
          "postgres_changes",
          {
            event: "UPDATE",
            schema: "public",
            table: "games",
            filter: `id=eq.${gameId}`,
          },
          (payload) => {
            if (payload.new.status === "started") {
              setGameStarted(true);
            }
          },
        )
        .subscribe();

      return () => {
        supabase.removeChannel(gameSubscription);
      };
    }
  }, [gameId]);

  const handleCreateGame = async () => {
    const newGameId = Math.random().toString(36).substring(2, 8).toUpperCase();
    const { data, error } = await supabase
      .from("games")
      .upsert({
        id: newGameId,
        status: "waiting",
        current_round: 1,
        current_player_index: 0,
      })
      .select();

    if (error) {
      console.error("Error creating game:", error);
      alert("Error creating game. Please try again.");
      return;
    }

    setGameId(newGameId);
    setGameOption("create");
    alert(`Game created! Your Game ID is: ${newGameId}`);
  };

  const handleJoinGame = async () => {
    if (joinGameId.trim()) {
      const { data, error } = await supabase
        .from("games")
        .select()
        .eq("id", joinGameId.toUpperCase())
        .single();

      if (error) {
        console.error("Error joining game:", error);
        alert("Game not found. Please check the Game ID and try again.");
        return;
      }

      if (data.status !== "waiting") {
        alert(
          "This game has already started or finished. Please join a different game.",
        );
        return;
      }

      setGameId(joinGameId.toUpperCase());
      setGameOption("join");
      alert(`Joined game: ${joinGameId.toUpperCase()}`);
    } else {
      alert("Please enter a Game ID");
    }
  };

  const handleStartGame = async () => {
    if (gameId) {
      const { data: players, error: playersError } = await supabase
        .from("players")
        .select("id")
        .eq("game_id", gameId);

      if (playersError) {
        console.error("Error fetching players:", playersError);
        alert("Error starting game. Please try again.");
        return;
      }

      if (!players || players.length < 2) {
        alert("At least 2 players are required to start the game.");
        return;
      }

      const { error } = await supabase
        .from("games")
        .update({ status: "started" })
        .eq("id", gameId);

      if (error) {
        console.error("Error starting game:", error);
        alert("Error starting game. Please try again.");
        return;
      }

      setGameStarted(true);
    }
  };

  const handlePlayerJoined = (id: string) => {
    setPlayerId(id);
  };

  const handleGameComplete = () => {
    setGameStarted(false);
    setGameOption(null);
    setGameId(null);
    setPlayerId(null);
    setBotPlayerId(null);
  };

  const handleAddBot = async () => {
    if (gameId) {
      const botId = await createBotPlayer(gameId);
      if (botId) {
        setBotPlayerId(botId);
        alert("Bot player added successfully!");
      } else {
        alert("Failed to add bot player. Please try again.");
      }
    }
  };

  useEffect(() => {
    if (gameStarted && botPlayerId && gameId) {
      const botInterval = setInterval(async () => {
        const { data } = await supabase
          .from("games")
          .select("current_player_index, players")
          .eq("id", gameId)
          .single();

        if (data && data.players[data.current_player_index] === botPlayerId) {
          await submitBotDrawing(gameId, botPlayerId);
        }
      }, 5000); // Check every 5 seconds

      return () => clearInterval(botInterval);
    }
  }, [gameStarted, botPlayerId, gameId]);

  const fetchGameData = async () => {
    try {
      const { data, error } = await supabase
        .from("games")
        .select(
          `
          id,
          status,
          current_round,
          current_player_index,
          players:players(id, name)
        `,
        )
        .eq("id", gameId)
        .single();

      if (error) throw error;

      if (data) {
        console.log("Fetched game data:", data);
        setCurrentPlayerIndex(data.current_player_index);
        setCurrentRound(data.current_round);
        if (data.players) {
          setPlayers(data.players);
        }
      }
    } catch (error) {
      console.error("Error fetching game data:", error);
    }
  };

  useEffect(() => {
    if (gameId) {
      const intervalId = setInterval(fetchGameData, 5000); // Poll every 5 seconds
      return () => clearInterval(intervalId); // Clean up on unmount
    }
  }, [gameId]);

  return (
    <Flex
      direction="column"
      align="center"
      justify="center"
      style={{ minHeight: "100vh" }}
    >
      {!gameOption && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Heading size="9" mb="4">
            Whazzat
          </Heading>
          <Text size="5" mb="6">
            A drawing-based telephone game
          </Text>
          <Flex direction="column" gap="4">
            <Button size="3" onClick={handleCreateGame}>
              Create Game
            </Button>
            <Flex gap="2">
              <TextField.Root
                placeholder="Enter Game ID"
                value={joinGameId}
                onChange={(e) => setJoinGameId(e.target.value.toUpperCase())}
              />

              <Button size="3" onClick={handleJoinGame}>
                Join Game
              </Button>
            </Flex>
          </Flex>
        </motion.div>
      )}

      {gameOption && !gameStarted && gameId && (
        <Lobby
          gameId={gameId}
          onStartGame={handleStartGame}
          onPlayerJoined={handlePlayerJoined}
          onAddBot={handleAddBot}
        />
      )}

      {gameStarted && gameId && playerId && (
        <GameFlow
          gameId={gameId}
          playerId={playerId}
          onGameComplete={handleGameComplete}
        />
      )}
    </Flex>
  );
}
