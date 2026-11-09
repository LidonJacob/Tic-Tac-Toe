const DifficultySelector = ({ onSelectDifficulty }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Choose Difficulty
      </h1>

      <button
        onClick={() => onSelectDifficulty("easy")}
        className="px-4 py-3 sm:px-6 bg-cyan-700 text-white rounded-lg cursor-pointer
         hover:bg-cyan-800 focus-visible:outline-2 
         focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {" "}
        Easy{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("medium")}
        className="px-4 py-3 sm:px-6 bg-cyan-700 text-white rounded-lg cursor-pointer hover:bg-cyan-800
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {" "}
        Medium{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("hard")}
        className="px-4 py-3 sm:px-6 bg-cyan-700 text-white rounded-lg cursor-pointer hover:bg-cyan-800
        focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
      >
        {" "}
        Hard{" "}
      </button>
    </div>
  );
};

export default DifficultySelector;
