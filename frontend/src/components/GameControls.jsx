const GameControls = ({ onRestart, onChangeMode }) => {
  return (
    <div className="flex gap-5">
      <button
        onClick={onRestart}
        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-lg"
      >
        Restart Game
      </button>

      <button
        onClick={onChangeMode}
        className="mt-6 px-6 py-3 bg-cyan-500 hover:bg-red-500 text-white font-bold rounded-lg "
      >
        {" "}
        Change Mode{" "}
      </button>
    </div>
  );
};

export default GameControls;
