const GameModeSelector = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-cyan-400">Tic-Tac-Toe</h1>

      <p className="text-gray-300">Select Game Mode</p>

      <button
        onClick={() => onSelectMode("player")}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg "
      >
        {" "}
        Player vs Player{" "}
      </button>
      <button
        onClick={() => onSelectMode("ai")}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg"
      >
        Player vs AI
      </button>
    </div>
  );
};

export default GameModeSelector;
