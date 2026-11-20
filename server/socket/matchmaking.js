import { randomUUID } from "crypto";

const waitingPlayers = [];

export const handleMatchMaking = (io, socket) => {
  if (
    waitingPlayers.some(
      (player) => player.userId === socket.user._id.toString(),
    )
  ) {
    return;
  }

  const player = {
    userId: socket.user._id.toString(),
    socketId: socket.id,
  };

  if (waitingPlayers.length === 0) {
    waitingPlayers.push(player);
    socket.emit("Waiting-for-opponent");
    return;
  }

  const opponent = waitingPlayers.shift();

  const roomId = randomUUID();

  const opponentSocket = io.sockets.sockets.get(opponent.socketId);

  if (!opponentSocket) {
    waitingPlayers.unshift(player);
    socket.emit("Waiting-for-opponent");
    return;
  }

  opponentSocket.join(roomId);
  socket.join(roomId);

  io.to(roomId).emit("match-found", {
    roomId,
    players: [opponent.userId, player.userId],
  });
};

export const removeWaitingPlayer = (socket) => {
  const index = waitingPlayers.findIndex(
    (player) => player.socketId === socket.id,
  );

  if (index !== -1) {
    waitingPlayers.splice(index, 1);
  }
};
