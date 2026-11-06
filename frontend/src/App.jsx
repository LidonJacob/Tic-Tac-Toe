import GameBoard from "./components/GameBoard";
import GameStatus from "./components/GameStatus";
import GameControls from "./components/GameControls";
import GameModeSelector from "./components/GameModeSelector";
import DifficultySelector from "./components/DifficultySelector";
import { useState } from "react";

function App() {
  const [board, setBoard] = useState(["", "", "", "", "", "", "", "", ""]);
  const [currentPlayer, setCurrentPlayer] = useState("X");
  const [winner, setWinner] = useState(null);
  const [isDraw, setIsDraw] = useState(false);
  const [gameMode, setGameMode] = useState(null);
  const [aiDifficulty, setAIDifficulty] = useState(null);
  //conditional rendering
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

  const handleRestart = () => {
    setBoard(["", "", "", "", "", "", "", "", ""]);
    setCurrentPlayer("X");
    setWinner(null);
    setIsDraw(false);
  };
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

  if (gameMode === null) {
    return <GameModeSelector onSelectMode={setGameMode} />;
  }

  if (gameMode === "ai" && aiDifficulty === null) {
    return (
      <DifficultySelector
        onSelectDifficulty={setAIDifficulty}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-cyan-400">Tic-Tac-Toe</h1>
      <p className=" text-lg text-gray-300">
        {" "}
        {gameMode === "player" ? "Player vs Player" : "Player vs AI"}
      </p>
      <GameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        isDraw={isDraw}
      />
      <div>
        <GameBoard board={board} onSquareClick={handleClick} />
      </div>

      <div className="flex gap-5">
        <GameControls
          onRestart={handleRestart}
          onChangeMode={() => setGameMode(null)}
        />
      </div>
    </div>
  );
}

export default App;
