import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/useAuth";
import UltimateGameBoard from "../components/UltimateGameBoard";

const UltimateOnlineMultiPlayer = () => {
  const { user, loading } = useAuth();

  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState(null);

  const currentUserId = user?._id || user?.id;

  const findMatch = () => {
    socket.emit("find-ultimate-match");
    setIsSearching(true);
  };

  useEffect(() => {
    if (loading || !user) return;

    socket.connect();

    const handleConnect = () => {
      setConnectionStatus("connected");
    };

    const handleMatchFound = (matchData) => {
      setMatch({
        ...matchData,
        ...matchData.gameState,
      });

      setIsSearching(false);
    };

    const handleWaitingForOpponent = () => {
      setIsSearching(true);
    };

    const handleGameUpdated = (gameState) => {
      setMatch((currentMatch) =>
        currentMatch ? { ...currentMatch, ...gameState } : currentMatch,
      );
    };

    socket.on("connect", handleConnect);

    socket.on("ultimate-match-found", handleMatchFound);

    socket.on("ultimate-waiting-for-opponent", handleWaitingForOpponent);

    socket.on("ultimate-game-updated", handleGameUpdated);

    const handleDisconnect = () => {
      setConnectionStatus("disconnected");
    };

    socket.on("disconnect", handleDisconnect);

    const handleConnectError = () => {
      setConnectionStatus("error");
    };

    socket.on("connect_error", handleConnectError);

    return () => {
      socket.off("connect", handleConnect);
      socket.off("ultimate-match-found", handleMatchFound);
      socket.off("ultimate-waiting-for-opponent", handleWaitingForOpponent);
      socket.off("ultimate-game-updated", handleGameUpdated);
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [loading, user]);

  const makeMove = (miniBoardIndex, squareIndex) => {
    if (!match || match.status !== "active") return;

    const playerSymbol = match.players.find(
      (player) => player.userId === currentUserId,
    )?.symbol;

    if (match.currentPlayer !== playerSymbol) return;

    socket.emit("make-ultimate-move", {
      roomId: match.roomId,
      miniBoardIndex,
      squareIndex,
    });
  };
  return (
    <div
      className="min-h-[calc(100dvh-60px)] bg-gray-950 flex flex-col items-center
    justify-center gap-6 px-4 py-8 text-white"
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Ultimate Online MultiPlayer
      </h1>
      {loading && (
        <p className="text-cyan-400 font-semibold animate-pulse">
          Checking authentication...
        </p>
      )}

      {!loading && !user && (
        <p className="text-red-400 font-semibold">
          Please log in to play online.
        </p>
      )}
      {!loading && user && connectionStatus === "disconnected" && (
        <p className="text-cyan-400 font-semibold animate-pulse">
          Connecting to the game server...
        </p>
      )}

      {!loading && user && connectionStatus === "connected" && (
        <p className="text-green-400 font-semibold">
          Connected to the game server.
        </p>
      )}

      {!isSearching && !match && (
        <button
          onClick={findMatch}
          className="px-6 py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400
    text-gray-950 font-bold transition-colors"
        >
          Find an Opponent
        </button>
      )}

      {isSearching && !match && (
        <div className="flex flex-col items-center gap-4">
          <div className="relative flex items-center justify-center w-20 h-20">
            <div className="absolute w-full h-full rounded-full bg-cyan-500/20 animate-ping" />
            <div className="w-5 h-5 rounded-full bg-cyan-400" />
          </div>

          <p className="text-cyan-400 font-semibold animate-pulse">
            Searching for an opponent...
          </p>
        </div>
      )}

      {match && (
        <div className="flex flex-col items-center gap-4">
          <p className="text-green-400 font-semibold">
            Opponent found! You are{" "}
            {
              match.players.find((player) => player.userId === currentUserId)
                ?.symbol
            }
          </p>

          <p className="text-xl font-semibold text-white">
            {match.winner
              ? `Player ${match.winner} wins!`
              : match.isDraw
                ? "It's a draw!"
                : `Player ${match.currentPlayer}'s turn`}
          </p>

          <UltimateGameBoard
            board={match.board}
            miniBoardWinners={match.miniBoardWinners}
            nextMiniBoard={match.nextMiniBoard}
            onSquareClick={makeMove}
            isGameOver={match.status !== "active"}
          />
        </div>
      )}

      {!loading && user && connectionStatus === "error" && (
        <p className="text-red-400 font-semibold">
          Unable to connect to the game server. Please try again.
        </p>
      )}
    </div>
  );
};

export default UltimateOnlineMultiPlayer;
