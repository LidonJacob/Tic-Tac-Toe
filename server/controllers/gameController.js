import Game from "../models/Game.js";

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

export const getUserGames = async (req, res) => {
  try {
    const userId = req.user._id;

    const games = await Game.find({
      "players.user": userId,
    })
      .populate("players.user", "username")
      .sort({ createdAt: -1 });

    return res.status(200).json({ games });
  } catch (error) {
    console.error("Error getting user games:", error);

    return res
      .status(500)
      .json({ message: "server error while retrieving user games" });
  }
};

export const getGameById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const game = await Game.findOne({
      _id: id,
      "players.user": userId,
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    return res.status(200).json({ game });
  } catch (error) {
    console.error("Error getting game:", error);

    return res
      .status(500)
      .json({ message: "server error while retrieving game" });
  }
};

export const updateGame = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;
    const { board, moves, status, winner, currentPlayer } = req.body;

    const game = await Game.findOne({
      _id: id,
      "players.user": userId,
    });

    if (!game) {
      return res.status(404).json({ message: "Game not found" });
    }

    if (!["won", "draw"].includes(status)) {
      return res.status(400).json({ message: "Invalid game status" });
    }

    if (status === "won" && !["X", "O"].includes(winner)) {
      return res.status(400).json({ message: "Invalid game winner" });
    }

    if (status === "draw" && winner !== null) {
      return res.status(400).json({ message: "A draw cannot have a winner" });
    }

    if (!Array.isArray(board) || board.length !== 9) {
      return res.status(400).json({ message: "Invalid game board" });
    }

    if (!Array.isArray(moves)) {
      return res.status(400).json({ message: "Invalid game moves" });
    }

    if (!board.every((square) => ["", "X", "O"].includes(square))) {
      return res.status(400).json({ message: "Invalid board values" });
    }

    if (!["", "X", "O"].includes(currentPlayer)) {
      return res.status(400).json({ message: "Invalid current player" });
    }

    if (
      !moves.every(
        (move) =>
          ["X", "O"].includes(move.player) &&
          Number.isInteger(move.position) &&
          move.position >= 0 &&
          move.position <= 8,
      )
    ) {
      return res.status(400).json({ message: "Invalid moves" });
    }

    const positions = moves.map((move) => move.position);
    if (new Set(positions).size !== positions.length) {
      return res
        .status(400)
        .json({ message: "Duplicate moves are not allowed" });
    }

    if (moves.length > 9) {
      return res.status(400).json({ message: "Too many moves" });
    }

    const occupiedSquares = board.filter((square) => square !== "").length;

    if (occupiedSquares !== moves.length) {
      return res.status(400).json({ message: "Invalid moves" });
    }

    const validTurnOrder = moves.every((move, index) => {
      const expectedPlayer = index % 2 === 0 ? "X" : "O";
      return move.player === expectedPlayer;
    });

    if (!validTurnOrder) {
      return res.status(400).json({ message: "Invalid turn order" });
    }

    const reconstructedBoard = Array(9).fill("");

    moves.forEach((move) => {
      reconstructedBoard[move.position] = move.player;
    });

    if (!reconstructedBoard.every((square, index) => square === board[index])) {
      return res
        .status(400)
        .json({ message: "Board Moves do not match recored moves" });
    }

    const winningCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    const actualWinner =
      winningCombinations
        .map(([a, b, c]) =>
          board[a] && board[a] === board[b] && board[a] === board[c]
            ? board[a]
            : null,
        )
        .find(Boolean) || null;

    if (status === "won" && actualWinner !== winner) {
      return res
        .status(400)
        .json({ message: "Declared winner does not match actual winner" });
    }

    if (status === "won" && actualWinner === null) {
      return res.status(400).json({ message: "No winning combination" });
    }

    if (status === "draw" && actualWinner !== null) {
      return res.status(400).json({ message: "A draw cannot have a winner" });
    }

    if (status === "draw" && board.some((square) => square === "")) {
      return res
        .status(400)
        .json({ message: "A draw cannot have empty squares" });
    }

    if (game.status !== "ongoing") {
      return res.status(409).json({ message: "This game has ended" });
    }

    game.board = board;
    game.moves = moves;
    game.status = status;
    game.winner = winner;
    game.currentPlayer = currentPlayer;

    await game.save();

    return res.status(200).json({ message: "Game updated successfully", game });
  } catch (error) {
    console.error("Error updating game:", error);

    return res
      .status(500)
      .json({ message: "server error while updating game" });
  }
};

export const deleteGame = async (req, res) => {
  try {
    const game = await Game.findOneAndDelete({
      _id: req.params.id,
      "players.user": req.user._id,
      status: "ongoing",
    });

    if (!game) {
      return res.status(404).json({ message: "Ongoing game not found" });
    }

    return res.status(200).json({
      message: "Game deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting game:", error);
    return res
      .status(500)
      .json({ message: "Server error while deleting game" });
  }
};
