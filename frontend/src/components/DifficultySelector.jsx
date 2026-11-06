const DifficultySelector = ({ onSelectDifficulty }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6">
      <h1 className="text-4xl font-bold text-cyan-400">Choose Difficulty</h1>

      <button
        onClick={() => onSelectDifficulty("easy")}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-green-500"
      >
        {" "}
        Easy{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("medium")}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg cursor:pointer hover:bg-yellow-500"
      >
        {" "}
        Medium{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("medium")}
        className="px-6 py-3 bg-cyan-500 text-white rounded-lg cursor:pointer hover:bg-red-500"
      >
        {" "}
        Hard{" "}
      </button>
    </div>
  );
};

export default DifficultySelector;
