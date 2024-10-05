"use client";
import React, { useState } from "react";
import DrawingCanvas from "./DrawingCanvas";
import { GuessingPhase } from "./GuessingPhase";
import { Button, Flex, Text, Select, TextField } from "@radix-ui/themes";

interface PracticeModeProps {
  onExit: () => void;
}

export function PracticeMode({ onExit }: PracticeModeProps) {
  const [mode, setMode] = useState<
    "setup" | "wordSubmission" | "drawing" | "guessing"
  >("setup");
  const [timeLimit, setTimeLimit] = useState(60);
  const [submittedWords, setSubmittedWords] = useState<string[]>([]);
  const [currentWord, setCurrentWord] = useState("");
  const [currentDrawing, setCurrentDrawing] = useState("");
  const [newWord, setNewWord] = useState("");

  const startWordSubmission = () => {
    setMode("wordSubmission");
  };

  const submitWord = () => {
    if (newWord.trim()) {
      setSubmittedWords([...submittedWords, newWord.trim()]);
      setNewWord("");
    }
    if (submittedWords.length + 1 >= 3) {
      // Assuming we want at least 3 words
      startDrawing();
    }
  };

  const startDrawing = () => {
    const randomWord =
      submittedWords[Math.floor(Math.random() * submittedWords.length)];
    setCurrentWord(randomWord);
    setMode("drawing");
  };

  const handleDrawingComplete = (completedDrawing: string) => {
    setCurrentDrawing(completedDrawing);
    setMode("guessing");
  };

  const handleGuessingComplete = (guess: string) => {
    alert(`Your guess: ${guess}\nCorrect answer: ${currentWord}`);
    setMode("setup");
    setSubmittedWords([]);
    setCurrentWord("");
    setCurrentDrawing("");
  };

  if (mode === "setup") {
    return (
      <Flex direction="column" gap="4">
        <Text size="5" weight="bold">
          Practice Mode Setup
        </Text>
        <Text>Select time limit:</Text>
        <Select.Root
          value={timeLimit.toString()}
          onValueChange={(value) => setTimeLimit(Number(value))}
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item value="15">15 seconds</Select.Item>
            <Select.Item value="30">30 seconds</Select.Item>
            <Select.Item value="45">45 seconds</Select.Item>
            <Select.Item value="60">1 minute</Select.Item>
          </Select.Content>
        </Select.Root>
        <Button onClick={startWordSubmission}>Start Game</Button>
        <Button onClick={onExit}>Exit Practice Mode</Button>
      </Flex>
    );
  }

  if (mode === "wordSubmission") {
    return (
      <Flex direction="column" gap="4">
        <Text size="5" weight="bold">
          Submit Words
        </Text>
        <TextField.Slot
          value={newWord}
          onChange={(e) => setNewWord(e.target.value)}
          placeholder="Enter a word or phrase"
        />
        <Button onClick={submitWord}>Submit Word</Button>
        <Text>Submitted words: {submittedWords.length}</Text>
      </Flex>
    );
  }

  if (mode === "drawing") {
    return (
      <DrawingCanvas
        onComplete={handleDrawingComplete}
        initialTimeLimit={timeLimit}
        isPracticeMode={true}
        prompt={currentWord}
      />
    );
  }

  if (mode === "guessing") {
    return (
      <GuessingPhase
        drawing={currentDrawing}
        onComplete={handleGuessingComplete}
        correctAnswer={currentWord}
      />
    );
  }

  return null;
}
