import React from "react";

interface LobbyProps {
  gameState: any; // Replace 'any' with your actual GameState type
  onStartGame: () => void;
}

export function Lobby({ gameState, onStartGame }: LobbyProps) {
  return (
    <div>
      <h2>Game Lobby: {gameState.gameCode}</h2>
      <ul>
        {gameState.players.map((player) => (
          <li key={player.id}>{player.name}</li>
        ))}
      </ul>
      {gameState.isHost && <button onClick={onStartGame}>Start Game</button>}
    </div>
  );
}
