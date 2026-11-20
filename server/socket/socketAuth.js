import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getToken = (cookieHeader) => {
  if (!cookieHeader) return null;

  const tokenCookie = cookieHeader
    .split(";")
    .find((cookie) => cookie.trim().startsWith("token="));

  return tokenCookie ? decodeURIComponent(tokenCookie.trim().slice(6)) : null;
};

export const socketAuth = async (socket, next) => {
  try {
    const token = getToken(socket.handshake.headers.cookie);

    if (!token) {
      return next(new Error("Authentication error"));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return next(new Error("Not Authorized"));
    }

    socket.user = user;

    next();
  } catch (error) {
    console.error("Socket authentication error:", error.message);
    next(new Error("Not Authorized"));
  }
};
