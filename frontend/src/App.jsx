import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import History from "./pages/History";
import NotFound from "./pages/NotFound";
import Navbar from "./components/Navbar";
import Account from "./pages/Account";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./pages/Profile";
import OnlineMultiplayer from "./pages/OnlineMultiplayer";
import VerifyEmail from "./pages/VerifyEmail";
import UltimateGame from "./ultimate-tic-tac-toe/pages/UltimateGame";

function App() {
  return (
    <div>
      <Navbar />
      <ToastContainer position="top-right" autoClose={2000} theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/game" element={<Game />} />
        <Route path="/online" element={<OnlineMultiplayer />} />
        <Route path="/history" element={<History />} />
        <Route path="/account" element={<Account />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/ultimate-game" element={<UltimateGame />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
