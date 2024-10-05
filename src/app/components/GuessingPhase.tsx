import React, { useState } from "react";
import { Box, Text, TextField, Button } from "@radix-ui/themes";

interface GuessingPhaseProps {
  drawing: string;
  onComplete: (guess: string) => void;
  correctAnswer: string;
}

export function GuessingPhase({
  drawing,
  onComplete,
  correctAnswer,
}: GuessingPhaseProps) {
  const [guess, setGuess] = useState("");

  const handleSubmit = () => {
    onComplete(guess);
  };

  return (
    <Box>
      <Text size="5" weight="bold">
        Guess the Drawing
      </Text>
      <img
        src={drawing}
        alt="Drawing to guess"
        style={{ maxWidth: "100%", border: "1px solid #ccc" }}
      />
      <TextField.Root>
        <TextField.Slot
          value={guess}
          onChange={(e) => setGuess(e.target.value)}
          placeholder="Enter your guess"
        />
      </TextField.Root>
      <Button onClick={handleSubmit}>Submit Guess</Button>
    </Box>
  );
}
