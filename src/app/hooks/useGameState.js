// File: /src/app/hooks/useGameState.js

import { useState, useEffect } from "react";
import io from "socket.io-client";

const useGameState = () => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    stage: "lobby",
    gameCode: null,
    players: [],
    currentRound: 0,
  });

  useEffect(() => {
    const initSocket = async () => {
      const newSocket = io({
        path: "/api/socket",
      });

      setSocket(newSocket);

      newSocket.on("connect", () => {
        console.log("Connected to server");
      });

      newSocket.on("playerJoined", ({ playerName }) => {
        console.log(`Player joined: ${playerName}`);
        setGameState((prev) => ({
          ...prev,
          players: [...prev.players, { name: playerName }],
        }));
      });

      newSocket.on("gameCreated", ({ gameCode }) => {
        console.log(`Game created: ${gameCode}`);
        setGameState((prev) => ({ ...prev, gameCode }));
      });

      newSocket.on("gameStarted", () => {
        console.log("Game started");
        setGameState((prev) => ({ ...prev, stage: "drawing" }));
      });

      newSocket.on("connect_error", (error) => {
        console.error("Connection error:", error);
      });

      return () => newSocket.close();
    };

    initSocket();
  }, []);

  const joinGame = (gameCode, playerName) => {
    console.log(`Joining game: ${gameCode} as ${playerName}`);
    socket?.emit("joinGame", { gameCode, playerName });
  };

  const createGame = (playerName) => {
    console.log(`Creating game as ${playerName}`);
    socket?.emit("createGame", { playerName });
  };

  const startGame = () => {
    console.log(`Starting game: ${gameState.gameCode}`);
    socket?.emit("startGame", { gameCode: gameState.gameCode });
  };

  return {
    gameState,
    joinGame,
    createGame,
    startGame,
  };
};

export default useGameState;
