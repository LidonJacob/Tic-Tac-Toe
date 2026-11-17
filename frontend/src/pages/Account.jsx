import { useState, useEffect } from "react";
import { FcGoogle } from "react-icons/fc";
import { uploadAvatar } from "../services/cloudinary";
import api from "../services/api";

const Account = () => {
  const [activeTab, setActiveTab] = useState("login");
  const [rememberMe, setRememberMe] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const passwordsMatch = password === confirmPassword;
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email");
  
    const password = formData.get("password");
    

    
    try {
      if (activeTab === "register") {
        let avatarUrl = "";

        await api.post("/auth/register", {
          email,
          username,
          password,
          avatarUrl,
        });

        if (avatar) {
          avatarUrl = await uploadAvatar(avatar);
        }
      } else {
        await api.post("/auth/login", {
          email,
          password,
        });

        
      }
    } catch (error) {
      console.error("Authentication error:", error);
      alert("something went wrong please try again");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAvatarChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedImage.type)) {
      alert("Please select a valid image file");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      alert("Image size should not exceed 5MB");
      return;
    }

    setAvatar(selectedImage);
    setAvatarPreview(URL.createObjectURL(selectedImage));
  };

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);
  return (
    <div
      className="min-h-[calc(100dvh-4rem)] bg-gray-950 flex flex-col 
    items-center justify-center px-4 py-3"
    >
      <div className="w-full max-w-md ">
        <div className="text-center mb-4">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome to Tic-Tac-Toe
          </h1>
          <p className="text-gray-400"> Login or create an account with us </p>
        </div>
        <div className="grid grid-cols-2 bg-gray-900 p-1 rounded-xl mb-4">
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
        <form onSubmit={handleSubmit} className="space-y-3">
          {activeTab === "register" && (
            <div className="flex flex-col items-center gap-3">
              <label
                htmlFor="avatar"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Profile Picture
              </label>

              <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
              <label htmlFor="avatar" className="cursor-pointer">
                {avatarPreview ? (
                  <img
                    src={avatarPreview}
                    alt="Profile preview"
                    className="w-28 h-28 rounded-full object-cover border-2 border-cyan-500"
                  />
                ) : (
                  <div className="w-28 h-28 rounded-full bg-gray-900 border-2 border-gray-700 flex items-center justify-center">
                    <span className="text-gray-500 text-3xl">?</span>
                  </div>
                )}
              </label>
              <label
                htmlFor="avatar"
                className="px-4 py-2 bg-cyan-500 text-gray-950 text-sm font-semibold
    rounded-lg cursor-pointer hover:bg-cyan-600 transition-colors"
              >
                choose photo
              </label>
              <p className="text-xs text-gray-500">JPG, PNG or WEBP</p>
            </div>
          )}
          <div>
            <label
              htmlFor="login-email"
              className="block text-sm font-medium
    text-gray-300 mb-1"
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
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
            />
          </div>
          {activeTab === "register" && (
            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                {" "}
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
                required
              />
            </div>
          )}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300 mb-1"
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
              className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700
    rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500
    transition-colors"
            />
          </div>
          {activeTab === "register" && (
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-300 mb-1"
              >
                Confirm Password
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                id="confirmPassword"
                name="confirmPassword"
                autoComplete="new-password"
                required
                className="w-full px-4 py-2.5 bg-gray-900 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors"
              />
              {confirmPassword && !passwordsMatch && (
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
                name="remember-me"
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
            disabled={
              activeTab === "register" && (!confirmPassword || !passwordsMatch)
            }
            className="w-full py-3 bg-cyan-500 rounded-lg text-gray-950
    font-semibold hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {activeTab === "login" ? "Login" : "Register"}
          </button>
        </form>
        <div className="my-3 flex flex-col gap-3">
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
