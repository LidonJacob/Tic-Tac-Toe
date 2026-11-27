import {
  getAvailableMiniBoards,
  isValidMove,
  getMiniBoardWinner,
  getNextMiniBoard,
} from "./gameRules";

import { WINNING_COMBINATIONS } from "./gameConstants";

export const getLegalMoves = (board, nextMiniBoard) => {
  const availableBoards =
    nextMiniBoard !== null ? [nextMiniBoard] : getAvailableMiniBoards(board);

  const legalMoves = [];

  availableBoards.forEach((miniBoardIndex) => {
    board[miniBoardIndex].forEach((_, squareIndex) => {
      if (isValidMove(board, miniBoardIndex, squareIndex)) {
        legalMoves.push({ miniBoardIndex, squareIndex });
      }
    });
  });

  return legalMoves;
};

export const getEasyMove = (legalMoves) => {
  if (legalMoves.length === 0) return null;
  const randomIndex = Math.floor(Math.random() * legalMoves.length);

  return legalMoves[randomIndex];
};

export const getWinningMove = (board, legalMoves, player) => {
  return (
    legalMoves.find(({ miniBoardIndex, squareIndex }) => {
      const updatedMiniBoard = [...board[miniBoardIndex]];
      updatedMiniBoard[squareIndex] = player;
      return getMiniBoardWinner(updatedMiniBoard) === player;
    }) || null
  );
};

export const getMediumMove = (board, legalMoves) => {
  const winningMove = getWinningMove(board, legalMoves, "O");

  if (winningMove) return winningMove;

  const blockingMove = getWinningMove(board, legalMoves, "X");

  if (blockingMove) return blockingMove;

  return getEasyMove(legalMoves);
};

export const evaluateBoard = (board, player) => {
  const miniBoardWinners = board.map(getMiniBoardWinner);

  const opponent = player === "O" ? "X" : "O";

  let score = 0;

  WINNING_COMBINATIONS.forEach((combination) => {
    const line = combination.map((index) => miniBoardWinners[index]);

    if (line.includes(opponent)) return;

    const playerBoards = line.filter((winner) => winner === player).length;

    score += [0, 10, 100, 1000][playerBoards];
  });

  return score;
};

export const evaluatePosition = (board, player) => {
  const opponent = player === "O" ? "X" : "O";

  return evaluateBoard(board, player) - evaluateBoard(board, opponent);
};

const simulateMove = (board, move, player) => {
  const updatedBoard = board.map((miniBoard) => [...miniBoard]);

  updatedBoard[move.miniBoardIndex][move.squareIndex] = player;

  return updatedBoard;
};

const miniMax = (board, nextMiniBoard,depth, isMaximizing) => {
  const overallWinner = getMiniBoardWinner(board.map(getMiniBoardWinner));

  if (overallWinner === "O") return 10000 + depth;

  if (overallWinner === "X") return -10000 - depth;

  if (depth === 0) return evaluatePosition(board, "O");

  const legalMoves = getLegalMoves(board, nextMiniBoard);

  if (legalMoves.length === 0) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
  }

    for (const move of legalMoves) {
      const updatedBoard = simulateMove(board, move, "O");
      
      const nextBoard = getNextMiniBoard(updatedBoard, move.squareIndex);

      const score = miniMax(updatedBoard, nextBoard, depth - 1, false);

      bestScore = Math.max(score, bestScore);
    }

    return bestScore;
  }


};
