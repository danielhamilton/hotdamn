"use client";
import React, { useState, useEffect } from "react";
import useGameState from "../hooks/useGameState";
import GameLobby from "./GameLobby";
import DrawingCanvas from "./DrawingCanvas";

import {
  Button,
  TextField,
  Heading,
  Text,
  Flex,
  Box,
  Container,
} from "@radix-ui/themes";

interface GameProps {
  playerName: string;
  gameCode: string;
}

export default function Game({ playerName, gameCode }: GameProps) {
  const [gamePhase, setGamePhase] = useState("waiting");
  const { gameState, createGame, joinGame, startGame, submitEntry } =
    useGameState();
  const [currentEntry, setCurrentEntry] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Here you would set up your socket connection to the backend
    // and listen for game updates
  }, []);

  const handleCreateGame = () => {
    if (playerName.trim()) {
      createGame(playerName.trim());
      setError(null);
    } else {
      setError("Please enter a player name");
    }
  };

  const handleJoinGame = () => {
    if (playerName.trim() && gameCode.trim()) {
      joinGame(gameCode.trim(), playerName.trim());
      setError(null);
    } else {
      setError("Please enter both player name and game code");
    }
  };

  const handleStartGame = () => {
    startGame();
  };

  const handleSubmitEntry = () => {
    if (currentEntry.trim()) {
      submitEntry(currentEntry.trim());
      setCurrentEntry("");
    } else {
      setError("Please enter a phrase or complete your drawing");
    }
  };

  const renderJoinCreate = () => (
    <Flex direction="column" gap="4">
      <TextField.Root>
        <TextField.Slot
          placeholder="Enter your name"
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </TextField.Root>
      <Button onClick={handleCreateGame}>Create New Game</Button>
      <Flex gap="2">
        <TextField.Root style={{ flexGrow: 1 }}>
          <TextField.Slot
            placeholder="Enter game code"
            value={gameCode}
            onChange={(e) => setGameCode(e.target.value)}
          />
        </TextField.Root>
        <Button onClick={handleJoinGame}>Join Game</Button>
      </Flex>
    </Flex>
  );

  const renderGameContent = () => {
    switch (gameState.stage) {
      case "lobby":
        return <GameLobby gameState={gameState} onStart={handleStartGame} />;
      case "writing":
        return (
          <Flex direction="column" gap="2">
            <Heading size="6">Write a phrase:</Heading>
            <TextField.Root>
              <TextField.Slot
                placeholder="Type your phrase here"
                value={currentEntry}
                onChange={(e) => setCurrentEntry(e.target.value)}
              />
            </TextField.Root>
            <Button onClick={handleSubmitEntry}>Submit Phrase</Button>
          </Flex>
        );
      case "drawing":
        return (
          <Flex direction="column" gap="2">
            <Heading size="6">Draw: {gameState.currentPrompt}</Heading>
            <DrawingCanvas onSave={(imageData) => setCurrentEntry(imageData)} />
            <Button onClick={handleSubmitEntry}>Submit Drawing</Button>
          </Flex>
        );
      case "gameOver":
        return <Text>Game Over! Results will be displayed here.</Text>;
      default:
        return <Text>Waiting for game to start...</Text>;
    }
  };

  return (
    <Container size="2">
      {!gameState.gameCode ? renderJoinCreate() : renderGameContent()}
      {error && (
        <Box mt="4" style={{ color: "red" }}>
          <Text>{error}</Text>
        </Box>
      )}
    </Container>
  );
}
