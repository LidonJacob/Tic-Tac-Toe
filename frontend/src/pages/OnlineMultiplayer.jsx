import { socket } from "../socket/socket";
import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/useAuth";
import GameBoard from "../components/GameBoard";
import { toast } from "react-toastify";

const OnlineMultiplayer = () => {
  const { user, loading } = useAuth();
  const currentUserId = user?._id || user?.id;
  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState(null);
  const matchRef = useRef(null);
  const completedMatchRef = useRef(false);
  const [completedMatch, setCompletedMatch] = useState(null);

  const findMatch = () => {
    socket.emit("find-match");
    setIsSearching(true);
  };

  const makeMove = (index) => {
    if (!match) return;

    if (
      match.currentPlayer !==
      match.players.find((player) => player.userId === currentUserId)?.symbol
    )
      return;

    if (match.status !== "active") return;

    socket.emit("make-move", {
      roomId: match.roomId,
      index,
    });
  };

  const returnToLobby = () => {
    setMatch(null);
    matchRef.current = null;
    setCompletedMatch(null);
  };

  useEffect(() => {
    if (loading || !user) return;

    socket.on("match-found", (matchData) => {
      completedMatchRef.current = false;
      matchRef.current = matchData;
      setMatch(matchData);
      setCompletedMatch(null);
      setIsSearching(false);
    });

    socket.on("game-updated", (gameData) => {
      const updatedMatch = { ...matchRef.current, ...gameData };
      matchRef.current = updatedMatch;
      setMatch(updatedMatch);

      if (updatedMatch.status === "finished" && !completedMatchRef.current) {
        completedMatchRef.current = true;
        setCompletedMatch(updatedMatch);
        if (updatedMatch.isDraw) {
          toast.info("The match ended in a draw", {
            onClose: returnToLobby,
          });
        } else {
          toast.success(`player ${updatedMatch.winner} won the match`, {
            onClose: returnToLobby,
          });
        }
      }
    });

    socket.connect();

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("error");
    });

    return () => {
      socket.off("game-updated");
      socket.off("match-found");
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user, loading]);

  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 flex flex-col items-center justify-center gap-6 px-4 py-8 text-white">
      <h1 className="text-3xl sm:text-4xl font-bold text-cyan-400">
        Online Multiplayer
      </h1>
      {loading && <p>Checking Authentication...</p>}

      {!loading && !user && <p> please login to play online</p>}

      {!loading && user && connectionStatus === "disconnected" && (
        <p>Connecting to the game server...</p>
      )}

      {!loading && user && connectionStatus === "connected" && (
        <p>Connected to the game server</p>
      )}
      {!loading &&
        user &&
        connectionStatus === "connected" &&
        !isSearching &&
        !match && (
          <button
            onClick={findMatch}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg font-semibold transition-colors"
          >
            Find Match
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
          <GameBoard board={match.board} onSquareClick={makeMove} />
        </div>
      )}

      {!loading && user && connectionStatus === "error" && (
        <p>Unable to connect to the game server. Please try again.</p>
      )}
    </div>
  );
};

export default OnlineMultiplayer;
