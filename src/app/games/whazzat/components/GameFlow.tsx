import React, { useState, useEffect } from "react";
import { Box, Text, Button, Flex, Progress } from "@radix-ui/themes";
import { supabase } from "../../../supabase";
import DrawingCanvas from "./DrawingCanvas";
import ResultsScreen from "./ResultsScreen";
import {
  playTurnChangeSound,
  playTimeRunningOutSound,
  playGameOverSound,
} from "../utils/sounds";
import Chat from "./Chat";
import { motion, AnimatePresence } from "framer-motion";
import { submitBotDrawing, sendBotMessage } from "../utils/botPlayer";

interface GameFlowProps {
  gameId: string;
  playerId: string;
  onGameComplete: () => void;
}

interface GameState {
  currentRound: number;
  currentPlayerIndex: number;
  players: string[];
  drawings: string[];
  status: "waiting" | "started" | "finished";
}

const TURN_DURATION = 60; // 60 seconds per turn

export default function GameFlow({
  gameId,
  playerId,
  onGameComplete,
}: GameFlowProps) {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [timeLeft, setTimeLeft] = useState(TURN_DURATION);

  const fetchGameState = async () => {
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("id", gameId)
      .single();

    if (gameError) {
      console.error("Error fetching game state:", gameError);
      return;
    }

    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", gameId);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return;
    }

    const { data: drawingsData, error: drawingsError } = await supabase
      .from("drawings")
      .select("*")
      .eq("game_id", gameId);

    if (drawingsError) {
      console.error("Error fetching drawings:", drawingsError);
      return;
    }

    const newGameState = {
      ...gameData,
      players: playersData,
      drawings: drawingsData,
    };

    setGameState(newGameState);
    setIsPlayerTurn(
      gameData.current_player_index ===
        playersData.findIndex((p) => p.id === playerId),
    );
    if (
      gameData.current_player_index ===
      playersData.findIndex((p) => p.id === playerId)
    ) {
      setTimeLeft(TURN_DURATION);
    }
  };

  useEffect(() => {
    fetchGameState();

    const gameSubscription = supabase
      .channel(`game:${gameId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "games",
          filter: `id=eq.${gameId}`,
        },
        fetchGameState,
      )
      .subscribe();

    return () => {
      supabase.removeChannel(gameSubscription);
    };
  }, [gameId, playerId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlayerTurn && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0 && isPlayerTurn) {
      handleDrawingSubmit(""); // Submit an empty drawing if time runs out
    }
    return () => clearInterval(timer);
  }, [isPlayerTurn, timeLeft]);

  useEffect(() => {
    if (isPlayerTurn) {
      playTurnChangeSound();
    }
  }, [isPlayerTurn]);

  useEffect(() => {
    if (timeLeft === 10) {
      playTimeRunningOutSound();
    }
  }, [timeLeft]);

  useEffect(() => {
    if (gameState && !isPlayerTurn) {
      const currentPlayer = gameState.players[gameState.current_player_index];
      if (currentPlayer && currentPlayer.name.startsWith("Bot_")) {
        // Bot sends a message
        sendBotMessage(gameId, currentPlayer.id, currentPlayer.name);

        // Bot draws after a short delay
        const botDrawingTimeout = setTimeout(() => {
          submitBotDrawing(gameId, currentPlayer.id).catch((error) => {
            console.error("Error during bot's turn:", error);
          });
        }, 3000); // 3 seconds delay

        return () => clearTimeout(botDrawingTimeout);
      }
    }
  }, [gameState, isPlayerTurn, gameId]);

  const handleDrawingSubmit = async (imageData: string) => {
    if (!gameState) return;

    try {
      const { data: newDrawing, error: drawingError } = await supabase
        .from("drawings")
        .insert({
          game_id: gameId,
          player_id: playerId,
          image_data: imageData,
        })
        .select()
        .single();

      if (drawingError) throw drawingError;

      const nextPlayerIndex =
        (gameState.current_player_index + 1) % gameState.players.length;
      const nextRound =
        nextPlayerIndex === 0
          ? gameState.current_round + 1
          : gameState.current_round;
      const newStatus =
        nextRound > gameState.players.length ? "finished" : "started";

      const { error: updateError } = await supabase
        .from("games")
        .update({
          current_player_index: nextPlayerIndex,
          current_round: nextRound,
          status: newStatus,
        })
        .eq("id", gameId);

      if (updateError) throw updateError;

      // Fetch updated game state
      await fetchGameState();
    } catch (error) {
      console.error("Error submitting drawing:", error);
      alert("Failed to submit drawing. Please try again.");
    }
  };

  const calculateProgress = () => {
    if (!gameState || !gameState.players || gameState.players.length === 0)
      return 0;
    const totalRounds = gameState.players.length;
    const completedRounds = gameState.current_round - 1;
    return Math.max(0, Math.min(100, (completedRounds / totalRounds) * 100));
  };

  const getCurrentPlayerName = () => {
    if (
      gameState &&
      gameState.players &&
      gameState.players.length > gameState.current_player_index
    ) {
      return gameState.players[gameState.current_player_index].name;
    }
    return "the current player";
  };

  if (!gameState) {
    return <Text>Loading game...</Text>;
  }

  if (gameState.status === "finished") {
    playGameOverSound();
    return (
      <ResultsScreen
        drawings={gameState.drawings}
        players={gameState.players}
        onGameComplete={onGameComplete}
      />
    );
  }

  const progress = calculateProgress();

  return (
    <Box p="4">
      <Flex direction="column" gap="4">
        <AnimatePresence mode="wait">
          <motion.div
            key={gameState.current_round}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <Text size="5">
              Round: {gameState.current_round} / {gameState.players.length}
            </Text>
            <Progress value={progress} />
            {isPlayerTurn ? (
              <>
                <Text size="4">It's your turn to draw!</Text>
                <DrawingCanvas
                  onSubmit={handleDrawingSubmit}
                  timeLeft={timeLeft}
                />
              </>
            ) : (
              <Text size="4">
                Waiting for {getCurrentPlayerName()} to draw...
              </Text>
            )}
          </motion.div>
        </AnimatePresence>
        <Chat
          gameId={gameId}
          playerId={playerId}
          playerName={
            gameState.players.find((p) => p.id === playerId)?.name || ""
          }
        />
      </Flex>
    </Box>
  );
}
