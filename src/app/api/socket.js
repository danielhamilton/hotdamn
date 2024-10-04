// File: /src/app/api/socket.js

import { Server } from "socket.io";

const SocketHandler = (req, res) => {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("joinGame", ({ gameCode, playerName }) => {
        // Logic for joining a game
        console.log(`${playerName} joined game ${gameCode}`);
        socket.join(gameCode);
        io.to(gameCode).emit("playerJoined", { playerName });
      });

      socket.on("createGame", ({ playerName }) => {
        // Logic for creating a new game
        const gameCode = Math.random().toString(36).substring(7);
        console.log(`${playerName} created game ${gameCode}`);
        socket.join(gameCode);
        socket.emit("gameCreated", { gameCode });
      });

      socket.on("startGame", ({ gameCode }) => {
        // Logic for starting the game
        console.log(`Game ${gameCode} started`);
        io.to(gameCode).emit("gameStarted");
      });
    });
  }
  res.end();
};

export default SocketHandler;
