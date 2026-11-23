import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerificationCodeHash: {
      type: String,
      default: null,
    },
    emailVerificationCodeExpires: {
      type: Date,
      default: null,
    },
    emailVerificationAttempts: {
      type: Number,
      default: 0,
    },
    emailVerificationLastSentAt: {
      type: Date,
      default: null,
    },
    pendingEmail: {
      type: String,
      default: null,
    },
    pendingEmailVerificationCodeHash: {
      type: String,
      default: null,
    },
    pendingEmailVerificationCodeExpires: {
      type: Date,
      default: null,
    },
    pendingEmailVerificationAttempts: {
      type: Number,
      default: 0,
    },
    pendingEmailVerificationSentAt: {
      type: Date,
      default: null,
    },
    pendingEmailVerificationLastSentAt: {
      type: Date,
      default: null,
    },
    avatar: {
      type: String,
      default: "",
    },
    password: {
      type: String,
      required: false,
    },
  },
  { timestamps: true },
);

const User = mongoose.model("User", userSchema);
export default User;
