import { useNavigate } from "react-router-dom";
import { Sprout, Brain, Trophy, ArrowRight } from "lucide-react";

const UltimateDifficulty = () => {
  const navigate = useNavigate();

  const difficulties = [
    {
      name: "Easy",
      description: "A relaxed challenge to learn the game.",
      value: "easy",
      Icon: Sprout,
    },
    {
      name: "Medium",
      description: "A smarter opponent that tests your strategy.",
      value: "medium",
      Icon: Brain,
    },
    {
      name: "Hard",
      description: "Face the toughest strategic challenge.",
      value: "hard",
      Icon: Trophy,
    },
  ];

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white flex flex-col items-center px-4 py-12">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Choose Difficulty
      </h1>

      <p className="text-gray-400 mt-3 text-center">
        How challenging do you want your opponent to be?
      </p>

      <div className="mt-10 grid w-full max-w-3xl gap-5">
        {difficulties.map(({ name, description, value, Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() =>
              navigate("/ultimate-game-ai", {
                state: { difficulty: value },
              })
            }
            className="w-full flex items-center justify-between gap-4 rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6 text-left hover:border-cyan-500/50 hover:bg-gray-800 transition-all duration-200"
          >
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <Icon size={24} />
              </div>

              <div>
                <h2 className="text-xl font-semibold text-white">{name}</h2>
                <p className="mt-1 text-sm text-gray-400">{description}</p>
              </div>
            </div>

            <ArrowRight size={20} className="shrink-0 text-gray-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default UltimateDifficulty;
