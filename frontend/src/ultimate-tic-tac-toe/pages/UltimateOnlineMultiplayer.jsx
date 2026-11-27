import { useEffect, useState } from "react";
import { socket } from "../../socket/socket";
import { useAuth } from "../../context/useAuth";

const UltimateOnlineMultiPlayer = () => {
  const { user, loading } = useAuth();

  const [connectionStatus, setConnectionStatus] = useState("disconnected");
  const [isSearching, setIsSearching] = useState(false);
  const [match, setMatch] = useState(null);

  const currentUserId = user?._id || user?.id;

  useEffect(() => {
    if (loading || !user) return;

    socket.connect();

    const handleConnect = () => {
      setConnectionStatus("connected");
    };

    socket.on("connect", handleConnect);

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
      socket.off("disconnect", handleDisconnect);
      socket.off("connect_error", handleConnectError);
    };
  }, [loading, user]);
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

      {!loading && user && connectionStatus === "error" && (
        <p className="text-red-400 font-semibold">
          Unable to connect to the game server. Please try again.
        </p>
      )}
    </div>
  );
};

export default UltimateOnlineMultiPlayer;
