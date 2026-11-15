import express from "express";
import healthRoute from "./routes/healthRoute.js";
import authRoutes from "./routes/authRoutes.js";

const app = express();
app.use(express.json());


app.use("/api", healthRoute);
app.use("/api/auth", authRoutes);
export default app;