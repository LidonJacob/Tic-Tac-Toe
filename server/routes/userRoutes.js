import {Router} from "express";
import {protect} from "../middleware/authMiddleware.js";
import {getUserProfile, updateUserProfile} from "../controllers/userController.js";

const router = Router();

router.get("/profile", protect, getUserProfile);
router.patch("/profile", protect, updateUserProfile);

export default router;