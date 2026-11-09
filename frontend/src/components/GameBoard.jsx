import Square from "./Square";
import { useRef, useState } from "react";

const GameBoard = ({ board, onSquareClick, winningCombination }) => {
  const [activeSquare, setActiveSquare] = useState(0);
  const squareRefs = useRef([]);

  const handleKeyDown = (event, index) => {
    let nextIndex;

    switch (event.key) {
      case "ArrowUp":
        nextIndex = index - 3;
        break;

      case "ArrowDown":
        nextIndex = index + 3;
        break;

      case "ArrowLeft":
        nextIndex = index - 1;
        break;

      case "ArrowRight":
        nextIndex = index + 1;
        break;

      default:
        return;
    }
    const isValidMove =
      (event.key === "ArrowUp" && index >= 3) ||
      (event.key === "ArrowDown" && index <= 5) ||
      (event.key === "ArrowLeft" && index % 3 !== 0) ||
      (event.key === "ArrowRight" && index % 3 !== 2);
    if (isValidMove) {
      event.preventDefault();
      setActiveSquare(nextIndex);
      squareRefs.current[nextIndex].focus();
    }
  };
  const winningLines = {
    "0,1,2": { x1: 20, y1: 50, x2: 280, y2: 50 },
    "3,4,5": { x1: 20, y1: 150, x2: 280, y2: 150 },
    "6,7,8": { x1: 20, y1: 250, x2: 280, y2: 250 },

    "0,3,6": { x1: 50, y1: 20, x2: 50, y2: 280 },
    "1,4,7": { x1: 150, y1: 20, x2: 150, y2: 280 },
    "2,5,8": { x1: 250, y1: 20, x2: 250, y2: 280 },

    "0,4,8": { x1: 10, y1: 10, x2: 290, y2: 290 },
    "2,4,6": { x1: 290, y1: 10, x2: 10, y2: 290 },
  };
  const winningLine = winningCombination
    ? winningLines[winningCombination.join(",")]
    : null;
  return (
    <div className="relative">
      <div
        role="group"
        aria-label="Tic-Tac-Toe game board"
        className="grid grid-cols-3 gap-1.5 sm:gap-2"
      >
        {board.map((value, index) => {
          return (
            <Square
              key={index}
              value={value}
              onClick={() => onSquareClick(index)}
              buttonRef={(element) => (squareRefs.current[index] = element)}
              tabIndex={index === activeSquare ? 0 : -1}
              onKeyDown={(event) => handleKeyDown(event, index)}
              onFocus={() => setActiveSquare(index)}
              index={index}
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
            stroke="#00d4ff"
            strokeWidth="7"
            strokeLinecap="round"
            strokeDasharray="420"
            strokeDashoffset="420"
            className="animate-draw-line"
          />
        )}
      </svg>
    </div>
  );
};

export default GameBoard;
