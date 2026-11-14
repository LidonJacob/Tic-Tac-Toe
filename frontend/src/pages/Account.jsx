import { useState } from "react";

const Account = () => {
  const [activeTab, setActiveTab] = useState("login");
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
          {activeTab === "login" && (
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
                placeholder="Enter Your Email"
                autoComplete="email"
                required
                className="w-full px-4 py-3 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
              />
            </div>
          )}
          <div>
            <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300 mb-2">
              Password
              </label>
              <input type="password" id="password" name="password" autoComplete="current-password" required 
              className="w-full px-4 py-3 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"/>
            
          </div>
        </form>
      </div>
    </div>
  );
};

export default Account;
