import Square from "./components/Square";
import { useState } from "react";

function App() {
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

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-cyan-400">Tic-Tac-Toe</h1>
      {winner ? (
        <p className="text-2xl font-bold text-green-400">
          Player {winner} wins{" "}
        </p>
      ) : isDraw ? (
        <p className="text-2xl font-bold text-white"> It is a Draw</p>
      ) : (
        <p className="text-lg text-gray-300">Player {currentPlayer}'s turn</p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => {
          return (
            <Square
              key={index}
              value={value}
              onClick={() => handleClick(index)}
            />
          );
        })}
      </div>
      <button onClick={handleRestart} className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg">Restart Game </button>
    </div>
  );
}

export default App;
