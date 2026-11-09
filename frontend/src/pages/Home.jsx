import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-5xl font-bold text-cyan-400 mb-4">Tic-Tac-Toe</h1>
      <p className="text-gray-300 text-lg mb-8">
        Challenge Yourself or play against friends
      </p>

      <button
        onClick={() => navigate("/game")}
        className="bg-cyan-700 hover:bg-cyan-800 text-white font-bold
px-8 py-3 rounde-lg"
      >
        {" "}
        Play Game
      </button>
    </div>
  );
};

export default Home;
