import { activeUltimateGames } from "./ultimateMatchmaking.js";

const WINNING_COMBINATIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const getMiniBoardWinner = (miniBoard) => {
  for (const [a, b, c] of WINNING_COMBINATIONS) {
    if (
      miniBoard[a] &&
      miniBoard[a] === miniBoard[b] &&
      miniBoard[a] === miniBoard[c]
    ) {
      return miniBoard[a];
    }
  }
  return null;
};

const isMiniBoardFull = (miniBoard) => {
  return miniBoard.every((square) => square !== "");
};

const getOverallWinner = (miniBoardWinners) => {
  return getMiniBoardWinner(miniBoardWinners);
};

const getNextMiniBoard = (board, squareIndex) => {
  const nextMiniBoard = board[squareIndex];

  if (
    nextMiniBoard &&
    !getMiniBoardWinner(nextMiniBoard) &&
    !isMiniBoardFull(nextMiniBoard)
  ) {
    return squareIndex;
  }

  return null;
};

const getAvailableMiniBoards = (board) => {
  const availableBoards = [];

  for (let i = 0; i < board.length; i++) {
    if (!getMiniBoardWinner(board[i]) && !isMiniBoardFull(board[i])) {
      availableBoards.push(i);
    }
  }

  return availableBoards;
};

const areValidMovesCoordinates = (miniBoardIndex, squareIndex) => {
  return (
    Number.isInteger(miniBoardIndex) &&
    miniBoardIndex >= 0 &&
    miniBoardIndex < 9 &&
    Number.isInteger(squareIndex) &&
    squareIndex >= 0 &&
    squareIndex < 9
  );
};

const isMiniBoardPlayable = (board, miniBoardIndex) => {
  const nextMiniBoard = board[miniBoardIndex];

  return (
    nextMiniBoard && !getMiniBoardWinner(MiniBoard) && !isMiniBoardFull(MiniBoard)
  );
};

const isSquareEmpty = (board, miniBoardIndex, squareIndex) => {
  return board[miniBoardIndex][squareIndex] === "";
};

const isValidUltimateMove = (
  board,
  miniBoardIndex,
  squareIndex,
  nextMiniBoard,
) => {
  if (!areValidMovesCoordinates(miniBoardIndex, squareIndex)) {
    return false;
  }

  if (!isCorrectMiniBoardSelection(nextMiniBoard, miniBoardIndex)) {
    return false;
  }

  return isSquareEmpty(board, miniBoardIndex, squareIndex);
};

const isCorrectMiniBoardSelection = (nextMiniBoard, miniBoardIndex) => {
  return nextMiniBoard === null || nextMiniBoard === miniBoardIndex;
};

export const handleUltimateMove = (io, socket, moveData) => {
  if (!moveData || typeof moveData !== "object" || Array.isArray(moveData)) {
    return;
  }

  const { roomId } = moveData;

  if (typeof roomId !== "string" || !roomId.trim()) return;

  const game = activeUltimateGames.get(roomId);

  if (!game) return;

  const player = game.players.find((player) => player.socketId === socket.id);

  if (!player) return;

  if (game.status !== "active") return;

  const { miniBoardIndex, squareIndex } = moveData;

  if (
    !isValidUltimateMove(
      game.board,
      miniBoardIndex,
      squareIndex,
      game.nextMiniBoard,
    )
  ) {
    return;
  }

  if (player.symbol !== game.currentPlayer) return;

  game.board[miniBoardIndex][squareIndex] = player.symbol;

  const miniBoardWinner = getMiniBoardWinner(game.board[miniBoardIndex]);

  if (miniBoardWinner) {
    game.miniBoardWinners[miniBoardIndex] = miniBoardWinner;
  }

  const overallWinner = getOverallWinner(game.miniBoardWinners);

  if (overallWinner) {
    game.winner = overallWinner;
    game.status = "finished";
  }

  if (!overallWinner && getAvailableMiniBoards(game.board).length === 0) {
    game.status = "finished";
    game.isDraw = true;
  }

  if (game.status === "active") {
    game.nextMiniBoard = getNextMiniBoard(game.board, squareIndex);
    game.currentPlayer = player.symbol === "X" ? "O" : "X";
  }

  io.to(roomId).emit("ultimate-game-updated", {
    roomId,
    board: game.board,
    miniBoardWinners: game.miniBoardWinners,
    nextMiniBoard: game.nextMiniBoard,
    currentPlayer: game.currentPlayer,
    status: game.status,
    winner: game.winner,
    isDraw: game.isDraw,
  });
};
