const GameControls = ({ onRestart, onChangeMode }) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 sm:gap-5">
      <button
        onClick={onRestart}
        className="mt-6 px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-cyan-800 text-white font-bold rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        Restart Game
      </button>

      <button
        onClick={onChangeMode}
        className="mt-6 px-4 py-3 sm:px-6 bg-cyan-700 hover:bg-red-700 text-white font-bold rounded-lg
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {" "}
        Change Mode{" "}
      </button>
    </div>
  );
};

export default GameControls;
