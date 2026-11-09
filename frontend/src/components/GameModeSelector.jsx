const GameModeSelector = ({ onSelectMode }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Tic-Tac-Toe</h1>

      <p className="text-gray-300">Select Game Mode</p>

      <button
        onClick={() => onSelectMode("player")}
        className="px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {" "}
        Player vs Player{" "}
      </button>
      <button
        onClick={() => onSelectMode("ai")}
        className="px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        Player vs AI
      </button>
    </div>
  );
};

export default GameModeSelector;
