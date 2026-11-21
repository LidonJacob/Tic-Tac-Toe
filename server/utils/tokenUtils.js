import { randomBytes, createHash } from "crypto";

export const generateVerificationToken = () => {
  const verificationToken = randomBytes(32).toString("hex");

  const hashToken = createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  return {
    verificationToken,
    hashToken,
  };
};
