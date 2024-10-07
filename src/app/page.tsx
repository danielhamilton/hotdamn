"use client";
import React, { useState } from "react";
import { Container, Flex, Box, Heading, Button } from "@radix-ui/themes";
import { GameProvider, useGame } from "../context/GameContext";
import JoinGame from "./components/JoinGame";
import StartGame from "./components/StartGame";
import Lobby from "./components/Lobby";
import GamePlay from "./components/Gameplay";

const GameContent = () => {
  const { gameState, partyCode } = useGame();
  const [mode, setMode] = useState<"menu" | "join" | "start">("menu");

  if (gameState === "lobby") {
    return <Lobby />;
  }

  if (gameState === "drawing" || gameState === "guessing") {
    return <GamePlay />;
  }

  return (
    <Flex direction="column" gap="6" align="center">
      <Heading size="9" gradient="blue">
        HotDamn!Fun
      </Heading>
      {mode === "menu" && (
        <Flex direction="column" gap="4">
          <Button onClick={() => setMode("join")}>Join Party</Button>
          <Button onClick={() => setMode("start")}>Start Party</Button>
        </Flex>
      )}
      {mode === "join" && <JoinGame onBack={() => setMode("menu")} />}
      {mode === "start" && <StartGame onBack={() => setMode("menu")} />}
    </Flex>
  );
};

export default function Home() {
  return (
    <GameProvider>
      <Container size="2" py="9">
        <GameContent />
      </Container>
    </GameProvider>
  );
}
