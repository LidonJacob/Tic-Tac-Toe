import { Link, useNavigate } from "react-router-dom";
import {
  House,
  Gamepad2,
  History,
  UserRound,
  LogOut,
  LogIn,
} from "lucide-react";
import { useAuth } from "../context/useAuth";
import { toast } from "react-toastify";

const Navbar = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
      toast.error("Logout failed, please try again");
    }
  };
  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-3 sm:px-6 py-4 flex items-center justify-between">
      {!loading && user ? (
        <Link
          to="/profile"
          title="View Profile"
          className="flex items-center gap-2"
        >
          {user.avatar ? (
            <img
              src={user.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
            />
          ) : (
            <UserRound size={28} className="text-cyan-400" />
          )}
          <span className="text-gray-300 font-medium hidden sm:inline hover:text-cyan-400 transition-colors duration-200">
            Account Settings
          </span>
        </Link>
      ) : (
        <div className="text-lg sm:text-2xl whitespace-nowrap font-bold text-cyan-400">
          Tic-Tac-Toe
        </div>
      )}
      <div className="flex items-center gap-3 sm:gap-6">
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
        {!loading &&
          (user ? (
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-300 hover:text-red-400 transition-colors duration-200 font-medium"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          ) : (
            <Link
              to="/account"
              className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
            >
              <LogIn size={18} />
              <span className="hidden sm:inline">Login</span>
            </Link>
          ))}
      </div>
    </nav>
  );
};

export default Navbar;
