import { randomUUID } from "crypto";

const waitingUltimatePlayers = [];

export const activeUltimateGames = new Map();

const createInitialUltimateBoard = () =>
  Array.from({ length: 9 }, () => Array(9).fill(""));

const createInitialMiniBoardWinners = () => Array(9).fill(null);

export const handleUltimateMatchMaking = (io, socket) => {
  const userId = socket.user?._id?.toString();

  if (!userId) return;

  const alreadyWaiting = waitingUltimatePlayers.some(
    (player) => player.userId === userId,
  );

  if (alreadyWaiting) return;

  while (waitingUltimatePlayers.length > 0) {
    const opponent = waitingUltimatePlayers.shift();

    if (opponent.userId === userId) continue;

    const opponentSocket = io.sockets.sockets.get(opponent.socketId);

    if (!opponentSocket?.connected) continue;

    const roomId = randomUUID();
    const firstPlayerStarts = Math.random() < 0.5;

    const players = [
      {
        userId: opponent.userId,
        socketId: opponent.socketId,
        symbol: firstPlayerStarts ? "X" : "O",
      },
      {
        userId,
        socketId: socket.id,
        symbol: firstPlayerStarts ? "O" : "X",
      },
    ];

    opponentSocket.join(roomId);
    socket.join(roomId);

    io.to(roomId).emit("ultimate-match-found", {
      roomId,
      players: players.map(({ userId, symbol }) => ({ userId, symbol })),
    });

    return;
  }

  waitingUltimatePlayers.push({
    userId,
    socketId: socket.id,
  });

  socket.emit("ultimate-waiting-for-opponent");
};
