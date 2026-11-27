import { useNavigate } from "react-router-dom";

const UltimateGameControls = ({ onRestart }) => {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center gap-3 lg:ml-6">
      <button
        onClick={onRestart}
        className="w-full px-5 py-2.5 rounded-lg bg-cyan-500 text-gray-950 font-semibold 
        hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-200"
      >
        Restart Game
      </button>
      <button
        onClick={() => navigate("/ultimate-game-home")}
        className="w-full px-5 py-2.5 rounded-lg bg-gray-800 border border-gray-700 
        text-gray-300 font-medium hover:bg-gray-700 hover:border-cyan-400 
        hover:text-cyan-400 transition-all duration-200"
      >
        Back to Menu
      </button>
    </div>
  );
};

export default UltimateGameControls;
