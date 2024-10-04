// File: src/app/page.tsx
"use client";
import { useState } from "react";
import Game from "./components/Game";
import JoinGame from "./components/JoinGame";
import io from "socket.io-client";
import { Container, Heading, Text, Flex } from "@radix-ui/themes";

const socket = io("/api/socket");

export default function Home() {
  const [gameState, setGameState] = useState("join"); // 'join', 'lobby', 'playing'
  const [playerName, setPlayerName] = useState("");
  const [gameCode, setGameCode] = useState("");

  const handleJoinGame = (name: string, code: string) => {
    setPlayerName(name);
    setGameCode(code);
    setGameState("lobby");
  };

  return (
    <Container size="3" p="4">
      <Flex direction="column" gap="4">
        <Heading size="8" align="center">
          HotDamn!Fun
        </Heading>
        {gameState === "join" && <JoinGame onJoin={handleJoinGame} />}
        {gameState === "lobby" && (
          <Flex direction="column" gap="2" align="center">
            <Text size="5">Waiting for other players...</Text>
            <Text size="3">Game Code: {gameCode}</Text>
            <Text size="3">Player Name: {playerName}</Text>
          </Flex>
        )}
        {gameState === "playing" && (
          <Game playerName={playerName} gameCode={gameCode} />
        )}
      </Flex>
    </Container>
  );
}
