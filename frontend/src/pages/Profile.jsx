import { useAuth } from "../context/useAuth";
import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import { uploadAvatar } from "../services/cloudinary";
import compressImage from "../utils/compressImage";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const { user, loading, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isRequestingEmail, setIsRequestingEmail] = useState(false);
  const [isResendingEmail, setIsResendingEmail] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEmailChange = async (e) => {
    e.preventDefault();
    setIsRequestingEmail(true);

    try {
      const response = await api.post("/users/request-email-change", {
        newEmail,
      });

      setIsCodeSent(true);
      setResendCooldown(response.data.retryAfter);
      toast.success("Verification code sent to your new email");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to request email change",
      );
    } finally {
      setIsRequestingEmail(false);
    }
  };

  const handleResendEmailCode = async () => {
    setIsResendingEmail(true);

    try {
      const response = await api.post("/users/resend-email-change");
      setResendCooldown(response.data.retryAfter);

      toast.success(response.data.message);
    } catch (error) {
      if (error.response?.data?.retryAfter) {
        setResendCooldown(error.response.data.retryAfter);
      }
      toast.error(
        error.response?.data?.message || "Failed to resend verification code",
      );
    } finally {
      setIsResendingEmail(false);
    }
  };

  const handleCancelPassword = () => {
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setActiveSection("null");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error("Please fill in all password fields");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    setIsChangingPassword(true);

    try {
      const response = await api.post("/users/change-password", {
        currentPassword,
        newPassword,
      });

      toast.success(response.data.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setActiveSection("null");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);

    try {
      const response = await api.delete("/users/account", {
        data: { confirmation: deleteConfirmation },
      });

      toast.success(response.data.message);
      setUser(null);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete account");
    } finally {
      setIsDeleting(false);
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

  useEffect(() => {
    if (resendCooldown <= 0) return;

    const timer = setInterval(() => {
      setResendCooldown((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const fetchEmailChangeStatus = async () => {
      try {
        const response = await api.get("/users/email-change-status");

        if (response.data.hasPendingEmail) {
          setIsCodeSent(true);
          setNewEmail(response.data.pendingEmail);
          setResendCooldown(response.data.retryAfter);
        }
        setActiveSection("email");
      } catch (error) {
        console.error("Failed to retrieve email change status:", error);
      }
    };

    fetchEmailChangeStatus();
  }, []);
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
                      disabled={isRequestingEmail}
                      className="px-4 py-2 bg-cyan-500 text-gray-950 rounded-lg hover:bg-cyan-600
                      disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isRequestingEmail ? "Sending..." : "Continue"}
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
                       disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isVerifying ? "Verifying..." : "Verify"}
                    </button>
                    <button
                      type="button"
                      onClick={handleResendEmailCode}
                      disabled={isResendingEmail || resendCooldown > 0}
                      className="px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600
  disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {isResendingEmail ? "Sending..." : "Resend Code"}
                    </button>
                    {resendCooldown > 0 && (
                      <p className="text-sm text-gray-400 text-center">
                        You can request another code in {resendCooldown} s.
                      </p>
                    )}
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
          {activeSection === "password" && (
            <div className="bg-gray-800 border border-cyan-500/40 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold mb-3">Change Password</h2>
              <div className="flex flex-col gap-2">
                <label className="text-sm text-gray-300">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                    className="w-full pl-4 pr-12 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                  >
                    {showCurrentPassword ? (
                      <EyeOff size={20} />
                    ) : (
                      <Eye size={20} />
                    )}
                  </button>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-gray-300">New Password</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      required
                      className="w-full pl-4 pr-12 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                    >
                      {showNewPassword ? (
                        <EyeOff size={20} />
                      ) : (
                        <Eye size={20} />
                      )}
                    </button>
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm text-gray-300">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                        required
                        className="w-full pl-4 pr-12 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword((prev) => !prev)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-cyan-400"
                      >
                        {showConfirmPassword ? (
                          <EyeOff size={20} />
                        ) : (
                          <Eye size={20} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleChangePassword}
                  disabled={isChangingPassword}
                  className="px-5 py-2 bg-cyan-500 rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50"
                >
                  {isChangingPassword ? "Changing..." : "Change Password"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelPassword}
                  className="px-5 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-colors
                  "
                >
                  Cancel
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
          {activeSection === "delete" && (
            <div className="bg-gray-800 border border-red-500/40 rounded-xl p-5 w-full">
              <h2 className="text-lg font-semibold text-red-400 mb-3">
                Confirm Account Deletion
              </h2>

              <p className="text-gray-300 text-sm mb-3">
                Type DELETE below to confirm that you want to permanently delete
                your account.
              </p>

              <input
                type="text"
                value={deleteConfirmation}
                onChange={(e) => setDeleteConfirmation(e.target.value)}
                placeholder="Type DELETE"
                className="w-full px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-red-500"
              />
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteConfirmation !== "DELETE" || isDeleting}
                  className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-600
  disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isDeleting ? "Deleting..." : "Confirm Deletion"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteConfirmation("");
                    setActiveSection("null");
                  }}
                  className="px-5 py-2 bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  Cancel
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
