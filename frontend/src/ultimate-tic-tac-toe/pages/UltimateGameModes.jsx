import { useNavigate } from "react-router-dom";

const UltimateGameModes = () => {
  const navigate = useNavigate();
  return (
    <div
      className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white flex flex-col
    items-center px-4 py-12"
    >
      <h1 className="text-3xl font-bold text-cyan-400">
        {" "}
        Choose Your Game Mode{" "}
      </h1>
      <p className="text-gray-400 mt-3 text-center">
        How would you like to play ultimate Tic-Tac-Toe?
      </p>
      <div className="mt-10 grid w-full max-w-3xl gap-5">
        <button
          type="button"
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
            <icon name="users" size={24} />
          </div>
          <h2 className="text-xl font-semibold text-cyan-400">
            Local 2 Player
          </h2>
          <p className="mt-2 text-gray-400">
            Play with a friend on the same device.
          </p>
          </div>
        </button>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-cyan-400">Play vs AI</h2>
          <p className="mt-2 text-gray-400">
            Challenge the computer and choose your difficulty.
          </p>
        </div>

        <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
          <h2 className="text-xl font-semibold text-cyan-400">
            Online Multiplayer
          </h2>
          <p className="mt-2 text-gray-400">
            Challenge another player from anywhere.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UltimateGameModes;
