"use client";
import React, { useState } from "react";
import { Container, Flex, Box, Heading, Button } from "@radix-ui/themes";
import JoinGame from "./components/JoinGame";
import StartGame from "./components/StartGame";

export default function Home() {
  const [mode, setMode] = useState<"menu" | "join" | "start">("menu");

  return (
    <Container size="2" py="9">
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
    </Container>
  );
}
