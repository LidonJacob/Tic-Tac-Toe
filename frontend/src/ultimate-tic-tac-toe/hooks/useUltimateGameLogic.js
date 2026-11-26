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
};
