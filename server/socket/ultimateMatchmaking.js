import { randomUUID } from "crypto";

const waitingUltimatePlayers = [];

export const activeUltimateGames = new Map();

const createInitialUltimateBoard = () =>
  Array.from({ length: 9 }, () => Array(9).fill(""));

const createInitialMiniBoardWinners = () => Array(9).fill(null);

const INITIAL_GAME_STATUS = "active";

const INITIAL_WINNER = null;

const INITIAL_IS_DRAW = false;

const createInitialUltimateGame = (roomId, players) => ({
  roomId,
  board: createInitialUltimateBoard(),
  miniBoardWinners: createInitialMiniBoardWinners(),
  nextMiniBoard: null,
  currentPlayer: "X",
  status: INITIAL_GAME_STATUS,
  winner: INITIAL_WINNER,
  isDraw: INITIAL_IS_DRAW,
  players,
});

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

    const game = createInitialUltimateGame(roomId, players);

    activeUltimateGames.set(roomId, game);

    opponentSocket.join(roomId);
    socket.join(roomId);

    io.to(roomId).emit("ultimate-match-found", {
      roomId,
      players: players.map(({ userId, symbol }) => ({ userId, symbol })),
      gameState: {
        board: game.board,
        miniBoardWinners: game.miniBoardWinners,
        nextMiniBoard: game.nextMiniBoard,
        currentPlayer: game.currentPlayer,
        status: game.status,
        winner: game.winner,
        isDraw: game.isDraw,
      }
    });

    return;
  }

  waitingUltimatePlayers.push({
    userId,
    socketId: socket.id,
  });

  socket.emit("ultimate-waiting-for-opponent");
};
