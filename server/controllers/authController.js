import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { sendEmail } from "../utils/sendEmail.js";
import { generateVerificationCode } from "../utils/tokenUtils.js";
import { createHmac, timingSafeEqual } from "crypto";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 88 characters long" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { verificationCode, codeHash } = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
      emailVerified: false,
      emailVerificationCodeHash: codeHash,
      emailVerificationCodeExpires: expiresAt,
    });

    const emailHtml = `<h2> Welcome to TicTacToe! </h2>
    <p> Your email verification code is: </p>
    <h1> ${verificationCode} </h1>
    <p> This code expires in 10 minutes </p>`;

    await sendEmail(email, "Verify your TicTacToe account", emailHtml);
    user.emailVerificationLastSentAt = new Date();

    await user.save();

    res.status(201).json({
      message:
        "Registration successful! please check your email to verify your account",
    });
  } catch (error) {
    console.error("Register user error:", error.message);

    return res
      .status(500)
      .json({ message: "server error during registration" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    if (!user.emailVerified) {
      return res
        .status(403)
        .json({ message: "Please verify your email before login" });
    }

    if (!user.password) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "invalid email or password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: rememberMe ? "7d" : "1d",
    });

    const { maxAge, ...sessionCookieOptions } = cookieOptions;
    res.cookie(
      "token",
      token,
      rememberMe ? cookieOptions : sessionCookieOptions,
    );

    res.status(200).json({
      message: "login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Login user error:", error.message);

    return res.status(500).json({ message: "server error during login" });
  }
};

export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).json({ message: "Google credential is required" });
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();

    const { email, email_verified, name, picture } = payload;

    if (!email || !email_verified) {
      return res
        .status(401)
        .json({ message: "Google account email is not verified" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      const baseUsername =
        (name || normalizedEmail.split("@")[0])
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "") || "googleuser";
      let username = baseUsername;
      let counter = 1;

      while (await User.findOne({ username })) {
        username = `${baseUsername}${counter}`;
        counter++;
      }

      user = await User.create({
        username,
        email: normalizedEmail,
        avatar: picture || "",
        emailVerified: true,
      });
    }

    if (!user.emailVerified) {
      user.emailVerified = true;
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, cookieOptions);

    return res.status(200).json({
      message: "Google Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Google auth error:", error.message);

    return res.status(500).json({ message: "Google auth failed" });
  }
};

export const logoutUser = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });

  res.status(200).json({ message: "logout successful" });
};

export const verifyEmail = async (req, res) => {
  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res
        .status(400)
        .json({ message: "Email and verification code are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user || user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    if (
      !user.emailVerificationCodeHash ||
      !user.emailVerificationCodeExpires ||
      user.emailVerificationCodeExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    if (user.emailVerificationAttempts >= 5) {
      user.emailVerificationCodeHash = null;
      user.emailVerificationCodeExpires = null;

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

    const storedHashBuffer = Buffer.from(user.emailVerificationCodeHash, "hex");

    const submittedHashBuffer = Buffer.from(submittedCodeHash, "hex");

    const isCodeValid =
      storedHashBuffer.length === submittedHashBuffer.length &&
      timingSafeEqual(storedHashBuffer, submittedHashBuffer);

    if (!isCodeValid) {
      user.emailVerificationAttempts += 1;

      if (user.emailVerificationAttempts >= 5) {
        user.emailVerificationCodeHash = null;
        user.emailVerificationCodeExpires = null;

        await user.save();

        return res.status(429).json({
          message: "Too many attempts. Please request a new verification code.",
        });
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid or expired verification code",
        attemptsRemaining: 5 - user.emailVerificationAttempts,
      });
    }

    user.emailVerified = true;
    user.emailVerificationCodeHash = null;
    user.emailVerificationCodeExpires = null;
    user.emailVerificationAttempts = 0;

    await user.save();

    return res
      .status(200)
      .json({ message: "Email verified successfully you can now login" });
  } catch (error) {
    console.error("Error verifying email:", error.message);
    return res
      .status(500)
      .json({ message: "server error while verifying email" });
  }
};

export const resendVerificationCode = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user) {
      return res.status(404).json({ message: "Account not found" });
    }

    if (user.emailVerified) {
      return res
        .status(400)
        .json({ message: "Email already verified. Please login" });
    }

    if (
      user.emailVerificationLastSentAt &&
      Date.now() - user.emailVerificationLastSentAt.getTime() < 60 * 1000
    ) {
      const elapsedTime =
        Date.now() - user.emailVerificationLastSentAt.getTime();
      const retryAfterSeconds = math.ceil((60000 - elapsedTime) / 1000);

      return res.status(429).json({
        message:
          "Please wait 1 minute before requesting a new verification code",
        retryAfterSeconds,
      });
    }

    const { verificationCode, codeHash } = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    user.emailVerificationCodeHash = codeHash;
    user.emailVerificationCodeExpires = expiresAt;
    user.emailVerificationAttempts = 0;

    await user.save();

    const emailHtml = `<h2> Welcome To TicTacToe!</h2>
    <p> Your new verification code is</p>
    <h1>${verificationCode}</h1>
    <p>This Code expires in 10 minutes</p>`;

    await sendEmail(user.email, "TicTacToe Verification Code", emailHtml);

    user.emailVerificationLastSentAt = new Date(Date.now());

    await user.save();

    return res
      .status(200)
      .json({ message: "A new verification code has been sent to your email" });
  } catch (error) {
    console.error("Error resending verification code:", error.message);
    return res
      .status(500)
      .json({ message: "server error while resending verification code" });
  }
};
