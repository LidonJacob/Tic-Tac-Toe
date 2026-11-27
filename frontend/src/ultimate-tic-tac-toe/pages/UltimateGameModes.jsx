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
    </div>
  );
};

export default UltimateGameModes;
