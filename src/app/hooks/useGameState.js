// File: src/app/hooks/useGameState.js

import { useState, useEffect } from "react";
import io from "socket.io-client";

const useGameState = () => {
  const [socket, setSocket] = useState(null);
  const [gameState, setGameState] = useState({
    stage: "lobby",
    gameCode: null,
    players: [],
    currentRound: 0,
    isHost: false,
    currentPrompt: "",
  });

  useEffect(() => {
    const initSocket = async () => {
      await fetch("/api/socket");
      const newSocket = io({
        path: "/api/socket",
      });

      newSocket.on("connect", () => {
        console.log("Connected to server");
      });

      newSocket.on("gameState", (newState) => {
        console.log("Received new game state:", newState);
        setGameState(newState);
      });

      newSocket.on("error", (error) => {
        console.error("Socket error:", error);
      });

      setSocket(newSocket);
    };

    initSocket();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const createGame = (playerName) => {
    socket?.emit("createGame", { playerName });
  };

  const joinGame = (gameCode, playerName) => {
    socket?.emit("joinGame", { gameCode, playerName });
  };

  const startGame = () => {
    socket?.emit("startGame");
  };

  const submitEntry = (entry) => {
    socket?.emit("submitEntry", { entry });
  };

  return { gameState, createGame, joinGame, startGame, submitEntry };
};

export default useGameState;
