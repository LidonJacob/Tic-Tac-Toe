import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, avatar } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      res.status(409).json({ message: "Username or email already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      avatar,
    });
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
      },
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
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(!isPasswordValid) {
    return res.status(401).json({ message: "invalid email or password" });
  }

  const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn:"7d"});

  res.status(200).json({
    message: "login successful",
    token,
    user: {
      id: user._id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
    },
  })

    } catch (error) {
        console.error("Login user error:", error.message);
    
        return res
          .status(500)
          .json({ message: "server error during login" });
      }
};
