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
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isSaving, setIsSaving] = useState(false);

  const hasChanges =
    username !== user?.username || email !== user?.email || avatar !== null;

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
        email,
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
  return (
    <div className="min-h-screen bg-gray-950 text-white flex justify-center items-center p-4 sm:p-6">
      <div
        className="w-full max-w-lg bg-gray-900 border
        bprder-gray-800 rounded-2xl p-5 sm:p-8 shadow-xl"
      >
        <h1 className="text-3xl font-bold mb-6 text-center">My Profile</h1>
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
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="enter Email"
                    className="w-full px-4 py-2 bg-gray-800 border border-cyan-500 rounded-lg
             text-white outline-none focus:ring-2 focus:ring-cyan-500"
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
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-700
            text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </>
          )}

          {!isEditing && (
            <p className="text-lg text-center">
              {" "}
              <strong>Username: </strong> {user.username}
            </p>
          )}

          {!isEditing && (
            <p className="text-lg text-center">
              {" "}
              <strong>Email: </strong> {user.email}
            </p>
          )}
        </div>
        {!isEditing && (
          <div className="flex justify-center">
            <button
              onClick={() => {
                setUsername(user.username);
                setEmail(user.email);
                setIsEditing(true);
              }}
              className="mt-4 px-5 py-2
      bg-cyan-500 rounded-lg hover:bg-cyan-600"
            >
              {" "}
              Edit Profile{" "}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
