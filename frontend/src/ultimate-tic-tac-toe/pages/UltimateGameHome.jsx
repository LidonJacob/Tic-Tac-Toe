import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

const UltimateGameHome = () => {
  const navigate = useNavigate();

  const [showInstructions, setShowInstructions] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setShowInstructions(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);
  return (
    <div
      className="min-h-[calc(100dvh-60px)] w-full bg-gray-950 text-white flex flex-col 
    items-center justify-center px-4 py-10"
    >
      <div className="max-w-2xl text-center space-y-5">
        <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400">
          Ultimate Tic-Tac-Toe
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading leading-relaxed">
          Think beyond the ordinary.Take control of nine miniboards, outsmart
          your opponent and claim victory
        </p>
      </div>
      <div className="mt-8 flex flex-col sm:flex-row items-center gap-4">
        <button
          onClick={() => navigate("/ultimate-game")}
          className="px-8 py-3 rounded-lg bg-cyan-500
        text-gray-950 font-bold hover:bg-cyan-400 hover:shadow-lg 
        hover:shadow-cyan-500/20 transition-all duration-200"
        >
          Play Game
        </button>
        <button
          onClick={() => setShowInstructions(true)}
          className="px-8 py-3 rounded-lg border border-gray-700 text-gray-300
  font-semibold hover:border-cyan-400 hover:text-cyan-400
  transition-all duration-200"
        >
          How to Play
        </button>
      </div>
      {showInstructions && (
        <div
          onClick={() => setShowInstructions(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg rounded-xl border border-cyan-500/20 shadow-2xl
            shadow-black/40 bg-gray-900 p-6"
          >
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">
              How to Play
            </h2>
            <div className="space-y-4 text-gray-300 text-sm sm:text-base">
              <p>
                <span className="text-cyan-400 font-semibold">
                  1. Nine mini boards
                </span>
                <br />
                The game consists of nine smaller Tic-Tac-Toe boards arranged in
                a 3×3 grid.
              </p>

              <p>
                <span className="text-cyan-400 font-semibold">
                  2. Win mini boards
                </span>
                <br />
                Get three of your marks in a row, column, or diagonal to win a
                mini board.
              </p>

              <p>
                <span className="text-cyan-400 font-semibold">
                  3. Your move decides theirs
                </span>
                <br />
                The square you choose determines which mini board your opponent
                must play in next.
              </p>

              <p>
                <span className="text-cyan-400 font-semibold">
                  4. Free choice
                </span>
                <br />
                If the required mini board is already won or full, your opponent
                may choose any available mini board.
              </p>

              <p>
                <span className="text-cyan-400 font-semibold">
                  5. Win the whole game
                </span>
                <br />
                Win three mini boards in a row, column, or diagonal to claim
                victory!
              </p>
            </div>

            <button
              onClick={() => setShowInstructions(false)}
              className="mt-6 w-full rounded-lg bg-cyan-500 py-2.5 font-semibold text-gray-950 hover:bg-cyan-400 transition"
            >
              Got It
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UltimateGameHome;
