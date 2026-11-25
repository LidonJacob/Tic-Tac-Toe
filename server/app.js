import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import gameRoutes from "./routes/gameRoutes.js";
import { apiLimiter } from "./middleware/rateLimitMiddleware.js";

const app = express();
app.set("trust proxy", 1);
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());
app.use("/api", apiLimiter);

app.use("/api", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/games", gameRoutes);
export default app;
