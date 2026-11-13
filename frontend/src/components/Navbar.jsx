import { Link } from "react-router-dom";
import { House, Gamepad2, History, UserRound } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="sticky top-0 z-50 bg-gray-950 border-b border-gray-800 px-3 sm:px-6 py-4 flex items-center justify-between">
      <div className="text-lg sm:text-2xl whitespace-nowrap font-bold text-cyan-400">Tic-Tac-Toe</div>
      <div className="flex items-center gap-3 sm:gap-6">
        <Link
          to={"/account"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium">
          <UserRound size={18} />
          Account</Link>
        <Link
          to={"/"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <House size={18} />
          Home
        </Link>

        <Link
          to={"/game"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <Gamepad2 size={18} />
          Play
        </Link>
        <Link
          to={"/history"}
          className="flex items-center gap-2 text-gray-300 hover:text-cyan-400 transition-colors duration-200 font-medium"
        >
          <History size={18} />
          History
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
