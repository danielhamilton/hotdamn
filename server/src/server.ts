// File: src/app/api/socket/route.ts

import { Server as ServerIO } from "socket.io";
import { NextApiResponseServerIO } from "@/types/next";
import { NextRequest, NextResponse } from "next/server";

const games = new Map();

export async function GET(req: NextRequest, res: NextApiResponseServerIO) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new ServerIO(res.socket.server as any, {
      path: "/api/socket",
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("New client connected");

      socket.on("createGame", ({ playerName }) => {
        const gameCode = Math.random().toString(36).substring(7);
        const gameState = {
          stage: "lobby",
          gameCode,
          players: [{ id: socket.id, name: playerName }],
          currentRound: 0,
          isHost: true,
        };
        games.set(gameCode, gameState);
        socket.join(gameCode);
        io.to(gameCode).emit("gameState", gameState);
      });

      socket.on("joinGame", ({ gameCode, playerName }) => {
        const gameState = games.get(gameCode);
        if (gameState) {
          gameState.players.push({ id: socket.id, name: playerName });
          socket.join(gameCode);
          io.to(gameCode).emit("gameState", gameState);
        } else {
          socket.emit("error", "Game not found");
        }
      });

      socket.on("startGame", () => {
        const gameCode = Array.from(games.entries()).find(([, game]) =>
          game.players.some((player) => player.id === socket.id),
        )?.[0];

        if (gameCode) {
          const gameState = games.get(gameCode);
          gameState.stage = "phraseInput";
          io.to(gameCode).emit("gameState", gameState);
        }
      });

      socket.on("submitPhrase", ({ phrase }) => {
        const gameCode = Array.from(games.entries()).find(([, game]) =>
          game.players.some((player) => player.id === socket.id),
        )?.[0];

        if (gameCode) {
          const gameState = games.get(gameCode);
          // Add phrase to game state (you'll need to implement this logic)
          // For now, we'll just log it
          console.log(`Player submitted phrase: ${phrase}`);
          // You might want to check if all players have submitted phrases
          // and move to the next stage if they have
        }
      });

      socket.on("disconnect", () => {
        console.log("Client disconnected");
        // Handle player disconnection (remove from game, etc.)
      });
    });
  }

  return NextResponse.json(
    { message: "Socket server running" },
    { status: 200 },
  );
}
