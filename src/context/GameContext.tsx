import React, { createContext, useContext, useState } from "react";

type GameState = "menu" | "lobby" | "drawing" | "guessing";

interface Player {
  name: string;
  isBot: boolean;
  score: number;
}

interface GameContextType {
  gameState: GameState;
  partyCode: string | null;
  players: Player[];
  currentDrawer: Player | null;
  currentWord: string | null;
  timeRemaining: number;
  setGameState: (state: GameState) => void;
  setPartyCode: (code: string | null) => void;
  addPlayer: (name: string, isBot: boolean) => void;
  removePlayer: (name: string) => void;
  setCurrentDrawer: (player: Player | null) => void;
  setCurrentWord: (word: string | null) => void;
  setTimeRemaining: (time: number) => void;
  updateScore: (playerName: string, points: number) => void;
  nextRound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [gameState, setGameState] = useState<GameState>("menu");
  const [partyCode, setPartyCode] = useState<string | null>(null);
  const [players, setPlayers] = useState<Player[]>([]);
  const [currentDrawer, setCurrentDrawer] = useState<Player | null>(null);
  const [currentWord, setCurrentWord] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const addPlayer = (name: string, isBot: boolean) => {
    setPlayers((prev) => [...prev, { name, isBot, score: 0 }]);
  };

  const removePlayer = (name: string) => {
    setPlayers((prev) => prev.filter((player) => player.name !== name));
  };

  const updateScore = (playerName: string, points: number) => {
    setPlayers((prev) =>
      prev.map((player) =>
        player.name === playerName
          ? { ...player, score: player.score + points }
          : player,
      ),
    );
  };

  const nextRound = () => {
    setCurrentWord(null);
    // Choose next drawer, reset timer, etc.
  };

  return (
    <GameContext.Provider
      value={{
        gameState,
        partyCode,
        players,
        currentDrawer,
        currentWord,
        timeRemaining,
        setGameState,
        setPartyCode,
        addPlayer,
        removePlayer,
        setCurrentDrawer,
        setCurrentWord,
        setTimeRemaining,
        updateScore,
        nextRound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
};
