import { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Account = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const [comfirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === comfirmPassword;
  return (
    <div
      className="min-h-[calc(100dvh-4rem)] bg-gray-950 flex flex-col 
    items-center justify-center px-4 py-8"
    >
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Tic-Tac-Toe
          </h1>
          <p className="text-gray-400"> Login or create an account with us </p>
        </div>
        <div className="grid grid-cols-2 bg-gray-900 p-1 rounded-xl mb-6">
          <button
            onClick={() => setActiveTab("login")}
            className={`py-3 rounded-lg font-semibold ${
              activeTab === "login"
                ? "bg-cyan-500 text-gray-950"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setActiveTab("register")}
            className={`py-3 rounded-lg font-semibold ${
              activeTab === "register"
                ? "bg-cyan-500 text-gray-950"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Register
          </button>
        </div>
        <form className="space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium
    text-gray-300 mb-2"
            >
              Email Address
            </label>
            <input
              type="email"
              id="login-email"
              name="email"
              placeholder="me@gmail.com"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-2"
            >
              {activeTab === "login" ? "Password" : "Create Password"}
            </label>
            <input
              type="password"
              value={password}
              id="password"
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={
                activeTab === "login" ? "current-password" : "new-password"
              }
              required
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
            />
          </div>
          {activeTab === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-2"
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={comfirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {comfirmPassword && !passwordsMatch && (
                <p className="text-red-500 text-sm mt-2">
                  Passwords do not match
                </p>
              )}
            </div>
          )}
          {activeTab === "login" && (
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label htmlFor="rememberMe" className="text-gray-300 text-sm">
                Remember Me
              </label>
            </div>
          )}
          <button
            type="submit"
            className="w-full py-3 bg-cyan-500 rounded-lg text-gray-950
    font-semibold hover:bg-cyan-600 transition-colors"
          >
            {activeTab === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="my-6 flex flex-col gap-4">
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 h-px bg-gray-700"></div>
            <span className="text-gray-500 text-sm">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-gray-700"></div>
          </div>

          <button
            type="button"
            className="w-full flex items-center justify-center
gap-3 py-3 bg-gray-900 border border-gray-700 rounded-lg text-white hover:bg-gray-800 transition-colors"
          >
            {" "}
            <FcGoogle />
            <span> Continue with Google </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Account;
