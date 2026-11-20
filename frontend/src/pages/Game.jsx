import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { saveGameResult } from "../utils/gameHistory";
import GameBoard from "../components/GameBoard";
import GameStatus from "../components/GameStatus";
import GameControls from "../components/GameControls";
import GameModeSelector from "../components/GameModeSelector";
import DifficultySelector from "../components/DifficultySelector";
import useGameLogic from "../hooks/useGameLogic";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const Game = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const hasSavedGame = useRef(false);
  const [gameId, setGameId] = useState(null);
  const isCreatingGame = useRef(false);
  const isSavingGame = useRef(false);
  const [saveAttempt, setSaveAttempt] = useState(0);
  const [saveError, setSaveError] = useState(false);
  const [createError, setCreateError] = useState(false);
  const [createAttempt, setCreateAttempt] = useState(0);
  const { user, loading } = useAuth();

  const restartGame = async () => {
    if (isCreatingGame.current || isSavingGame.current) return false;

    // Delete the unfinished game from MongoDB
    if (user && gameId && !hasSavedGame.current) {
      try {
        await api.delete(`/games/${gameId}`);
      } catch (error) {
        console.error("Failed to delete unfinished game:", error);
        return false;
      }
    }

    setCreateError(false);
    setSaveError(false);
    setCreateAttempt((prev) => prev + 1);
    hasSavedGame.current = false;
    setGameId(null);
    handleRestart();

    return true;
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
    moves,
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
    if (loading || !user || !gameMode) return;
    if (gameMode === "ai" && !aiDifficulty) return;
    if (moves.length === 0) return;

    if (gameId || isCreatingGame.current) return;

    const createGame = async () => {
      isCreatingGame.current = true;

      try {
        const response = await api.post("/games", {
          gameMode,
          aiDifficulty: gameMode === "ai" ? aiDifficulty : null,
        });

        setGameId(response.data.game._id);
        setCreateError(false);
      } catch (error) {
        console.error("Failed to create game", error);
        setCreateError(true);
      } finally {
        isCreatingGame.current = false;
      }
    };

    createGame();
  }, [
    loading,
    user,
    gameMode,
    aiDifficulty,
    gameId,
    createAttempt,
    moves.length,
  ]);

  useEffect(() => {
    if (!winner && !isDraw) return;
    if (user && !gameId) return;
    if (loading) return;
    if (!gameMode) return;

    if (hasSavedGame.current) return;

    const game = {
      id: crypto.randomUUID(),
      gameMode,
      aiDifficulty,
      winner,
      isDraw,
      date: new Date().toISOString(),
    };
    if (!user) {
      hasSavedGame.current = true;
      saveGameResult(game);
    } else {
      if (isSavingGame.current) return;
      isSavingGame.current = true;
      api
        .patch(`/games/${gameId}`, {
          board,
          moves,
          status: winner ? "won" : "draw",
          winner,
          currentPlayer,
        })
        .then(() => {
          hasSavedGame.current = true;
          setSaveError(false);
        })
        .catch((error) => {
          console.error("Failed to save game", error);
          setSaveError(true);
        })
        .finally(() => {
          isSavingGame.current = false;
        });
    }
  }, [
    saveAttempt,
    winner,
    isDraw,
    gameMode,
    aiDifficulty,
    user,
    loading,
    gameId,
    board,
    moves,
    currentPlayer,
  ]);

  if (gameMode === null) {
    return (
      <GameModeSelector
        onSelectOnline={() => navigate("/online")}
        onSelectMode={async (mode) => {
          const success = await restartGame();
          if (!success) return;
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
        onSelectDifficulty={async (difficulty) => {
          const success = await restartGame();
          if (!success) return;
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
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-4">
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
            restartGame().then((success) => {
              if (success) {
                navigate(gameMode === "ai" ? -2 : -1);
              }
            });
          }}
          gameMode={gameMode}
          onChangeDifficulty={async () => {
            const success = await restartGame();
            if (!success) return;
            navigate("/game", {
              state: {
                screen: "difficulty",
                gameMode: "ai",
              },
            });
          }}
        />
      </div>
      {createError && user && (
        <button
          onClick={() => {
            setCreateError(false);
            setCreateAttempt((prev) => prev + 1);
          }}
          className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg"
        >
          Retry Creating Game
        </button>
      )}

      {saveError && user && (
        <button
          onClick={() => {
            setSaveError(false);
            setSaveAttempt((prev) => prev + 1);
          }}
          className="px-5 py-3 bg-red-700 hover:bg-red-800 text-white font-bold rounded-lg"
        >
          Retry Saving Game
        </button>
      )}
    </div>
  );
};

export default Game;
