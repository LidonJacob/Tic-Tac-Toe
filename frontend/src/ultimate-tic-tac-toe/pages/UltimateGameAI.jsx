import {useLocation} from "react-router-dom";
import useUltimateGameLogic from "../hooks/useUltimateGameLogic";
import UltimateGameBoard from "../components/UltimateGameBoard";
import UltimateGameStatus from "../components/UltimateGameStatus";
import UltimateGameControls from "../components/UltimateGameControls";

const UltimateGameAI = () => {
    const location = useLocation();
    const difficulty = location.state?.difficulty || "easy";

    const {
        board,
        currentPlayer,
        miniBoardWinners,
        nextMiniBoard,
        winner,
        isDraw,
        handleMove,
        restartGame,
      } = useUltimateGameLogic("ai", difficulty);


  return (
    <div className="min-h-[calc(100dvh-60px)] w-full bg-gray-950 text-white flex-flex-col
  items-center justify-center gap-3 px-4 py-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400 text-center">Ultimate Tic-Tac-Toe vs AI</h1>
    </div>
  )
}

export default UltimateGameAI