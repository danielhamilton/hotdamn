"use client";
import React, { useState } from "react";
import { Button, Flex, Text, Box, Spinner } from "@radix-ui/themes";
import * as Toast from "@radix-ui/react-toast";
import { startParty } from "../api/partyApi";
import styles from "./Toast.module.css"; // We'll create this CSS module next

interface StartGameProps {
  onBack: () => void;
}

const StartGame: React.FC<StartGameProps> = ({ onBack }) => {
  const [error, setError] = useState<string | null>(null);
  const [partyCode, setPartyCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleStart = async () => {
    console.log("Start button clicked");
    setIsLoading(true);
    setError(null);
    setPartyCode(null);
    try {
      const result = await startParty();
      console.log("Server response:", result);
      if (result && result.partyCode) {
        setPartyCode(result.partyCode);
        console.log("Party code set:", result.partyCode);
      } else {
        throw new Error("Invalid server response");
      }
    } catch (error) {
      console.error("Failed to start party:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (partyCode) {
      navigator.clipboard
        .writeText(partyCode)
        .then(() => setOpen(true))
        .catch((err) => {
          console.error("Failed to copy: ", err);
          setError("Failed to copy code to clipboard");
        });
    }
  };

  return (
    <Toast.Provider swipeDirection="right">
      <Flex direction="column" gap="4">
        <Button onClick={handleStart} disabled={isLoading}>
          {isLoading ? <Spinner /> : "Start New Party"}
        </Button>
        {error && (
          <Box>
            <Text color="red">{error}</Text>
          </Box>
        )}
        {partyCode && (
          <Box>
            <Text>Party started! Code: {partyCode}</Text>
            <Button onClick={handleCopyCode} size="1" variant="soft">
              Copy Code
            </Button>
          </Box>
        )}
        <Button onClick={onBack} variant="soft">
          Back
        </Button>
      </Flex>

      <Toast.Root
        className={styles.ToastRoot}
        open={open}
        onOpenChange={setOpen}
      >
        <Toast.Title className={styles.ToastTitle}>Success!</Toast.Title>
        <Toast.Description className={styles.ToastDescription}>
          Party code copied to clipboard
        </Toast.Description>
        <Toast.Action className={styles.ToastAction} asChild altText="Close">
          <button className={styles.Button}>OK</button>
        </Toast.Action>
      </Toast.Root>
      <Toast.Viewport className={styles.ToastViewport} />
    </Toast.Provider>
  );
};

export default StartGame;
