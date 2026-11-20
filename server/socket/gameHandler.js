import { activeGames } from "./matchmaking.js";

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

export const handleMakeMove = (io, socket, { roomId, index }) => {
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

  const winner = checkWinner(game.board);

  if (winner) {
    game.status = "finished";
    game.winner = winner;
  }

  if (!winner && game.board.every((square) => square !== "")) {
    game.status = "finished";
    game.winner = null;
    game.isDraw = true;
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
  });
};
