import {Router} from "express";
import { createGame } from "../controllers/gameController";
import { protect } from "../middleware/authMiddleware";

const router = Router();

router.post("/", protect, createGame);

export default router;

