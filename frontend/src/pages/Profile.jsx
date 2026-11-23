import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { uploadAvatar } from "../services/cloudinary";
import compressImage from "../utils/compressImage";


const Profile = () => {
  const { user, loading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleEmailChange = async (e) => {
    e.preventDefault();

    try {
      await api.post("/users/request-email-change", {
        newEmail,
      });

      setIsCodeSent(true);
      toast.success("Verification code sent to your new email");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to request email change",
      );
    }
  };
  const handleVerifyEmailChange = async (e) => {
    e.preventDefault();
    setIsVerifying(true);
    try {
      const response = await api.post("/users/verify-email-change", {
        code: verificationCode,
      });

      setUser(response.data.user);
      toast.success(response.data.message);
      setIsCodeSent(false);
      setVerificationCode("");
      setNewEmail("");
      setActiveSection("null");
    } catch (error) {
      toast.error(error.response?.data?.message || "Email verification failed");
    } finally {
      setIsVerifying(false);
    }
  };

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] = useState("null");

  const hasChanges = username !== user?.username || avatar !== null;

  const handleAvatarChange = (e) => {
    const selectedImage = e.target.files[0];

    if (!selectedImage) {
      return;
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(selectedImage.type)) {
      toast.error("Please select a valid image file");
      return;
    }

    if (selectedImage.size > 5 * 1024 * 1024) {
      toast.error("Image size should not exceed 5MB");
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
  const handleSave = async () => {
    try {
      setIsSaving(true);
      let avatarUrl = user.avatar;

      if (avatar) {
        const compressedAvatar = await compressImage(avatar);
        avatarUrl = await uploadAvatar(compressedAvatar);
      }

      const response = await api.patch("/users/profile", {
        username,
        avatar: avatarUrl,
      });

      setUser(response.data.user);
      setIsEditing(false);
      setAvatar(null);
      setAvatarPreview(null);

      toast.success("Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <p>Loading profile...</p>;
  }
  if (!user) {
    return <p>Please Log in to view your profile</p>;
  }

  const handleCancel = () => {
    setUsername(user.username);
    setEmail(user.email);
    setAvatar(null);
    setAvatarPreview(user.avatar || "");
    setIsEditing(false);
    setActiveSection("null");
  };
  return (
    <div className="min-h-[calc(100dvh-60px)] bg-gray-950 text-white flex justify-center items-center p-4 sm:p-6">
      <div
        className="w-full max-w-2xl bg-gray-900 border
        border-gray-800 rounded-2xl p-5 sm:p-8 space-y-6 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">
          Account Settings
        </h1>
        <div className="flex flex-col items-center gap-4">
          {avatarPreview || user.avatar ? (
            <img
              src={avatarPreview || user.avatar}
              alt="Profile avatar"
              className="w-28 h-28 rounded-full object-cover"
            />
          ) : (
            <div className="w-28 h-28 rounded-full bg-gray-700 flex items-center justify-center">
              <span className="text-3xl font-bold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          {isEditing && (
            <label className="inline-block cursor-pointer px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg hover:bg-gray-700 transition-colors">
              Choose Avatar
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          )}
          {isEditing && (
            <>
              <div className=" w-full max-w-md flex flex-col gap-2">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    {" "}
                    UserName{" "}
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="enter Username"
                    className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg
             text-white outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-gray-300">
                    {" "}
                    Email{" "}
                  </label>
                  <input
                    type="email"
                    value={email}
                    readOnly
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter Email"
                    className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg
             text-white outline-none focus:ring-2 focus:ring-cyan-500 read-only:opacity-60
             read-only:cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={handleSave}
                  disabled={isSaving || !hasChanges}
                  className="px-4 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors
                disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isSaving ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 bg-gray-700
            text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {!isEditing && (
            <div
              className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 w-full flex flex-col
            gap-3"
            >
              <h2 className="text-lg font-semibold text-white mb-4">
                Profile Information
              </h2>

              <p className="text-lg text-gray-300 mb-1">
                <strong>Username: </strong> {user.username}
              </p>

              <p className="text-lg text-gray-300">
                <strong>Email: </strong> {user.email}
              </p>

              <div className="flex justify-center">
                <button
                  onClick={() => {
                    setUsername(user.username);
                    setEmail(user.email);
                    setActiveSection("profile");
                    setIsEditing(true);
                  }}
                  className="px-5 py-2
      bg-cyan-500 rounded-lg hover:bg-cyan-600"
                >
                  {" "}
                  Edit Profile{" "}
                </button>
              </div>
            </div>
          )}

          {!isEditing && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold text-white mb-3">
                Email Address
              </h2>
              <p className="text-gray-400 text-sm">
                Manage the email address associated with your account.
              </p>
              <p className="text-gray-300 mt-3">{user.email}</p>
              <div className="flex justify-center">
                <button
                  onClick={() => setActiveSection("email")}
                  className="px-5 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Change Email
                </button>
              </div>
            </div>
          )}

          {activeSection === "email" && (
            <div className="bg-gray-800 border border-cyan-500/40 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold mb-3">
                Change Email Address
              </h2>
              {!isCodeSent && (
                <form
                  onSubmit={handleEmailChange}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">
                      New Email Address
                    </label>

                    <input
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      placeholder="Enter your new email"
                      required
                      className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                  </div>

                  <div className="flex gap-3">
                    <button
                      type="submit"
                      className="px-4 py-2 bg-cyan-500 text-gray-950 rounded-lg hover:bg-cyan-600"
                    >
                      Continue
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setActiveSection("null");
                        setNewEmail("");
                      }}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
              {isCodeSent && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">
                    Verify Your New Email
                  </h3>
                  <form
                    onSubmit={handleVerifyEmailChange}
                    className="flex flex-col gap-4"
                  >
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">
                        Verification Code
                      </label>

                      <input
                        type="text"
                        value={verificationCode}
                        onChange={(e) => setVerificationCode(e.target.value)}
                        placeholder="Enter 6-digit code"
                        maxLength={6}
                        required
                        className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isVerifying}
                      className="px-4 py-2 bg-cyan-500 text-gray-950 rounded-lg hover:bg-cyan-600
                      disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </button>
                  </form>
                </div>
              )}
            </div>
          )}

          {!isEditing && (
            <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold text-white mb-3">
                Password & Security
              </h2>
              <p className="text-gray-400 text-sm">
                Manage your account password and security.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setActiveSection("password")}
                  className="px-5 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors"
                >
                  Change Password
                </button>
              </div>
            </div>
          )}
          {!isEditing && (
            <div className="bg-gray-800/50 border border-red-900/50 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold text-red-400 mb-3">
                Delete Account
              </h2>
              <p className="text-gray-400 text-sm">
                Permanently delete your account and associated game history.
                This action cannot be undone.
              </p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setActiveSection("delete")}
                  className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete My Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
