import {useNavigate} from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-[calc(100dvh-4rem)] bg-gray-950 flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-7xl font-extrabold text-cyan-400 mb-4"> 404 </h1>
      <h2 className="text-2xl font-bold text-white mb-3">Page Not Found</h2>
      <p className="text-gray-400 max-w-md mb-8">The page you are looking for does not exist</p>
      <button onClick={() => navigate("/")} className="bg-cyan-500 hover:bg-cyan-400 text-gray-950
      font-bold px-8 py-3 rounded-xl transition-colors">
        Back to Home
      </button>
    </div>
  );
};

export default NotFound;
