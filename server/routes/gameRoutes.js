import {Router} from "express";
import { createGame, getUserGames, getGameById, updateGame, deleteGame } from "../controllers/gameController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/", protect, createGame);
router.get("/", protect, getUserGames);
router.get("/:id", protect, getGameById);
router.patch("/:id", protect, updateGame);
router.delete("/:id", protect, deleteGame);

export default router;

