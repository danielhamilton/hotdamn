// pages/api/game.js
import { Server } from "socket.io";

export default function handler(req, res) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      socket.on("joinGame", ({ gameCode, playerName }) => {
        console.log(`${playerName} joined game ${gameCode}`);
        socket.join(gameCode);
        io.to(gameCode).emit("playerJoined", { playerName });
      });

      socket.on("createGame", ({ playerName }) => {
        const gameCode = Math.random().toString(36).substring(7);
        console.log(`${playerName} created game ${gameCode}`);
        socket.join(gameCode);
        socket.emit("gameCreated", { gameCode });
      });

      socket.on("startGame", ({ gameCode }) => {
        console.log(`Starting game ${gameCode}`);
        io.to(gameCode).emit("gameStarted");
      });

      // Add other event handlers...
    });
  }
  res.end();
}
