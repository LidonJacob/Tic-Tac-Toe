import Square from "./Square";

const GameBoard = ({ board, onSquareClick, winningCombination }) => {
  const winningLines = {
    "0,1,2": {x1:20, y1:50, x2:280, y2:50},
    "3,4,5": {x1:20, y1:150, x2:280, y2:150},
    "6,7,8": {x1:20, y1:250, x2:280, y2:250},

    "0,3,6": {x1:50, y1:20, x2:50, y2:280},
    "1,4,7": {x1:150, y1:20, x2:150, y2:280},
    "2,5,8": {x1:250, y1:20, x2:250, y2:280},

    "0,4,8": {x1:50, y1:50, x2:250, y2:250},
    "2,4,6": {x1:250, y1:50, x2:50, y2:250},
  }
  const winningLine = winningCombination ? winningLines[winningCombination.join(",")] : null
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
        {board.map((value, index) => {
          return (
            <Square
              key={index}
              value={value}
              onClick={() => onSquareClick(index)}
            />
          );
        })}
      </div>
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none"
        viewBox="0 0 300 300"
        aria-hidden="true"
      >
        {winningCombination && (
          <line
            x1={winningLine.x1}
            y1={winningLine.y1}
            x2={winningLine.x2}
            y2={winningLine.y2}
            stroke="00d4ff"
            strokeWidth="7"
            strokeLineCap="round"
          />
        )}
      </svg>
    </div>
  );
};

export default GameBoard;
