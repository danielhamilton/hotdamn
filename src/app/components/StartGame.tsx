"use client";
import React, { useState } from "react";
import { Button, Flex, Text, Box } from "@radix-ui/themes";
import { useGame } from "../../context/GameContext";
import { startParty } from "../api/partyApi";

interface StartGameProps {
  onBack: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onBack }) => {
  const { setPartyCode, setGameState } = useGame();
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    try {
      const result = await startParty();
      if (result && result.partyCode) {
        setPartyCode(result.partyCode);
        setGameState("lobby");
      } else {
        throw new Error("Invalid server response");
      }
    } catch (error) {
      console.error("Failed to start party:", error);
      setError("Failed to start party. Please try again.");
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Button onClick={handleStart}>Start New Party</Button>
      {error && (
        <Box>
          <Text color="red">{error}</Text>
        </Box>
      )}
      <Button onClick={onBack} variant="soft">
        Back
      </Button>
    </Flex>
  );
};

export default StartGame;
