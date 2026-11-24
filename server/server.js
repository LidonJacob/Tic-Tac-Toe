import "dotenv/config";
import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import connectDB from "./config/db.js";
import { socketAuth } from "./socket/socketAuth.js";
import {
  handleMatchMaking,
  removeWaitingPlayer,
  handlePlayerReconnect,
} from "./socket/matchmaking.js";
import {
  handleMakeMove,
  handleRematchRequest,
  handlePlayerDisconnect,
} from "./socket/gameHandler.js";

const PORT = process.env.PORT || 5000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});
io.use(socketAuth);

io.on("connection", (socket) => {
  console.log("a user connected", socket.id);
  handlePlayerReconnect(io, socket);

  socket.on("find-match", () => {
    handleMatchMaking(io, socket);
  });

  socket.on("disconnect", () => {
    removeWaitingPlayer(socket);
    handlePlayerDisconnect(io, socket);
  });

  socket.on("make-move", (moveData) => {
    handleMakeMove(io, socket, moveData);
  });

  socket.on("request-rematch", (data) => {
    handleRematchRequest(io, socket, data.roomId);
  });
});

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
