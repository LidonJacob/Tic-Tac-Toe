import { Link } from "react-router-dom";
import { House, Gamepad2, History, UserRound } from "lucide-react";
import { useAuth } from "../context/useAuth";

const Navbar = () => {
  const { user, loading } = useAuth();
  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-3 sm:px-6 py-4 flex items-center justify-between">
      {!loading && user ? (
        <Link to="/profile" title="View Profile" className="flex items-center gap-2">
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
            />
          ) : (
            <UserRound size={28} className="text-cyan-400" />
          )}
          <span className="text-white font-medium hidden sm:inline">{user.username}</span>
        </Link>
      ) : (
        <div className="text-lg sm:text-2xl whitespace-nowrap font-bold text-cyan-400">
          Tic-Tac-Toe
        </div>
      )}
      <div className="flex items-center gap-3 sm:gap-6">
        <Link
          to={"/account"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <UserRound size={18} />
          <span className="hidden sm:inline">Account </span>
        </Link>
        <Link
          to={"/"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <House size={18} />
          <span className="hidden sm:inline">Home</span>
        </Link>

        <Link
          to={"/game"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <Gamepad2 size={18} />
          <span className="hidden sm:inline">Play</span>
        </Link>
        <Link
          to={"/history"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <History size={18} />
          <span className="hidden sm:inline">History</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
