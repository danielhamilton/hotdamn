import React, { useState, useEffect } from "react";
import { Button, Flex, Text, Box, TextField } from "@radix-ui/themes";
import { useGame } from "../../context/GameContext";
import DrawingArea from "./DrawingArea";

const words = [
  "apple",
  "banana",
  "car",
  "dog",
  "elephant",
  "frog",
  "guitar",
  "house",
  "igloo",
  "jacket",
];

const GamePlay: React.FC = () => {
  const {
    gameState,
    players,
    currentDrawer,
    currentWord,
    timeRemaining,
    setGameState,
    setCurrentDrawer,
    setCurrentWord,
    setTimeRemaining,
    updateScore,
    nextRound,
  } = useGame();

  const [guess, setGuess] = useState("");
  const [drawingData, setDrawingData] = useState<string | null>(null);

  useEffect(() => {
    if (gameState === "drawing" && !currentWord) {
      setCurrentWord(words[Math.floor(Math.random() * words.length)]);
      setTimeRemaining(60); // 60 seconds to draw
    }
  }, [gameState, currentWord, setCurrentWord, setTimeRemaining]);

  useEffect(() => {
    if (timeRemaining > 0) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (gameState === "drawing") {
      setGameState("guessing");
      setTimeRemaining(30); // 30 seconds to guess
    } else if (gameState === "guessing") {
      nextRound();
    }
  }, [timeRemaining, gameState, setTimeRemaining, setGameState, nextRound]);

  const handleGuess = () => {
    if (guess.toLowerCase() === currentWord?.toLowerCase()) {
      updateScore(
        players.find((p) => p.name !== currentDrawer?.name)!.name,
        10,
      );
      updateScore(currentDrawer!.name, 5);
      nextRound();
    }
    setGuess("");
  };

  const handleDraw = (imageData: string) => {
    setDrawingData(imageData);
  };

  if (gameState === "drawing" && currentDrawer) {
    return (
      <Flex direction="column" gap="4">
        <Text>You are drawing: {currentWord}</Text>
        <Text>Time remaining: {timeRemaining}</Text>
        <DrawingArea onDraw={handleDraw} />
      </Flex>
    );
  }

  if (gameState === "guessing") {
    return (
      <Flex direction="column" gap="4">
        <Text>Guess the drawing!</Text>
        <Text>Time remaining: {timeRemaining}</Text>
        {drawingData && <img src={drawingData} alt="Drawing to guess" />}
        <Flex>
          <TextField.Root
            value={guess}
            onChange={(e) => setGuess(e.target.value)}
            placeholder="Enter your guess"
          />
          <Button onClick={handleGuess}>Guess</Button>
        </Flex>
      </Flex>
    );
  }

  return <Text>Waiting for game to start...</Text>;
};

export default GamePlay;
