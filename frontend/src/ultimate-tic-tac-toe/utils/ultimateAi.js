import { getAvailableMiniBoards, isValidMove } from "./gameRules";

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
