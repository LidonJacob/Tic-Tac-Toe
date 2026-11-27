import { useState, useEffect, useCallback } from "react";
import { INITIAL_BOARD } from "../utils/gameConstants";
import {
  getMiniBoardWinner,
  getOverallWinner,
  getNextMiniBoard,
  getAvailableMiniBoards,
  isValidMove,
} from "../utils/gameRules";
import { getLegalMoves, getEasyMove } from "../utils/ultimateAi";

const useUltimateGameLogic = (gameMode = "local", difficulty = "easy") => {
  const [board, setBoard] = useState(INITIAL_BOARD);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [miniBoardWinners, setMiniBoardWinners] = useState(Array(9).fill(null));
  const [nextMiniBoard, setNextMiniBoard] = useState(null);
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const handleMove = useCallback(
    (miniBoardIndex, squareIndex) => {
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
    },
    [winner, isDraw, nextMiniBoard, board, miniBoardWinners, currentPlayer],
  );

  useEffect(() => {
    if (gameMode !== "ai") return;
    if (currentPlayer !== "O") return;
    if (winner || isDraw) return;

    const legalMoves = getLegalMoves(board, nextMiniBoard);
    const selectedMove = getEasyMove(legalMoves);
    if (!selectedMove) return;

    const timer = setTimeout(() => {
      handleMove(selectedMove.miniBoardIndex, selectedMove.squareIndex);
    }, 600);

    return () => clearTimeout(timer);
  }, [
    gameMode,
    currentPlayer,
    winner,
    isDraw,
    board,
    nextMiniBoard,
    handleMove,
  ]);

  const restartGame = () => {
    setBoard(
      Array(9)
        .fill(null)
        .map(() => Array(9).fill("")),
    );
    setCurrentPlayer("X");
    setMiniBoardWinners(Array(9).fill(null));
    setNextMiniBoard(null);
    setWinner(null);
    setIsDraw(false);
  };

  return {
    gameMode,
    difficulty,
    board,
    currentPlayer,
    miniBoardWinners,
    nextMiniBoard,
    winner,
    isDraw,
    handleMove,
    restartGame,
  };
};

export default useUltimateGameLogic;
