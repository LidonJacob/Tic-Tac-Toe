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
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [loading, user]);
  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white ">
      <h1 className="text-3xl font-bold text-cyan-400 text-center pt-10">
        Ultimate Online MultiPlayer
      </h1>
      {loading && <p>Checking authentication...</p>}

      {!loading && !user && <p>Please log in to play online.</p>}

      {!loading && user && connectionStatus === "disconnected" && (
        <p>Connecting to the game server...</p>
      )}

      {!loading && user && connectionStatus === "connected" && (
        <p className="text-green-400">Connected to the game server.</p>
      )}

      {!loading && user && connectionStatus === "error" && (
        <p className="text-red-400">
          Unable to connect to the game server. Please try again.
        </p>
      )}
    </div>
  );
};

export default UltimateOnlineMultiPlayer;
