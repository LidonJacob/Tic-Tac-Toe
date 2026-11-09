const DifficultySelector = ({ onSelectDifficulty }) => {
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">Choose Difficulty</h1>

      <button
        onClick={() => onSelectDifficulty("easy")}
        className="px-4 py-3 sm:px-6 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-green-500"
      >
        {" "}
        Easy{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("medium")}
        className="px-4 py-3 sm:px-6 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-yellow-500"
      >
        {" "}
        Medium{" "}
      </button>
      <button
        onClick={() => onSelectDifficulty("hard")}
        className="px-4 py-3 sm:px-6 bg-cyan-500 text-white rounded-lg cursor-pointer hover:bg-red-500"
      >
        {" "}
        Hard{" "}
      </button>
    </div>
  );
};

export default DifficultySelector;


//useeffect is a hook that allows you to perform side effects in function components, it has a dependency array
//dpendency array 
//No dependncy array runs after every render
//empty dependncy array runs after first render
//dependency array runs after every render or change of dependency also on the first render

//useCallback keeps a function in memory