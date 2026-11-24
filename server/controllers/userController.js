import User from "../models/User.js";
import Game from "../models/Game.js";
import { generateVerificationCode } from "../utils/tokenUtils.js";
import { sendEmail } from "../utils/sendEmail.js";
import { createHmac, timingSafeEqual } from "crypto";
import bcrypt from "bcrypt";
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

    const { verificationCode, codeHash } = generateVerificationCode();

    user.pendingEmailVerificationCodeHash = codeHash;
    user.pendingEmailVerificationCodeExpires = new Date(
      Date.now() + 10 * 60 * 1000,
    );

    user.pendingEmailVerificationAttempts = 0;
    user.pendingEmailVerificationLastSentAt = new Date();

    await user.save();

    try {
      await sendEmail(
        normalizedEmail,
        "Verify your email address",
        `<h2>Email Change Verification</h2>
    <p>Your Verification Code is </p>
    <h1>${verificationCode}</h1>
    <p>This code is valid for 10 minutes</p>`,
      );
    } catch (error) {
      user.pendingEmail = null;
      user.pendingEmailVerificationCodeHash = null;
      user.pendingEmailVerificationCodeExpires = null;
      user.pendingEmailVerificationAttempts = 0;
      user.pendingEmailVerificationLastSentAt = null;

      await user.save();

      throw error;
    }

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

export const verifyEmailChange = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code) {
      return res.status(400).json({
        message: "Verification code is required",
      });
    }

    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        message: "Verification code must be 6 digits",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user || !user.pendingEmail) {
      return res.status(400).json({
        message: "No pending email change found",
      });
    }

    if (
      !user.pendingEmailVerificationCodeHash ||
      !user.pendingEmailVerificationCodeExpires ||
      user.pendingEmailVerificationCodeExpires < new Date()
    ) {
      return res.status(400).json({
        message: "invalid or expired verification code",
      });
    }

    if (user.pendingEmailVerificationAttempts >= 5) {
      user.pendingEmailVerificationCodeHash = null;
      user.pendingEmailVerificationCodeExpires = null;

      await user.save();

      return res.status(429).json({
        message: "Too many attempts. Please request a new verification code.",
      });
    }

    const submittedCodeHash = createHmac(
      "sha256",
      process.env.EMAIL_VERIFICATION_SECRET,
    )
      .update(code)
      .digest("hex");

    const storedHashBuffer = Buffer.from(
      user.pendingEmailVerificationCodeHash,
      "hex",
    );

    const submittedHashBuffer = Buffer.from(submittedCodeHash, "hex");

    const isCodeValid =
      storedHashBuffer.length === submittedHashBuffer.length &&
      timingSafeEqual(storedHashBuffer, submittedHashBuffer);

    if (!isCodeValid) {
      user.pendingEmailVerificationAttempts += 1;

      if (user.pendingEmailVerificationAttempts >= 5) {
        user.pendingEmailVerificationCodeHash = null;
        user.pendingEmailVerificationCodeExpires = null;

        await user.save();

        return res.status(429).json({
          message: "Too many attempts. Please request a new verification code.",
        });
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid or expired verification code",
        attemptsRemaining: 5 - user.pendingEmailVerificationAttempts,
      });
    }
    user.email = user.pendingEmail;
    user.emailVerified = true;

    user.pendingEmail = null;
    user.pendingEmailVerificationCodeHash = null;
    user.pendingEmailVerificationCodeExpires = null;
    user.pendingEmailVerificationAttempts = 0;
    user.pendingEmailVerificationSentAt = null;
    user.pendingEmailVerificationLastSentAt = null;

    await user.save();

    return res.status(200).json({
      message: "Email address updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Verify email change error:", error.message);

    return res.status(500).json({
      message: "Something went wrong while verifying email change",
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (
      typeof currentPassword !== "string" ||
      typeof newPassword !== "string" ||
      !currentPassword ||
      !newPassword
    ) {
      return res.status(400).json({
        message: "Please provide both current and new passwords",
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters long",
      });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (!user.password) {
      return res.status(400).json({
        message:
          "This account has no set user password. Please use Google login",
      });
    }

    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        message: "current password is incorrect",
      });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.password);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as the current password",
      });
    }

    user.password = await bcrypt.hash(newPassword, 10);

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Error changing password:", error);
    return res.status(500).json({
      message: "Something went wrong while changing password",
    });
  }
};

export const deleteAccount = async (req, res) => {
  try {
    if (req.body.confirmation !== "DELETE") {
      return res.status(400).json({
        message: "Please confirm you want to delete your account",
      });
    }
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await Game.deleteMany({ "players.user": req.user._id });

    await user.deleteOne();

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting account:", error);

    return res.status(500).json({
      message: "Something went wrong while deleting account",
    });
  }
};
