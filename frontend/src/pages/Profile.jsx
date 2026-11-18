import { useAuth } from "../context/useAuth";
import { useState } from "react";
const Profile = () => {
  const { user, loading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  if (loading) {
    return <p>Loading profile...</p>;
  }
  if (!user) {
    return <p>Please Log in to view your profile</p>;
  }
  return (
    <div className="min-h-screen bg-gray-950 text-white p-6">
      <h1 className="text-3xl font-bold mb-6">My Profile</h1>
      <div className="space-y-2">
        {user.avatar ? (
          <img
            src={user.avatar}
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
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="enter Username"
          />
        )}

        <p className="text-lg">
          {" "}
          <strong>Username: </strong> {user.username}
        </p>
        <p className="text-lg">
          {" "}
          <strong>Email: </strong> {user.email}
        </p>
      </div>
      <button
        onClick={() => {
          setUsername(user.username);
          setIsEditing(true);
        }}
        className="mt-4 px-5 py-2
      bg-cyan-500 rounded-lg hover:bg-cyan-600"
      >
        {" "}
        Edit Profile{" "}
      </button>
    </div>
  );
};

export default Profile;
