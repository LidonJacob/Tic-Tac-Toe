const UltimateGameControls = ({ onRestart }) => {
  return (
    <div className="flex justify-center lg:ml-6">
      <button
        onClick={onRestart}
        className="px-5 py-2 rounded-lg bg-cyan-500 text-gray-950 font-semibold hover:bg-cyan-400
        transition-colors"
      >
        Restart Game
      </button>
    </div>
  );
};

export default UltimateGameControls;
