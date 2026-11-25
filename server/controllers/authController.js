import User from "../models/User.js";
import PendingRegistration from "../models/pendingRegistration.js";
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
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;

    if (
      typeof username !== "string" ||
      typeof email !== "string" ||
      typeof password !== "string" ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedUsername = username.trim();
    const normalizedEmail = email.toLowerCase().trim();

    if (password.length < 8) {
      return res
        .status(400)
        .json({ message: "Password must be at least 8 characters long" });
    }

    const [existingUser, existingPending] = await Promise.all([
      User.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
      }),
      PendingRegistration.findOne({
        $or: [{ username: normalizedUsername }, { email: normalizedEmail }],
      }),
    ]);

    if (existingUser || existingPending) {
      return res.status(409).json({
        message: "Username or email already exists",
      });
    }

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const { verificationCode, codeHash } = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const pendingRegistration = await PendingRegistration.create({
      username: normalizedUsername,
      email: normalizedEmail,
      password: hashedPassword,
      avatar,
      emailVerificationCodeHash: codeHash,
      emailVerificationCodeExpires: expiresAt,
      emailVerificationAttempts: 0,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
    });

    const emailHtml = `<h2> Welcome to TicTacToe! </h2>
    <p> Your email verification code is: </p>
    <h1> ${verificationCode} </h1>
    <p> This code expires in 10 minutes </p>`;

    await sendEmail(
      normalizedEmail,
      "Verify your HavenPlay account",
      emailHtml,
    );

    pendingRegistration.emailVerificationLastSentAt = new Date();

    await pendingRegistration.save();

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

    if (
      typeof email !== "string" ||
      typeof password !== "string" ||
      !email.trim() ||
      !password
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

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
      expiresIn: rememberMe === true ? "7d" : "1d",
    });

    const { maxAge, ...sessionCookieOptions } = cookieOptions;
    res.cookie(
      "token",
      token,
      rememberMe === true ? cookieOptions : sessionCookieOptions,
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
    const { credential, mode } = req.body;

    if (!["login", "register"].includes(mode)) {
      return res
        .status(400)
        .json({ message: "Invalid Google Authentication mode" });
    }

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

    if (mode === "login" && !user) {
      return res.status(404).json({
        message: "No account found. Please register first.",
      });
    }

    if (mode === "register" && user) {
      return res.status(409).json({
        message: "An account already exists. Please login instead.",
      });
    }

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
    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
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

    if (typeof code !== "string" || !/^\d{6}$/.test(code)) {
      return res.status(400).json({
        message: "Verification code must be 6 digits",
      });
    }

    const normalizedEmail = email.toLowerCase().trim();

    const pendingRegistration = await PendingRegistration.findOne({
      email: normalizedEmail,
    });

    if (!pendingRegistration) {
      return res.status(400).json({
        message: "Invalid or expired verification code",
      });
    }

    if (
      !pendingRegistration.emailVerificationCodeHash ||
      !pendingRegistration.emailVerificationCodeExpires ||
      pendingRegistration.emailVerificationCodeExpires < new Date()
    ) {
      return res
        .status(400)
        .json({ message: "Invalid or expired verification code" });
    }

    if (pendingRegistration.emailVerificationAttempts >= 5) {
      pendingRegistration.emailVerificationCodeHash = null;
      pendingRegistration.emailVerificationCodeExpires = null;

      await pendingRegistration.save();

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
      pendingRegistration.emailVerificationCodeHash,
      "hex",
    );

    const submittedHashBuffer = Buffer.from(submittedCodeHash, "hex");

    const isCodeValid =
      storedHashBuffer.length === submittedHashBuffer.length &&
      timingSafeEqual(storedHashBuffer, submittedHashBuffer);

    if (!isCodeValid) {
      user.emailVerificationAttempts += 1;

      if (!isCodeValid) {
        pendingRegistration.emailVerificationAttempts += 1;

        if (pendingRegistration.emailVerificationAttempts >= 5) {
          pendingRegistration.emailVerificationCodeHash = null;
          pendingRegistration.emailVerificationCodeExpires = null;

          await pendingRegistration.save();

          return res.status(429).json({
            message:
              "Too many attempts. Please request a new verification code.",
          });
        }

        await pendingRegistration.save();

        return res.status(400).json({
          message: "Invalid or expired verification code",
          attemptsRemaining: 5 - pendingRegistration.emailVerificationAttempts,
        });
      }

      await user.save();

      return res.status(400).json({
        message: "Invalid or expired verification code",
        attemptsRemaining: 5 - user.emailVerificationAttempts,
      });
    }

    await User.create({
      username: pendingRegistration.username,
      email: pendingRegistration.email,
      password: pendingRegistration.password,
      avatar: pendingRegistration.avatar,
      emailVerified: true,
    });

    await PendingRegistration.deleteOne({
      _id: pendingRegistration._id,
    });

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

    const pendingRegistration = await PendingRegistration.findOne({
      email: email.toLowerCase().trim(),
    });

    if (!pendingRegistration) {
      return res.status(404).json({
        message: "Pending registration not found",
      });
    }

    if (
      pendingRegistration.emailVerificationLastSentAt &&
      Date.now() - pendingRegistration.emailVerificationLastSentAt.getTime() <
        60 * 1000
    ) {
      const elapsedTime =
        Date.now() - pendingRegistration.emailVerificationLastSentAt.getTime();

      const retryAfterSeconds = Math.ceil((60000 - elapsedTime) / 1000);

      return res.status(429).json({
        message:
          "Please wait 1 minute before requesting a new verification code",
        retryAfterSeconds,
      });
    }

    const { verificationCode, codeHash } = generateVerificationCode();

    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    pendingRegistration.emailVerificationCodeHash = codeHash;
    pendingRegistration.emailVerificationCodeExpires = expiresAt;
    pendingRegistration.emailVerificationAttempts = 0;

    await pendingRegistration.save();

    const emailHtml = `<h2>Welcome to HavenPlay!</h2>
<p>Your new verification code is:</p>
<h1>${verificationCode}</h1>
<p>This code expires in 10 minutes.</p>`;

    await sendEmail(
      pendingRegistration.email,
      "HavenPlay verification code",
      emailHtml,
    );

    pendingRegistration.emailVerificationLastSentAt = new Date();
    await pendingRegistration.save();

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
