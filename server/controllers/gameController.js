import Game from "../models/Game";

export const createGame = async (req, res) => {
  const { gameMode, aiDifficulty } = req.body;

  if (!["player", "ai"].includes(gameMode)) {
    return res.status(400).json({ message: "Invalid game mode" });
  }

  if (gameMode === "ai" && !["easy", "medium", "hard"].includes(aiDifficulty)) {
    return res.status(400).json({ message: "Invalid ai difficulty" });
  }

  try {
    const userId = req.user._id;

    const players = [
      { user: userId, symbol: "X" },
      { user: null, symbol: "O" },
    ];
    const game = await Game.create({
      players,
      gameMode,
      aiDifficulty: gameMode === "ai" ? aiDifficulty : null,
    });
    return res.status(201).json({
      message: "Game created successfully",
      game,
    });
  } catch (error) {
    console.error("Error creating game:", error);
    return res
      .status(500)
      .json({ message: "server error while creating game" });
  }
};
