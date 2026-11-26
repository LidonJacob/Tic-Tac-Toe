import { WINNING_COMBINATIONS } from "./gameConstants";

export const isMiniBoardFull = (miniBoard) => {
  return miniBoard.every((square) => square !== "");
};

export const getMiniBoardWinner = (miniBoard) => {
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

export const isValidMove = (board, miniBoardIndex, squareIndex) => {
  const miniBoard = board[miniBoardIndex];

  return (
    miniBoard[squareIndex] === "" &&
    !getMiniBoardWinner(miniBoard) &&
    !isMiniBoardFull(miniBoard)
  );
};

export const getOverallWinner = (miniBoardWinners) => {
  return getMiniBoardWinner(miniBoardWinners);
};

export const getNextMiniBoard = (board, squareIndex) => {
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

export const getAvailableMiniBoards = (board) => {
  const availableBoards = [];

  for (let i = 0; i < board.length; i++) {
    if (!getMiniBoardWinner(board[i]) && !isMiniBoardFull(board[i])) {
      availableBoards.push(i);
    }
  }

  return availableBoards;
};


