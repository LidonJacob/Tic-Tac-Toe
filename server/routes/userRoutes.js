import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  requestEmailChange,
  resendEmailChangeVerification,
  verifyEmailChange,
  changePassword,
  deleteAccount,
} from "../controllers/userController.js";

const router = Router();

router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);
router.post("/request-email-change", protect, requestEmailChange);
router.post("/verify-email-change", protect, verifyEmailChange);
router.post("/resend-email-change", protect, resendEmailChangeVerification);
router.post("/change-password", protect, changePassword);
router.delete("/account", protect, deleteAccount);

export default router;
