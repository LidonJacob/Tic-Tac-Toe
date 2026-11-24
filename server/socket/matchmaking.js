import { randomUUID } from "crypto";

const waitingPlayers = [];

export const activeGames = new Map();

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
    socket.emit("waiting-for-opponent");
    return;
  }

  const opponent = waitingPlayers.shift();

  const roomId = randomUUID();

  const opponentSocket = io.sockets.sockets.get(opponent.socketId);

  if (!opponentSocket) {
    waitingPlayers.unshift(player);
    socket.emit("waiting-for-opponent");
    return;
  }

  opponentSocket.join(roomId);
  socket.join(roomId);

  activeGames.set(roomId, {
    board: Array(9).fill(""),
    currentPlayer: "X",
    players: [
      { ...opponent, symbol: "X", isConnected: true },
      { ...player, symbol: "O", isConnected: true },
    ],
    winner: null,
    isDraw: false,
    winningCombination: null,
    status: "active",
    rematchRequests: [],
  });

  const game = activeGames.get(roomId);

  io.to(roomId).emit("match-found", {
    roomId,
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    players: game.players.map(({ userId, symbol }) => ({
      userId,
      symbol,
    })),
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

export const handlePlayerReconnect = (io, socket) => {
  for (const [roomId, game] of activeGames) {
    const player = game.players.find(
      (player) =>
        player.userId === socket.user._id.toString() && !player.isConnected,
    );

    if (!player) continue;

    player.socketId = socket.id;
    player.isConnected = true;

    socket.join(roomId);

    socket.to(roomId).emit("opponent-reconnected");

    socket.emit("match-restored", {
      roomId,
      ...game,
    });

    break;
  }
};
