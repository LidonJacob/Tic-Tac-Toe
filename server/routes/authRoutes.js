import { Router } from "express";
import { registerUser, loginUser, logoutUser, googleAuth } from "../controllers/authController.js";


const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google", googleAuth);
router.post("/logout", logoutUser);

export default router;
