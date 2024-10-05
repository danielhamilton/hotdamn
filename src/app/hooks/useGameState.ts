import { useState, useEffect } from "react";
import { socket } from "../api/socket";

interface Player {
  id: string;
  name: string;
  isAI?: boolean;
}

interface HighScore {
  playerName: string;
  score: number;
}

interface GameState {
  gameCode: string;
  players: Player[];
  currentPhase: "lobby" | "drawing" | "guessing" | "results" | "waiting";
  isHost: boolean;
  scores: Record<string, number>;
  highScores: HighScore[];
}

export function useGameState() {
  const [gameState, setGameState] = useState<GameState>({
    gameCode: "",
    players: [],
    currentPhase: "lobby",
    isHost: false,
    scores: {},
    highScores: [],
  });

  useEffect(() => {
    socket.on("gameStateUpdate", (newState: Partial<GameState>) => {
      setGameState((prevState) => ({ ...prevState, ...newState }));
    });

    socket.on("updateScores", (scores: Record<string, number>) => {
      setGameState((prevState) => ({ ...prevState, scores }));
    });

    socket.on("updateHighScores", (highScores: HighScore[]) => {
      setGameState((prevState) => ({ ...prevState, highScores }));
    });

    return () => {
      socket.off("gameStateUpdate");
      socket.off("updateScores");
      socket.off("updateHighScores");
    };
  }, []);

  const updateGameState = (newState: Partial<GameState>) => {
    setGameState((prevState) => ({ ...prevState, ...newState }));
  };

  const createGame = (
    playerName: string,
    aiPlayerCount: number,
    aiDifficulty: "easy" | "medium" | "hard",
  ) => {
    socket.emit("createGame", { playerName, aiPlayerCount, aiDifficulty });
  };

  const joinGame = (gameCode: string, playerName: string) => {
    socket.emit("joinGame", { gameCode, playerName });
  };

  const startGame = () => {
    socket.emit("startGame", gameState.gameCode);
  };

  return { gameState, updateGameState, createGame, joinGame, startGame };
}

export default useGameState;
