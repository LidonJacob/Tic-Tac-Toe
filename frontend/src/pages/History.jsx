import { getGameHistory } from "../utils/gameHistory";
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

const History = () => {
  const history = getGameHistory();
  const columns = [{
     header: "Date",
    accessorKey: "date",
    cell: (info) => new Date(info.getValue()).toLocaleString(),
}];
const table = useReactTable({
  data: history,
  columns,
  getCoreRowModel: getCoreRowModel(),
})

const rows = table.getRowModel().rows;
  return (
    <div>
      <table>
  <thead>
    {table.getHeaderGroups().map((headerGroup) => (
      <tr key={headerGroup.id}>
        {headerGroup.headers.map((header) => (
          <th key={header.id}>
            {flexRender(
              header.column.columnDef.header,
              header.getContext()
            )}
          </th>
        ))}
      </tr>
    ))}
  </thead>
  <tbody>
  {rows.map((row) => (
    <tr key={row.id}>
      {row.getVisibleCells().map((cell) => (
        <td key={cell.id}>
          {flexRender(
            cell.column.columnDef.cell ??
              cell.column.columnDef.header,
            cell.getContext()
          )}
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
