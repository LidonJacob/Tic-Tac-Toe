import { activeGames, reconnectTimers } from "./matchmaking.js";
import Game from "../models/Game.js";

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const checkWinner = (board) => {
  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getWinningCombination = (board) => {
  for (const combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return combination;
    }
  }
  return null;
};

export const handleMakeMove = async (io, socket, moveData) => {
  if (!moveData || typeof moveData !== "object" || Array.isArray(moveData))
    return;
  const { roomId, index } = moveData;
  if (typeof roomId !== "string" || !roomId.trim()) return;

  const game = activeGames.get(roomId);

  if (!game) return;

  const player = game.players.find(
    (player) => player.userId === socket.user._id.toString(),
  );

  if (!player) return;

  if (player.symbol !== game.currentPlayer) return;

  if (game.status !== "active") return;

  if (!Number.isInteger(index) || index < 0 || index > 8) return;

  if (game.board[index] !== "") return;

  game.board[index] = player.symbol;

  if (!game.moves) {
    game.moves = [];
  }

  game.moves.push({
    player: player.symbol,
    position: index,
  });

  const winner = checkWinner(game.board);

  if (winner) {
    game.status = "finished";
    game.winner = winner;
    game.winningCombination = getWinningCombination(game.board);
  }

  if (!winner && game.board.every((square) => square !== "")) {
    game.status = "finished";
    game.winner = null;
    game.isDraw = true;
  }

  if (game.status === "finished") {
    try {
      await Game.create({
        players: game.players.map((player) => ({
          user: player.userId,
          symbol: player.symbol,
        })),
        board: game.board,
        moves: game.moves,
        status: game.isDraw ? "draw" : "won",
        winner: game.winner,
        currentPlayer: game.currentPlayer,
        gameMode: "online",
      });
    } catch (error) {
      console.error("Failed to save online game:", error);
    }
  }

  if (game.status === "active") {
    game.currentPlayer = game.currentPlayer === "X" ? "O" : "X";
  }

  io.to(roomId).emit("game-updated", {
    board: game.board,
    currentPlayer: game.currentPlayer,
    status: game.status,
    winner: game.winner,
    isDraw: game.isDraw,
    winningCombination: game.winningCombination,
  });
};

export const handleRematchRequest = (io, socket, roomId) => {
  if (typeof roomId !== "string" || !roomId.trim()) return;
  const game = activeGames.get(roomId);

  if (!game) return;

  const player = game.players.find(
    (player) => player.userId === socket.user._id.toString(),
  );

  if (!player) return;

  if (game.status !== "finished") return;

  if (!game.rematchRequests.includes(player.userId)) {
    game.rematchRequests.push(player.userId);
  }

  if (game.rematchRequests.length < 2) {
    socket.emit("waiting-for-rematch");
    socket.to(roomId).emit("rematch-requested");
    return;
  }

  game.board = Array(9).fill("");
  game.currentPlayer = "X";
  game.status = "active";
  game.winner = null;
  game.isDraw = false;
  game.winningCombination = null;

  game.players.forEach((player) => {
    player.symbol = player.symbol === "X" ? "O" : "X";
  });

  game.rematchRequests = [];

  io.to(roomId).emit("rematch-started", {
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

export const handlePlayerDisconnect = (io, socket) => {
  for (const [roomId, game] of activeGames) {
    const player = game.players.find((player) => player.socketId === socket.id);

    if (!player) continue;

    player.isConnected = false;

    if (game.rematchRequests.length > 0) {
      game.rematchRequests = [];
      io.to(roomId).emit("rematch-cancelled");
    }

    const existingTimer = reconnectTimers.get(roomId);

    if (existingTimer) {
      clearTimeout(existingTimer);
    }

    const timer = setTimeout(() => {
      io.to(roomId).emit("opponent-failed-to-reconnect", {
        userId: player.userId,
      });

      activeGames.delete(roomId);
      reconnectTimers.delete(roomId);
    }, 30000);

    reconnectTimers.set(roomId, timer);

    io.to(roomId).emit("opponent-disconnected", {
      userId: player.userId,
    });

    break;
  }
};
