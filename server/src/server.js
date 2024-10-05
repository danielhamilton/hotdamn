const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Your Next.js app URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("A user connected with ID:", socket.id);

  socket.on("testConnection", (data) => {
    console.log("Received test connection:", data);
    socket.emit("testResponse", "Hello Client");
  });

  socket.on("createGame", ({ playerName }) => {
    console.log(
      `Received createGame event from ${socket.id} for player: ${playerName}`,
    );
    const gameCode = Math.random().toString(36).substring(7).toUpperCase();
    console.log(`Created game with code: ${gameCode}`);
    socket.join(gameCode);
    io.to(gameCode).emit("gameCreated", { gameCode });
    console.log(`Emitted gameCreated event to room ${gameCode}`);
  });

  // ... other event handlers ...
});

app.post("/join-party", (req, res) => {
  const { partyCode } = req.body;
  // Handle join party logic
  res.json({ message: `Joined party ${partyCode} successfully` });
});

app.post("/start-party", (req, res) => {
  console.log("Received start-party request"); // Debug log
  // Handle start party logic
  const newPartyCode = Math.random().toString(36).substring(7); // Generate a random party code
  console.log("Generated party code:", newPartyCode); // Debug log
  res.json({ message: "Started party successfully", partyCode: newPartyCode });
});

const PORT = 3001; // Choose a port that doesn't conflict with your Next.js app
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
