import User from "../models/User.js";
import { generateVerificationCode } from "../utils/tokenUtils.js";
import { createHmac } from "crypto";
import { sendEmail } from "../utils/sendEmail.js";

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
      return res.status(400).json({
        message: "Please use the email change process to update your email",
      });
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

export const requestEmailChange = async (req, res) => {
  try {
    const { newEmail } = req.body;

    if (!newEmail) {
      return res
        .status(400)
        .json({ message: "Please provide a new email address" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(newEmail)) {
      return res.status(400).json({
        message: "Please provide a valid email address",
      });
    }

    const normalizedEmail = newEmail.toLowerCase().trim();

    if (normalizedEmail === req.user.email) {
      return res.status(400).json({
        message: "This is already your email address",
      });
    }

    const existingUser = await User.findOne({ email: normalizedEmail });

    if (existingUser) {
      return res.status(409).json({
        message: "This email address is already registered",
      });
    }

    const pendingEmailUser = await User.findOne({
      pendingEmail: normalizedEmail,
    });

    if (pendingEmailUser) {
      return res.status(409).json({
        message: "This email address is already pending verification",
      });
    }

    const user = await User.findById(req.user._id);
    user.pendingEmail = normalizedEmail;

    const verificationCode = generateVerificationCode();

    const codeHash = createHmac("sha256", process.env.EMAIL_VERIFICATION_SECRET)
      .update(verificationCode)
      .digest("hex");

    user.pendingEmailVerificationCodeHash = codeHash;
    user.pendingEmailVerificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    user.pendingEmailVerificationAttempts = 0;
    user.pendingEmailVerificationLastSentAt = new Date();

    await user.save();

    await sendEmail(
      normalizedEmail,
      "Verify your email address",
      `<h2>Email Change Verification</h2>
    <p>Your Verification Code is </p>
    <h1>${verificationCode}</h1>
    <p>This code is valid for 10 minutes</p>`,
    );

    res.status(200).json({
      message: "A verification code has been sent to your new email address",
    });
  } catch (error) {
    console.error("Request email change error:", error.message);
    res
      .status(500)
      .json({ message: "something went wrong while requesting email change" });
  }
};
