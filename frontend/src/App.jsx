import Square from "./components/Square";


function App() {
  const board = ["", "", "", "", "", "", "", "", ""];

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <h1 className="text-4xl font-bold text-cyan-400">Tic-Tac-Toe</h1>
      <div className="grid grid-cols-3 gap-2">
        {board.map((value, index) => {
          return <Square key={index} value={value} />;
        })}
      </div>
    </div>
  );
}

export default App;
