import { getGameHistory } from "../utils/gameHistory";

const History = () => {
  const history = getGameHistory();
  return (
    <div>
      <h1>Game History</h1>
      <p>Total games:{history.length}</p>
      {history.length === 0 && <p>No games played yet</p>}
      {history.map((game) => (
        <div key={game.id}>
          <p>
            Game Mode:{" "}
            {game.gameMode === "player" ? "Player vs Player" : "Player vs AI"}
          </p>
          {game.gameMode === "ai" && <p>AI Difficulty: {game.aiDifficulty}</p>}
          <p>Winner: {game.winner || (game.isDraw ? "Draw" : "Unknown")}</p>
          <p>Date: {new Date(game.date).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
};

export default History;
