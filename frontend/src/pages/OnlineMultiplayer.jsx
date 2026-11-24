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
  const [opponentDisconnected, setOpponentDisconnected] = useState(false);
  const [opponentFailedToReconnect, setOpponentFailedToReconnect] =
    useState(false);
  const matchRef = useRef(null);
  const completedMatchRef = useRef(false);
  const [completedMatch, setCompletedMatch] = useState(null);
  const [rematchStatus, setRematchStatus] = useState("");
  const [rematchWindowOpen, setRematchWindowOpen] = useState(false);

  useEffect(() => {
    if (!rematchWindowOpen) return;

    const timer = setTimeout(() => {
      setRematchWindowOpen(false);
    }, 15000);

    return () => clearTimeout(timer);
  }, [rematchWindowOpen]);

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
  };

  const requestRematch = () => {
    socket.emit("request-rematch", {
      roomId: completedMatch.roomId,
    });

    setRematchStatus("Waiting for your opponent...");
  };

  useEffect(() => {
    if (loading || !user) return;

    socket.on("match-found", (matchData) => {
      setOpponentDisconnected(false);
      setOpponentFailedToReconnect(false);
      completedMatchRef.current = false;
      matchRef.current = matchData;
      setMatch(matchData);
      setCompletedMatch(null);
      setIsSearching(false);
    });

    socket.on("rematch-started", (matchData) => {
      setOpponentDisconnected(false);
      setOpponentFailedToReconnect(false);
      setRematchWindowOpen(false);
      completedMatchRef.current = false;
      matchRef.current = matchData;
      setMatch(matchData);
      setCompletedMatch(null);
      setRematchStatus("");
    });

    socket.on("waiting-for-rematch", () => {
      setRematchStatus("Waiting for your opponent to accept...");
    });

    socket.on("rematch-requested", () => {
      setRematchStatus("Your opponent has requested a rematch!");
    });

    socket.on("rematch-cancelled", () => {
      setRematchStatus("Rematch cancelled because a player disconnected.");

      toast.warning("Rematch cancelled");
    });

    socket.on("game-updated", (gameData) => {
      const updatedMatch = { ...matchRef.current, ...gameData };
      matchRef.current = updatedMatch;
      setMatch(updatedMatch);

      if (updatedMatch.status === "finished" && !completedMatchRef.current) {
        completedMatchRef.current = true;
        setCompletedMatch(updatedMatch);
        setRematchWindowOpen(true);

        if (updatedMatch.isDraw) {
          toast.info("The match ended in a draw!", {
            onClose: returnToLobby,
          });
        } else {
          toast.success(`Player ${updatedMatch.winner} wins!`, {
            onClose: returnToLobby,
          });
        }
      }
    });

    socket.on("opponent-disconnected", () => {
      setOpponentDisconnected(true);

      toast.warning(
        "Your opponent has disconnected, waiting for them to reconnect...",
      );
    });

    socket.on("opponent-failed-to-reconnect", () => {
      setOpponentFailedToReconnect(true);
      setOpponentDisconnected(false);
      returnToLobby();

      toast.error("Your opponent has failed to reconnect!, Match Ended!");
    });

    socket.on("opponent-reconnected", () => {
      setOpponentDisconnected(false);

      toast.success("Your opponent has reconnected!");
    });

    socket.on("match-restored", (matchData) => {
      completedMatchRef.current = false;
      matchRef.current = matchData;
      setMatch(matchData);
      setCompletedMatch(null);
      setIsSearching(false);

      toast.success("Your previous match has been restored!");
    });

    socket.connect();

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("disconnect", () => {
      setConnectionStatus("disconnected");
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
      socket.off("opponent-disconnected");
      socket.off("opponent-reconnected");
      socket.off("match-restored");
      socket.off("disconnect");
      socket.off("opponent-failed-to-reconnect");
      socket.off("rematch-cancelled");
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

      {completedMatch && rematchWindowOpen && (
        <button
          onClick={requestRematch}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors"
        >
          Rematch
        </button>
      )}

      {rematchStatus && (
        <p className="text-cyan-400 font-semibold">{rematchStatus}</p>
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
            {opponentFailedToReconnect
              ? "Opponent failed to reconnect. Match ended."
              : opponentDisconnected
                ? "Opponent disconnected. Waiting for reconnection..."
                : `Opponent found! You are ${
                    match.players.find(
                      (player) => player.userId === currentUserId,
                    )?.symbol
                  }`}
          </p>
          <p className="text-xl font-semibold text-white">
            {match.winner
              ? `Player ${match.winner} wins!`
              : match.isDraw
                ? "It's a draw!"
                : `Player ${match.currentPlayer}'s turn`}
          </p>
          <GameBoard
            board={match.board}
            onSquareClick={makeMove}
            winningCombination={match.winningCombination}
          />
        </div>
      )}

      {!loading && user && connectionStatus === "error" && (
        <p>Unable to connect to the game server. Please try again.</p>
      )}
    </div>
  );
};

export default OnlineMultiplayer;
