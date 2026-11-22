import { randomInt, createHmac } from "crypto";

export const generateVerificationCode = () => {
  const verificationCode = randomInt(100000, 1000000).toString();

  const codeHash = createHmac("sha256", process.env.EMAIL_VERIFICATION_SECRET)
    .update(verificationCode)
    .digest("hex");

    return {
        verificationCode,
        codeHash
    }
};
