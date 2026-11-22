import { useState } from "react";
import api from "../services/api";
import { toast } from "react-toastify";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");

  const handleVerifyEmail = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post("/auth/verify-email", {
        email,
        code,
      });
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Email verification failed");
    }
  };
  return <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
    <form onSubmit={handleVerifyEmail} className="w-full max-w-md bg-gray-900 p-8 rounded-xl shadow-lg border border-gray-800">
      <h2 className="text-2xl font-bold text-white text-center mb-3"> Verify Your Email</h2>
      <p className="text-gray-400 text-sm text-center mb-6">Enter the 6-digit verification code sent to you email</p>
    </form>
  </div>;
};

export default VerifyEmail;
