const GameStatus = ({ currentPlayer, winner, isDraw }) => {
  return (
    <div className="text-xl font-semibold text-white text-center mb-4">
      {winner
        ? `Player ${winner} wins!`
        : isDraw
          ? "It's a draw!"
          : `Player ${currentPlayer}'s turn`}
    </div>
  );
};

export default GameStatus;
