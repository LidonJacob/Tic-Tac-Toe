import { getGameHistory } from "../utils/gameHistory";
import {
  tableFeatures,
  useTable,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
} from "@tanstack/react-table";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
  },
});
const History = () => {
  const history = getGameHistory();
  const columns = [
    {
      header: "Date",
      accessorKey: "date",
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Game Mode",
      accessorKey: "gameMode",
      cell: (info) =>
        info.getValue() === "player" ? "Player vs Player" : "Player vs AI",
    },
    {
      header: "Winner",
      accessorFn: (row) => row.winner || (row.isDraw ? "Draw" : "Unknown"),
    },
    {
      header: "AI Difficulty",
      accessorKey: "aiDifficulty",
      cell: (info) => info.getValue() || "_",
    },
  ];
  const table = useTable({
    features,
    columns,
    data: history,
    initialState: {
      sorting: [{ id: "date", desc: true }],
    },
  });

  const rows = table.getRowModel().rows;
  return (
    <div>
      <h1>Game History</h1>
      <p>Total games:{history.length}</p>
      <table>
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder ? null : (
                    <div
                      onClick={header.column.getToggleSortingHandler()}
                      className="cursor-pointer"
                    >
                      <table.FlexRender header={header} />
                      {{
                        asc: <span>&#9650;</span>,
                        desc: <span>&#9660;</span>,
                      }[header.column.getIsSorted()] ?? null}
                    </div>
                  )}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {row.getAllCells().map((cell) => (
                <td key={cell.id}>
                  <table.FlexRender cell={cell} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
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
