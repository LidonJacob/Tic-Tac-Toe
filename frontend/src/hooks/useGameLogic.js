import { useState, useCallback } from "react";

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
  for (let combination of winningCombinations) {
    const [a, b, c] = combination;

    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }
  return null;
};

const getAvailableMoves = (board) => {
  return board
    .map((square, index) => (square === "" ? index : null))
    .filter((index) => index !== null);
};

const getRandomMove = (board) => {
  const availableMoves = getAvailableMoves(board);

  if (availableMoves.length === 0) {
    return null;
  }

  const randomIndex = Math.floor(Math.random() * availableMoves.length);
  return availableMoves[randomIndex];
};

const getWinningMove = (board, player) => {
  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      const testBoard = [...board];
      testBoard[i] = player;

      const result = checkWinner(testBoard);

      if (result === player) {
        return i;
      }
    }
  }

  return null;
};

const useGameLogic = (aiDifficulty) => {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);

  const handleClick = (index) => {
    if (winner || isDraw) {
      return;
    }

    if (board[index] !== "") {
      return;
    }
    const newBoard = [...board];

    newBoard[index] = currentPlayer;
    setBoard(newBoard);
    const result = checkWinner(newBoard);

    if (result) {
      setWinner(result);
      return;
    }
    if (newBoard.every((square) => square !== "")) {
      setIsDraw(true);
      return;
    }

    setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
  };

  const handleAiMove = useCallback(() => {
    if (winner || isDraw) {
      return;
    }
    let aiMove;

    if (aiDifficulty === "easy") {
      aiMove = getRandomMove(board);
    } else {
      const winningMove = getWinningMove(board, "O");
      const blockingMove = getWinningMove(board, "X");
      aiMove =
        winningMove !== null
          ? winningMove
          : blockingMove !== null
            ? blockingMove
            : getRandomMove(board);
    }

    if (aiMove === null) {
      return;
    }

    const newBoard = [...board];
    newBoard[aiMove] = "O";
    const result = checkWinner(newBoard);

    if (result) {
      setWinner(result);
      setBoard(newBoard);
      return;
    }
    if (newBoard.every((square) => square !== "")) {
      setIsDraw(true);
      setBoard(newBoard);
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer("X");
  }, [board, winner, isDraw, aiDifficulty]);

  const handleRestart = () => {
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };

  return {
    board,
    currentPlayer,
    winner,
    isDraw,
    handleClick,
    handleRestart,
    handleAiMove,
  };
};

export default useGameLogic;
