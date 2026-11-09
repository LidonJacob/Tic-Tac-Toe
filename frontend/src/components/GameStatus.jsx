const GameStatus = ({ currentPlayer, winner, isDraw, gameMode }) => {
  return (
    <div className="text-lg sm:text-xl font-semibold text-white text-center mb-4">
      {winner
        ? gameMode === "ai"
          ? winner === "O"
            ? "AI wins!"
            : "You Win!"
          : `Player ${winner} wins!`
        : isDraw
          ? "It's a draw!"
          : gameMode === "ai" && currentPlayer === "O"
            ? "AI is thinking..."
            : `Player ${currentPlayer}'s turn`}
    </div>
  );
};

export default GameStatus;
