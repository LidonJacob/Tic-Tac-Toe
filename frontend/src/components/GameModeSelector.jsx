const GameModeSelector = ({ onSelectMode, onSelectOnline }) => {
  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 flex flex-col items-center justify-center gap-8 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Tic-Tac-Toe
      </h1>

      <p className="text-gray-400 text-lg text-center">Select Game Mode</p>

      <div
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 w-full max-w-4xl"
      >
        <button
          onClick={() => onSelectMode("player")}
          className="px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
        text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
        >
          {" "}
          Local Multiplayer{" "}
        </button>
        <button
          onClick={() => onSelectMode("ai")}
          className="px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
        text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
        >
          Player vs AI
        </button>
        <button
          onClick={() => onSelectOnline()}
          className="px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400
        text-lg font-semibold shadow-lg transition-all duration-200 hover:scale-105"
        >
          Online PvP
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;
