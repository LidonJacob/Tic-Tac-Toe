import { socket } from "../socket/socket";
import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";

const OnlineMultiplayer = () => {
  const { user, loading } = useAuth();
  const [connectionStatus, setConnectionStatus] = useState("disconnected");

  useEffect(() => {
    if (loading || !user) return;

    socket.connect();

    socket.on("connect", () => {
      setConnectionStatus("connected");
    });

    socket.on("connect_error", () => {
      setConnectionStatus("disconnected");
    });

    return () => {
      socket.off("connect");
      socket.off("connect_error");
      socket.disconnect();
    };
  }, [user, loading]);
  return (
    <div>
      <h1>Online Multiplayer</h1>
      {loading && <p>Checking Authentication...</p>}

      {!loading && !user && <p> please login to play online</p>}

      {!loading && user && connectionStatus === "disconnected" && (
        <p>Connecting to the game server...</p>
      )}

      {!loading && user && connectionStatus === "connected" && (
        <p>Connected! Looking for an opponent...</p>
      )}

      {!loading && user && connectionStatus === "error" && (
        <p>Unable to connect to the game server. Please try again.</p>
      )}
    </div>
  );
};

export default OnlineMultiplayer;
