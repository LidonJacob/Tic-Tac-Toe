import { useNavigate } from "react-router-dom";
import { Gamepad2, Brain, History } from "lucide-react";
const Home = () => {
  const navigate = useNavigate();
  return (
    <main
      className="min-h-[calc(100vh-65px)] bg-gray-950 flex flex-col items-center justify-center
    px-6 py-8 text-center"
    >
      <section className="max-w-6xl w-full mx-auto relative">
        <div
          className="absolute z-0 top-[95%] left-1/2 -translate-x-1/2 -translate-y-1/2 grid 
        grid-cols-3 gap-4 w-full max-w-2xl opacity-15 pointer-events-none"
        >
          {["X", "O", "X", "O", "X", "O", "X", "O", "X"].map((value, index) => (
            <div
              key={index}
              className="w-full aspect-4/3 bg-gray-900 border border-gray-700/50 rounded-xl flex items-center
  justify-center text-4xl font-bold"
            >
              <span
                className={value === "X" ? "text-cyan-400" : "text-gray-400"}
              >
                {value}
              </span>
            </div>
          ))}
        </div>
        <div className="relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-3">
            Tic-Tac-Toe
          </h1>
          <p className="text-gray-400 text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed">
            Challenge Yourself or play against friends
          </p>

          <button
            onClick={() => navigate("/game")}
            className="bg-cyan-500 hover:bg-cyan-400 text-gray-950 font-bold px-10 py-4 
        rounded-xl text-lg transition-all duration-200 hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            {" "}
            Play Game
          </button>
        </div>
      </section>

      <section className="max-w-6xl mx-auto mt-10 w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-6">
          Everything You need to Play
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
          hover:border-cyan-500/50 transition-all duration-300"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5 mx-auto">
              <Gamepad2 size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {" "}
              Multiple Game Modes
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {" "}
              Play Against a friend or challenge our AI opponent
            </p>
          </div>
          {/* 2nd card */}
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6
           hover:border-cyan-500"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5 mx-auto">
              <Brain size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {" "}
              Adjustble Difficulty
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {" "}
              Choose between Easy, Medium, and Hard difficulty levels to test
              your skills
            </p>
          </div>
          <div
            className="bg-gray-900 border border-gray-800 rounded-2xl p-6 
          hover:border-cyan-500/50 transition"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-5 mx-auto">
              <History size={24} className="text-cyan-400" />
            </div>
            <h3 className="text-xl font-bold text-white mb-3">
              {" "}
              Game History
            </h3>
            <p className="text-gray-400 leading-relaxed">
              {" "}
              Keep track of your games, review past results and see your progress over time
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Home;
