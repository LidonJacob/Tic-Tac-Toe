import express from "express";
import cors from "cors";
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
app.use(cors({
    origin: "http://localhost:5173"
}))
app.use(express.json());


app.use("/api", healthRoute);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
export default app;