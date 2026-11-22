import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const registeredEmail = location.state?.email || "";

  const [code, setCode] = useState("");

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/verify-email", {
        email: registeredEmail,
        code,
      });
      toast.success(response.data.message);
      navigate("/account");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email verification failed");
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      <form
        onSubmit={handleVerifyEmail}
        className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800"
      >
        <h2 className="text-2xl font-bold text-white text-center mb-3">
          {" "}
          Verify Your Email
        </h2>
        <p className="text-gray-400 text-sm text-center mb-6">
          Enter the 6-digit verification code sent to you email
        </p>
        <p className="text-cyan-400 text-sm text-center mb-4">{registeredEmail}</p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-semibold py-2.5 rounded-lg transition-colors"
        >
          Verify Email
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
