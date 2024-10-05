"use client";
import React, { useState, useEffect } from "react";
import { useGameState } from "../hooks/useGameState";
import { socket } from "../api/socket";
import { Lobby } from "./Lobby";
import DrawingCanvas from "./DrawingCanvas";
import { GuessingPhase } from "./GuessingPhase";
import { ResultsDisplay } from "./ResultsDisplay";
import { PracticeMode } from "./PracticeMode";

interface GameProps {
  playerName: string;
  gameCode: string;
}

export default function Game({ playerName, gameCode }: GameProps) {
  console.log("Game component:", { playerName, gameCode }); // Add this line
  const { gameState, createGame, joinGame, startGame } = useGameState();
  const [aiPlayerCount, setAiPlayerCount] = useState(3);
  const [aiDifficulty, setAiDifficulty] = useState<"easy" | "medium" | "hard">(
    "medium",
  );
  const [isPracticeMode, setIsPracticeMode] = useState(false);

  useEffect(() => {
    // Join the game when the component mounts
    joinGame(gameCode, playerName);
  }, []);

  useEffect(() => {
    socket.on("newRoundStarted", (updatedGame) => {
      updateGameState({ ...updatedGame, currentPhase: "drawing" });
    });

    socket.on("startGuessingPhase", (updatedGame) => {
      updateGameState({ ...updatedGame, currentPhase: "guessing" });
    });

    socket.on("roundResults", (results) => {
      updateGameState({ currentPhase: "results", results });
    });

    return () => {
      socket.off("newRoundStarted");
      socket.off("startGuessingPhase");
      socket.off("roundResults");
    };
  }, []);

  const handleCreateGame = () => {
    const playerName = prompt("Enter your name");
    if (playerName) {
      createGame(playerName, aiPlayerCount, aiDifficulty);
    }
  };

  if (isPracticeMode) {
    return <PracticeMode onExit={() => setIsPracticeMode(false)} />;
  }

  if (!gameState.gameCode) {
    return (
      <div>
        <h1>Welcome to the Game</h1>
        <div>
          <label>
            Number of AI players:
            <input
              type="number"
              min="1"
              max="7"
              value={aiPlayerCount}
              onChange={(e) => setAiPlayerCount(parseInt(e.target.value))}
            />
          </label>
        </div>
        <div>
          <label>
            AI Difficulty:
            <select
              value={aiDifficulty}
              onChange={(e) =>
                setAiDifficulty(e.target.value as "easy" | "medium" | "hard")
              }
            >
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </label>
        </div>
        <button onClick={handleCreateGame}>Create Game</button>
        <button onClick={() => setIsPracticeMode(true)}>Practice Mode</button>
      </div>
    );
  }

  switch (gameState.currentPhase) {
    case "lobby":
      return <Lobby gameState={gameState} onStartGame={startGame} />;
    case "drawing":
      return <DrawingCanvas />;
    case "guessing":
      return <GuessingPhase />;
    case "results":
      return (
        <ResultsDisplay results={gameState.results} onNextRound={startGame} />
      );
    default:
      return <div>Loading...</div>;
  }
}

const handleJoinGame = async (name: string, code: string) => {
  try {
    // Here, you would typically make an API call to join the game
    // For now, we'll simulate it with a timeout
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Joining game with name: ${name} and code: ${code}`);
    // Update your app state here (e.g., set the current player, game state, etc.)
    // For example:
    // setCurrentPlayer(name);
    // setGameCode(code);
    // setGameState('lobby');
  } catch (error) {
    console.error("Error joining game:", error);
    throw error; // Re-throw the error so the JoinGame component can handle it
  }
};
