"use client";
import React, { useState } from "react";
import { Button, Flex, Text } from "@radix-ui/themes";
import { startParty } from "../api/partyApi";

interface StartGameProps {
  onBack: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onBack }) => {
  const [error, setError] = useState<string | null>(null);
  const [partyCode, setPartyCode] = useState<string | null>(null);

  const handleStart = async () => {
    console.log("Start button clicked"); // Debug log
    try {
      setError(null);
      const result = await startParty();
      console.log("Started party:", result); // Debug log
      setPartyCode(result.partyCode);
    } catch (error) {
      console.error("Failed to start party:", error);
      setError("Failed to start party. Please try again.");
    }
  };

  return (
    <Flex direction="column" gap="4">
      <Button onClick={handleStart}>Start New Party</Button>
      {error && <Text color="red">{error}</Text>}
      {partyCode && <Text>Party started! Code: {partyCode}</Text>}
      <Button onClick={onBack} variant="soft">
        Back
      </Button>
    </Flex>
  );
};

export default StartGame;
