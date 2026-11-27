import useUltimateGameLogic from "../hooks/useUltimateGameLogic";
import UltimateGameBoard from "../components/UltimateGameBoard";
import UltimateGameStatus from "../components/UltimateGameStatus";

const UltimateGame = () => {
  const {
    board,
    currentPlayer,
    miniBoardWinners,
    nextMiniBoard,
    winner,
    isDraw,
    handleMove,
  } = useUltimateGameLogic();

  return (
    <div
      className="min-h-[calc(100dvh-60px)] w-full bg-gray-950 text-white flex-flex-col
  items-center justify-center gap-3 px-4 py-3"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 text-center">
        Ultimate Tic-Tac-Toe
      </h1>

      <UltimateGameStatus
        currentPlayer={currentPlayer}
        winner={winner}
        isDraw={isDraw}
      />
      <UltimateGameBoard
        board={board}
        miniBoardWinners={miniBoardWinners}
        nextMiniBoard={nextMiniBoard}
        onSquareClick={handleMove}
        isGameOver={Boolean(winner) || isDraw}
      />
    </div>
  );
};

export default UltimateGame;
