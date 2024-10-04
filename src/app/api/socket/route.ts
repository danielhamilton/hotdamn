// File: /src/app/api/socket/route.ts

import { NextRequest, NextResponse } from "next/server";
import { Server as ServerIO } from "socket.io";

export async function GET(req: NextRequest) {
  if ((globalThis as any).io) {
    return NextResponse.json(
      { message: "Socket is already running." },
      { status: 200 },
    );
  }

  const io = new ServerIO((globalThis as any).io, {
    path: "/api/socket",
    addTrailingSlash: false,
  });

  (globalThis as any).io = io;

  io.on("connection", (socket) => {
    console.log("A client connected");

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
      console.log(`Game ${gameCode} started`);
      io.to(gameCode).emit("gameStarted");
    });

    socket.on("disconnect", () => {
      console.log("A client disconnected");
    });
  });

  return NextResponse.json({ message: "Socket is running." }, { status: 200 });
}
