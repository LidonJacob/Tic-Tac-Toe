import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveGameResult } from "../utils/gameHistory";

import GameBoard from "../components/GameBoard";
import GameStatus from "../components/GameStatus";
import GameControls from "../components/GameControls";
import GameModeSelector from "../components/GameModeSelector";
import DifficultySelector from "../components/DifficultySelector";

import useGameLogic from "../hooks/useGameLogic";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSavedGame = useRef(false);

  const restartGame = () => {
    hasSavedGame.current = false;
    handleRestart();
  };

  const gameMode = location.state?.gameMode ?? null;
  const aiDifficulty = location.state?.aiDifficulty ?? null;
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
    if (!winner && !isDraw) return;
    if (!gameMode) return;

    if (hasSavedGame.current) return;
    hasSavedGame.current = true;
    const game = {
      id: crypto.randomUUID(),
      gameMode,
      aiDifficulty,
      winner,
      isDraw,
      date: new Date().toISOString(),
    };
    saveGameResult(game);
  }, [winner, isDraw, gameMode, aiDifficulty]);

  if (gameMode === null) {
    return (
      <GameModeSelector
        onSelectMode={(mode) => {
          restartGame();
          navigate("/game", {
            state: {
              screen: mode === "ai" ? "difficulty" : "board",
              gameMode: mode,
            },
          });
        }}
      />
    );
  }
  if (gameMode === "ai" && aiDifficulty === null) {
    return (
      <DifficultySelector
        onSelectDifficulty={(difficulty) => {
          restartGame();
          navigate("/game", {
            state: {
              screen: "board",
              gameMode: "ai",
              aiDifficulty: difficulty,
            },
          });
        }}
      />
    );
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
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

      <div className="w-full flex justify-center">
        <GameBoard
          board={board}
          onSquareClick={handleClick}
          winningCombination={winningCombination}
        />
      </div>

      <div className="flex gap-5">
        <GameControls
          onRestart={restartGame}
          onChangeMode={() => {
            handleRestart();
            navigate(gameMode === "ai" ? -2 : -1);
          }}
        />
      </div>
    </div>
  );
};

export default Game;
