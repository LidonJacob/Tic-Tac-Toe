import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

import GameBoard from "../components/GameBoard";
import GameStatus from "../components/GameStatus";
import GameControls from "../components/GameControls";
import GameModeSelector from "../components/GameModeSelector";
import DifficultySelector from "../components/DifficultySelector";

import useGameLogic from "../hooks/useGameLogic";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [gameMode, setGameMode] = useState(null);
  const [aiDifficulty, setAIDifficulty] = useState(null);

  const {
    board,
    currentPlayer,
    winner,
    isDraw,
    winningCombination,
    handleClick,
    handleRestart,
    handleAiMove,
  } = useGameLogic(aiDifficulty);

  useEffect(() => {
    if (gameMode === "ai" && currentPlayer === "O") {
      const timer = setTimeout(() => {
        handleAiMove();
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [gameMode, currentPlayer, handleAiMove]);

  useEffect(() => {
  if (!location.state?.screen) {
    setGameMode(null);
    setAIDifficulty(null);
  } else if (location.state.screen === "difficulty") {
    setAIDifficulty(null);
  }
}, [location.state]);

  if (gameMode === null) {
    return (
      <GameModeSelector
        onSelectMode={(mode) => {
          setGameMode(mode);
          navigate("/game", { state: { screen: mode === "ai" ? "difficulty" : "board" } });
        }}
      />
    );
  }
if (gameMode === "ai" && aiDifficulty === null) {
  return (
    <DifficultySelector
      onSelectDifficulty={(difficulty) => {
        setAIDifficulty(difficulty);
        navigate("/game", { state: { screen: "board" } });
      }}
    />
  );
}

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Tic-Tac-Toe
      </h1>

      <p className="text-lg text-gray-300">
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
          onChangeMode={() => setGameMode(null)}
        />
      </div>
    </div>
  );
};

export default Game;
