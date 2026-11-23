import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/authController.js";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/logout", logoutUser);
router.post("/verify-email/", verifyEmail);
router.post("/resend-verification-code/", resendVerificationCode);

export default router;
