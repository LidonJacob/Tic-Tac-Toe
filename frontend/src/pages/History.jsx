import { getGameHistory } from "../utils/gameHistory";
import {
  tableFeatures,
  useTable,
  rowSortingFeature,
  createSortedRowModel,
  sortFn_alphanumeric,
  columnFilteringFeature,
  globalFilteringFeature,
  createFilteredRowModel,
  filterFn_includesString,
} from "@tanstack/react-table";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import api from "../services/api";

const features = tableFeatures({
  rowSortingFeature,
  sortedRowModel: createSortedRowModel(),
  sortFns: {
    alphanumeric: sortFn_alphanumeric,
  },
  columnFilteringFeature,
  globalFilteringFeature,
  filteredRowModel: createFilteredRowModel(),
  filterFns: {
    includesString: filterFn_includesString,
  },
});
const History = () => {
  const { user, loading } = useAuth();
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (loading) return;

    const fetchHistory = async () => {
      try {
        if (user) {
          const response = await api.get("/games");
          setHistory(response.data.games || []);
        } else {
          setHistory(getGameHistory());
        }
      } catch (error) {
        console.error("Error fetching game history:", error);
        setHistory([]);
      }
    };
    fetchHistory();
  }, [user, loading]);

  const columns = [
    {
      header: "Date",
      id: "date",
      accessorFn: (row) => row.date || row.createdAt,
      cell: (info) => new Date(info.getValue()).toLocaleString(),
    },
    {
      header: "Game Mode",
      accessorKey: "gameMode",
      cell: (info) => {
        const mode = info.getValue();

        if (mode === "online") return "Online Multiplayer";
        if (mode === "player") return "Player vs Player";

        return "Player vs AI";
      },
    },
    {
      header: "Winner",
      accessorFn: (row) =>
        row.winner ||
        (row.isDraw || row.status === "draw" ? "Draw" : "Unknown"),
      cell: (info) => {
        const game = info.row.original;

        if (!game.winner) {
          return game.isDraw || game.status === "draw" ? "Draw" : "Unknown";
        }

        if (game.gameMode !== "online") {
          return `Player ${game.winner}`;
        }

        const winner = game.players.find(
          (player) => player.symbol === game.winner,
        )?.user;

        if (!winner || typeof winner === "string") {
          return `Player ${game.winner}`;
        }

        return String(winner._id) === String(user._id)
          ? `You (${winner.username})`
          : `Opponent (${winner.username})`;
      },
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
  const handleSearch = (event) => {
    table.setGlobalFilter(event.target.value);
  };
  const rows = table.getRowModel().rows;

  if (loading) {
    return <p className="text-white text-center mt-10"> Loading history...</p>;
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-2 text-center">Game History</h1>
        <p className="text-gray-400 text-sm mb-6 text-center">
          Total games:
          <span className="text-[#00d4ff] font-semibold">
            {history.length}{" "}
          </span>
        </p>
        <div className="flex justify-center mb-6">
          <input
            type="text"
            value={table.state.globalFilter ?? ""}
            placeholder="Search games"
            onChange={handleSearch}
            className="w-full max-w-md px-4 py-3 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white
         placeholder-gray-400 focus:outline-none focus:border-[#00d4ff] transition-colors text-center"
          />
        </div>
        {history.length === 0 ? (
          <p>No games Played yet</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse overflow-hidden rounded-xl">
              <thead className="bg-[#1a1a1a] text-gray-300">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-4 text-left text-sm font-semibold
                  uppercase tracking-wider"
                      >
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
              <tbody className="divide-y divide-gray-800">
                {rows.map((row) => (
                  <tr
                    key={row.id}
                    className="hover:bg-[#1a1a1a] transition-colors"
                  >
                    {row.getAllCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-300"
                      >
                        <table.FlexRender cell={cell} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
