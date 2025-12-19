import nodemailer from "nodemailer";

// DEVELOPMENT
// export const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.SMTP_USER,
//     pass: process.env.SMTP_PASS, // Gmail App Password
//   },
//   tls: {
//     rejectUnauthorized: false,
//   },
// });


// PRODUCTION
export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
  tls: {
      rejectUnauthorized: false
   }
});
