import MiniBoard from "./MiniBoard";

const UltimateGameBoard = ({
  board,
  miniBoardWinners,
  nextMiniBoard,
  onSquareClick,
  isGameOver,
}) => {
  return (
    <div className="grid grid-cols-3 gap-2 sm:gap-3 w-[min(88vw,calc(100dvh-180px))] shrink-0 aspect-square">
      {board.map((miniBoard, index) => {
        const isCompleted =
          Boolean(miniBoardWinners[index]) ||
          miniBoard.every((square) => square !== "");

        return (
          <MiniBoard
            key={index}
            miniBoard={miniBoard}
            miniBoardIndex={index}
            miniBoardWinner={miniBoardWinners[index]}
            onSquareClick={onSquareClick}
            isActive={
              !isGameOver &&
              !isCompleted &&
              (nextMiniBoard === null || nextMiniBoard === index)
            }
            isCompleted={isCompleted}
          />
        );
      })}
    </div>
  );
};

export default UltimateGameBoard;
