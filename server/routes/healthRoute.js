import { Router } from "express";

const router = Router();

router.get("/health", (req, res) => {
    res.sendStatus(200).json({message: "API is up and running"});
})

export default router;