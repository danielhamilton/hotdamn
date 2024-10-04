"use client";
import React, { useState } from "react";
import useGameState from "../hooks/useGameState";
import {
  Button,
  TextField,
  Heading,
  Text,
  Flex,
  Box,
  Container,
} from "@radix-ui/themes";

const Game = () => {
  const { gameState, joinGame, createGame } = useGameState();
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const handleCreateGame = () => {
    if (playerName) {
      createGame(playerName);
    }
  };

  const handleJoinGame = () => {
    if (playerName && gameCode) {
      joinGame(gameCode, playerName);
    }
  };

  return (
    <Container size="2">
      <Heading size="8" mb="5">
        HotDamn!IFun
      </Heading>
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
      <Box mt="6">
        <Heading size="6" mb="2">
          Game State:
        </Heading>
        <Box
          style={{
            background: "var(--gray-a2)",
            padding: "var(--space-3)",
            borderRadius: "var(--radius-3)",
          }}
        >
          <Text as="pre" size="2" style={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(gameState, null, 2)}
          </Text>
        </Box>
      </Box>
    </Container>
  );
};

export default Game;
