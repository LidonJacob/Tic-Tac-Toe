import mongoose from "mongoose";

const gameSchema = new mongoose.Schema(
  {
    players: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        symbol: {
          type: String,
          enum: ["X", "O"],
          required: true,
        },
      },
    ],
    board: {
      type: [String],
      default: ["", "", "", "", "", "", "", "", ""],
    },
    moves: [
      {
        player: {
          type: String,
          enum: ["X", "O"],
          required: true,
        },
        position: {
          type: Number,
          required: true,
          min: 0,
          max: 8,
        },
      },
    ],
    status: {
      type: String,
      enum: ["ongoing", "won", "draw",],
      default: "ongoing",
    },
    winner: {
      type: String,
      enum: ["X", "O"],
      default: null,
    },
    currentPlayer: {
      type: String,
      enum: ["X", "O"],
      default: "X",
    },
    gameMode: {
      type: String,
      enum: ["player", "ai"],
      required: true,
    },
    aiDifficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      default: null,
    },
  },
  { timestamps: true },
);

const Game = mongoose.model("Game", gameSchema);
export default Game;
