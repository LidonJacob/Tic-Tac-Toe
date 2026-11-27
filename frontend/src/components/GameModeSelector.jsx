import { Users, Bot, Globe, ArrowRight } from "lucide-react";

const GameModeSelector = ({ onSelectMode, onSelectOnline }) => {
  return (
    <div
      className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white
  flex flex-col items-center px-4 py-12"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Tic-Tac-Toe
      </h1>

      <p className="text-gray-400 mt-3 text-center">
        Choose how you want to play.
      </p>

      <div className="mt-10 grid w-full max-w-3xl gap-5">
        <button
          type="button"
          onClick={() => onSelectMode("player")}
          className="w-full flex items-center justify-between gap-4
        rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6
        text-left hover:border-cyan-500/50 hover:bg-gray-800
        transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-lg bg-cyan-500/10 text-cyan-400"
            >
              <Users size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">
                Local Multiplayer
              </h2>
              <p className="mt-1 text-sm text-gray-400">
                Play with a friend on the same device.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={() => onSelectMode("ai")}
          className="w-full flex items-center justify-between gap-4
        rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6
        text-left hover:border-cyan-500/50 hover:bg-gray-800
        transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-lg bg-cyan-500/10 text-cyan-400"
            >
              <Bot size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Player vs AI</h2>
              <p className="mt-1 text-sm text-gray-400">
                Challenge the computer at your preferred difficulty.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>

        <button
          type="button"
          onClick={onSelectOnline}
          className="w-full flex items-center justify-between gap-4
        rounded-xl border border-gray-800 bg-gray-900 p-5 sm:p-6
        text-left hover:border-cyan-500/50 hover:bg-gray-800
        transition-all duration-200"
        >
          <div className="flex items-center gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center
          rounded-lg bg-cyan-500/10 text-cyan-400"
            >
              <Globe size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Online PvP</h2>
              <p className="mt-1 text-sm text-gray-400">
                Compete against another player online.
              </p>
            </div>
          </div>
          <ArrowRight size={20} className="shrink-0 text-gray-500" />
        </button>
      </div>
    </div>
  );
};

export default GameModeSelector;
