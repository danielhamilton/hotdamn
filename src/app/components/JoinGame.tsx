"use client";
import React, { useState } from "react";
import { Button, Flex, TextField } from "@radix-ui/themes";
import { joinParty } from "../api/partyApi";

interface JoinGameProps {
  onBack: () => void;
}

const JoinGame: React.FC<JoinGameProps> = ({ onBack }) => {
  const [partyCode, setPartyCode] = useState("");

  const handleJoin = async () => {
    try {
      const result = await joinParty(partyCode);
      console.log("Joined party:", result);
      // Handle successful join (e.g., update state, show a message)
    } catch (error) {
      console.error("Failed to join party:", error);
      // Handle error (e.g., show error message to user)
    }
  };

  return (
    <Flex direction="column" gap="4">
      <TextField.Root
        placeholder="Enter party code"
        value={partyCode}
        onChange={(e) => setPartyCode(e.target.value)}
      ></TextField.Root>
      <Button onClick={handleJoin}>Join</Button>
      <Button onClick={onBack} variant="soft">
        Back
      </Button>
    </Flex>
  );
};

export default JoinGame;
