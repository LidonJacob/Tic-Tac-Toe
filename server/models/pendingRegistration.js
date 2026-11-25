import mongoose from "mongoose";

const pendingRegistrationSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      default: "",
    },
    emailVerificationCodeHash: {
      type: String,
      required: true,
    },
    emailVerificationCodeExpires: {
      type: Date,
      required: true,
    },
    emailVerificationAttempts: {
      type: Number,
      default: 0,
    },
    emailVerificationLastSentAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true },
);

pendingRegistrationSchema.index({ username: 1 }, { unique: true });

pendingRegistrationSchema.index({ email: 1 }, { unique: true });

pendingRegistrationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const pendingRegistration = mongoose.model(
  "pendingRegistration",
  pendingRegistrationSchema,
);

export default pendingRegistration;
