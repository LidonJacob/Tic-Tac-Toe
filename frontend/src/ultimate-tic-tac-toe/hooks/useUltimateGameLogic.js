import { useState } from "react";
import { INITIAL_BOARD } from "../utils/gameConstants";
import {
  getMiniBoardWinner,
  getOverallWinner,
  getNextMiniBoard,
  getAvailableMiniBoards,
  isValidMove,
} from "../utils/gameRules";

const useUltimateGameLogic = () => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [miniBoardWinners, setMiniBoardWinners] = useState(Array(9).fill(null));
  const [nextMiniBoard, setNextMiniBoard] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const handleMove = (miniBoardIndex, squareIndex) => {
    if (winner || isDraw) return;

    if (nextMiniBoard !== null && miniBoardIndex !== nextMiniBoard) return;

    if (!isValidMove(board, miniBoardIndex, squareIndex)) return;

    const newBoard = board.map((miniBoard) => [...miniBoard]);

    newBoard[miniBoardIndex][squareIndex] = currentPlayer;

    setBoard(newBoard);

    const miniBoardWinner = getMiniBoardWinner(newBoard[miniBoardIndex]);

    const newMiniBoardWinners = [...miniBoardWinners];

    if (miniBoardWinner) {
      newMiniBoardWinners[miniBoardIndex] = miniBoardWinner;
      setMiniBoardWinners(newMiniBoardWinners);
    }

    const overallWinner = getOverallWinner(newMiniBoardWinners);

    if (overallWinner) {
      setWinner(overallWinner);
    }

    const isGameDraw =
      !overallWinner && getAvailableMiniBoards(newBoard).length === 0;

    if (isGameDraw) {
      setIsDraw(true);
    }

    if (overallWinner || isGameDraw) return;

    const nextBoard = getNextMiniBoard(newBoard, squareIndex);

    setNextMiniBoard(nextBoard);

    setCurrentPlayer((prevPlayer) => (prevPlayer === "X" ? "O" : "X"));
  };

  return {
    board,
    currentPlayer,
    miniBoardWinners,
    nextMiniBoard,
    winner,
    isDraw,
    handleMove,
  };
};

export default useUltimateGameLogic;