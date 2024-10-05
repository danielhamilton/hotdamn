import React, { useState } from "react";
import { Box } from "@radix-ui/themes";
import DrawingCanvas from "./DrawingCanvas";
import GameLobby from "./GameLobby";

interface ActiveGameProps {
  gameState: "lobby" | "drawing" | "guessing" | "results";
  players: string[];
  isHost: boolean;
  currentPrompt?: string;
}

const ActiveGame: React.FC<ActiveGameProps> = ({
  gameState,
  players,
  isHost,
  currentPrompt,
}) => {
  const [submissions, setSubmissions] = useState<string[]>([]);

  const handleStartGame = () => {
    // Logic to start the game
  };

  const handleSubmitDrawing = (imageData: string) => {
    setSubmissions([...submissions, imageData]);
    // Logic to move to next player or round
  };

  return (
    <Box>
      {gameState === "lobby" && (
        <GameLobby
          players={players}
          isHost={isHost}
          onStartGame={handleStartGame}
        />
      )}
      {gameState === "drawing" && currentPrompt && (
        <DrawingCanvas prompt={currentPrompt} onSubmit={handleSubmitDrawing} />
      )}
      {/* Add components for guessing and results states */}
    </Box>
  );
};

export default ActiveGame;
