import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "in-v3.mailjet.com",
  port: 2525,
  secure: false,
  requireTLS: true,
  auth: {
    user: process.env.MAILJET_API_KEY,
    pass: process.env.MAILJET_SECRET_KEY,
  },
});

export const sendEmail = async (to, subject, html) => {
  return transporter.sendMail({
    from: `HavenPlay <${process.env.EMAIL_FROM}>`,
    to,
    subject,
    html,
  });
};
