import { Sprout, Brain, Trophy, ArrowRight } from "lucide-react";

const DifficultySelector = ({ onSelectDifficulty }) => {
  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Choose Difficulty
      </h1>

      <p className="text-gray-400 mt-3 text-center">
        How challenging do you want your game to be?
      </p>

      <div className="mt-10 grid w-full max-w-3xl gap-5">
        <button
          type="button"
          onClick={() => onSelectDifficulty("easy")}
          className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6 text-left hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Sprout size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Easy</h2>
              <p className="mt-1 text-sm text-gray-400">
                A relaxed game for casual play.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => onSelectDifficulty("medium")}
          className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6 text-left hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Brain size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Medium</h2>
              <p className="mt-1 text-sm text-gray-400">
                A smarter opponent that keeps you thinking.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => onSelectDifficulty("hard")}
          className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6 text-left hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Trophy size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Hard</h2>
              <p className="mt-1 text-sm text-gray-400">
                Take on the toughest AI challenge.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default DifficultySelector;
