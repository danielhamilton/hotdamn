import React, { useEffect, useState } from "react";
import { useGameState } from "../hooks/useGameState";
import { socket } from "../api/socket";

interface RoundResult {
  drawer: string;
  prompt: string;
  guesses: { player: string; guess: string; score: number }[];
}

export function ResultsDisplay() {
  const [results, setResults] = useState<RoundResult[]>([]);
  const { gameState, updateGameState } = useGameState();

  useEffect(() => {
    socket.on("roundResults", (roundResults: RoundResult[]) => {
      setResults(roundResults);
    });

    return () => {
      socket.off("roundResults");
    };
  }, []);

  const startNextRound = () => {
    socket.emit("startNextRound", gameState.gameCode);
  };

  return (
    <div>
      <h3>Round Results</h3>
      {results.map((result, index) => (
        <div key={index}>
          <h4>
            {result.drawer}'s drawing: {result.prompt}
          </h4>
          <ul>
            {result.guesses.map((guess, guessIndex) => (
              <li key={guessIndex}>
                {guess.player}: {guess.guess} (Score: {guess.score})
              </li>
            ))}
          </ul>
        </div>
      ))}
      {gameState.isHost && (
        <button onClick={startNextRound}>Start Next Round</button>
      )}
    </div>
  );
}
