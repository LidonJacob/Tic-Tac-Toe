import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const registeredEmail = location.state?.email || "";

  const [code, setCode] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [resendCooldown, setResendCooldown] = useState(60);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setTimeout(() => {
      setResendCooldown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [resendCooldown]);

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
      if (error.response?.status === 400) {
        setAttempts((prev) => prev + 1);
      } else if (error.response?.status === 429) {
        setAttempts(5);
      }
      toast.error(error.response?.data?.message || "Failed to verify email");
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    try {
      const response = await api.post("/auth/resend-verification-code", {
        email: registeredEmail,
      });

      toast.success(response.data.message);
      setAttempts(0);
      setCode("");
      setResendCooldown(60);
    } catch (error) {
      if (error.response?.status === 429) {
        setResendCooldown(error.response.data.retryAfterSeconds);
      }
      toast.error(
        error.response?.data?.message || "Failed to resend verification code",
      );
    } finally {
      setIsResending(false);
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
        <p className="text-yellow-400 text-sm text-center mb-4">
          can't find email? Please check your spam or promotions folder
        </p>
        <p className="text-cyan-400 text-sm text-center mb-4">
          {registeredEmail}
        </p>
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Verification Code
          </label>

          <input
            type="text"
            inputMode="numeric"
            minLength={6}
            pattern="[0-9]{6}"
            maxLength={6}
            value={code}
            onChange={(e) =>
              setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Enter 6-digit code"
            required
            className="w-full px-4 py-2.5 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
          {attempts >= 5 && (
            <p className="text-red-400 text-sm mt-2">
              Too many incorrect attempts. Please request a new verification
              code.
            </p>
          )}
        </div>
        <button
          disabled={code.length !== 6 || attempts >= 5}
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 text-gray-950 font-semibold py-2.5 rounded-lg transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Verify Email
        </button>
        <button
          type="button"
          onClick={handleResendCode}
          disabled={resendCooldown > 0 || isResending}
          className="w-full mt-4 bg-gray-800 border border-cyan-500 text-cyan-400 hover:bg-cyan-500 
          hover:text-gray-950 font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
          disabled:hover:bg-gray-800 disabled:hover:text-cyan-400"
        >
          {resendCooldown > 0
            ? `Resend code in ${resendCooldown}s`
            : "Resend verification code"}
        </button>
      </form>
    </div>
  );
};

export default VerifyEmail;
