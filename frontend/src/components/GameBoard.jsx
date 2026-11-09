import Square from "./Square"

const GameBoard = ({board, onSquareClick}) => {
  return (
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
  )
}

export default GameBoard