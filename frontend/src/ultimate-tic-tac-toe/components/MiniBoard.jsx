import MiniSquare from "./MiniSquare";

const MiniBoard = ({
  miniBoard,
  miniBoardIndex,
  miniBoardWinner,
  onSquareClick,
  isActive,
  isCompleted,
}) => {
  return (
    <div
      className={`relative grid grid-cols-3 gap-1 p-2 rounded-lg border-2 ${isActive ? "border-cyan-400" : "border-gray-700"}`}
    >
      {miniBoard.map((square, squareIndex) => (
        <MiniSquare
          key={squareIndex}
          value={square}
          onClick={() => onSquareClick(miniBoardIndex, squareIndex)}
          disabled={!isActive || isCompleted || square !== ""}
        />
      ))}

      {miniBoardWinner && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg bg-gray-950/80">
          <span
            className="text-7xl sm:text-8xl font-black text-cyan-400 animate-[win-pop_450ms_ease-out_both]
          drop-shadow-[0_0_12px_rgba(34,211,238,0.35)]"
          >
            {miniBoardWinner}
          </span>
        </div>
      )}
    </div>
  );
};

export default MiniBoard;
