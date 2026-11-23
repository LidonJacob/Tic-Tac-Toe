import { Router } from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  getUserProfile,
  updateUserProfile,
  requestEmailChange,
} from "../controllers/userController.js";

const router = Router();

router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);
router.post("/request-email-change", protect, requestEmailChange);

export default router;
