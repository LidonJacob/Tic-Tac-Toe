import { Router } from "express";
import { registerUser, loginUser, logoutUser, googleAuth, verifyEmail } from "../controllers/authController.js";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/logout", logoutUser);
router.get("/verify-email/:token", verifyEmail);

export default router;
