import { socket } from "../socket/socket";
import { useEffect } from "react";
import { useAuth } from "../context/useAuth";

const OnlineMultiplayer = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user) return;

    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, [user, loading]);
  return (
    <div>
      <h1>Online Multiplayer</h1>
      {loading && <p>Checking Authentication...</p>}

      {!loading && !user && <p> please login to play online</p>}

      {!loading && user && <p>Connecting to the game server...</p>}
    </div>
  );
};

export default OnlineMultiplayer;
