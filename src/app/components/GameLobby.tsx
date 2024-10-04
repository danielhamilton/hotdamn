// File: /src/app/components/GameLobby.tsx

import React from "react";
import { motion } from "framer-motion";

const GameLobby = ({
  gameCode,
  players,
  onStartGame,
}: {
  gameCode: string;
  players: { name: string }[];
  onStartGame: () => void;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="rounded-lg bg-white p-4 shadow-md"
    >
      <h2 className="mb-4 text-2xl font-bold">Game Lobby</h2>
      <p className="mb-2">Game Code: {gameCode}</p>
      <ul className="mb-4">
        {players.map((player, index) => (
          <li key={index} className="mb-1">
            {player.name}
          </li>
        ))}
      </ul>
      <button
        onClick={onStartGame}
        className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
      >
        Start Game
      </button>
    </motion.div>
  );
};

export default GameLobby;
