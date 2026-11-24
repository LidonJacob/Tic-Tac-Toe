import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  googleAuth,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/authController.js";
import {
  authLimiter,
  verificationLimiter,
} from "../middleware/rateLimitMiddleware.js";

const router = Router();

router.post("/register", authLimiter, registerUser);
router.post("/login", authLimiter, loginUser);
router.post("/google", authLimiter, googleAuth);
router.post("/logout", logoutUser);
router.post("/verify-email/", verificationLimiter, verifyEmail);
router.post(
  "/resend-verification-code/",
  verificationLimiter,
  resendVerificationCode,
);

export default router;
