import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import History from "./pages/History";
import NotFound from "./pages/NotFound";

function App() {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Tic-Tac-Toe
      </h1>
      <p className=" text-lg text-gray-300">
        {" "}
        {gameMode === "player" ? "Player vs Player" : "Player vs AI"}
      </p>
      <GameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        isDraw={isDraw}
        gameMode={gameMode}
      />
      <div>
        <GameBoard
          board={board}
          onSquareClick={handleClick}
          winningCombination={winningCombination}
        />
      </div>

      <div className="flex gap-5">
        <GameControls
          onRestart={handleRestart}
          onChangeMode={handleChangeMode}
        />
      </div>
    </div>
  );
}

export default App;
