import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <main
      className="min-h-[calc(100vh-65px)] bg-gray-950 flex flex-col items-center justify-center
    px-6 py-16 text-center"
    >
      <section className="max-w-3xl mx-auto">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6">
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
      </section>
      <div className="mt-16 grid grid-cols-3 gap-3 max-w-60 mx-auto opacity-20">
        {["X", "O", "X", "O", "X", "O", "X", "O", "X"].map((value, index) => (
          <div
            key={index}
            className="w-16 h-16 bg-gray-900 border border-gray-800 rounded-xl flex items-center
  justify-center text-3xl font-bold"
          >
            <span className={value === "X" ? "text-cyan-400" : "text-gray-400"}>
              {value}
            </span>
          </div>
        ))}
      </div>
      <section className="max-w-6xl mx-auto mt-24 w-full">
        <h2 className="text-3xl font-bold text-white text-center mb-12">
          Everything You need to Play
        </h2>
      </section>
    </main>
  );
};

export default Home;
