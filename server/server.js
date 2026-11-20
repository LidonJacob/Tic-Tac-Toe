import { createServer } from "node:http";
import { Server } from "socket.io";
import app from "./app.js";
import "dotenv/config";
import connectDB from "./config/db.js";
import { socketAuth } from "./socket/socketAuth.js";

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
});

connectDB().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
