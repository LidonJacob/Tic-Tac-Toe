const UltimateGameStatus = ({ currentPlayer, winner, isDraw }) => {
  return (
    <div className="text-center">
      {winner ? (
        <p className="text-2xl font-bold text-cyan-400">
          Player {winner} Wins!
        </p>
      ) : isDraw ? (
        <p className="text-2xl font-bold text-gray-300">It's a Draw!</p>
      ) : (
        <p className="text-lg text-gray-300">
          Current Turn:{" "}
          <span className="font-bold text-cyan-400">{currentPlayer}</span>
        </p>
      )}
    </div>
  );
};

export default UltimateGameStatus;
