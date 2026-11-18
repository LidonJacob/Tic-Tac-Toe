import User from "../models/User.js";

export const getUserProfile = (req, res) => {
  res.status(200).json({ user: req.user });
};

export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (req.body.username !== undefined) {
      if (typeof req.body.username !== "string" || !req.body.username.trim()) {
        return res.status(400).json({
          message: "Username cannot be empty",
        });
      }

      user.username = req.body.username.trim();
    }
    if (req.body.email !== undefined) {
      const email = req.body.email.trim().toLowerCase();

      if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({
          message: "Please provide a valid email address",
        });
      }

      user.email = email;
    }

    if (req.body.avatar) {
      user.avatar = req.body.avatar;
    }
    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error.message);
    if (error.code === 11000) {
      if (error.keyPattern?.email) {
        return res.status(409).json({
          message: "Email is already registered",
        });
      }

      return res.status(409).json({
        message: "Username already exists",
      });
    }
    res.status(500).json({ message: "server error while updating user" });
  }
};
