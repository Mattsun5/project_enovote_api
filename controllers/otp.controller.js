import { prisma } from "../lib/prisma.js";
import { transporter } from "../utils/mailer.js";
import { otpEmailTemplate } from "../utils/otpEmailTemplate.js";

export const sendOtp = async (email) => {
  const otp = Math.floor(1000 + Math.random() * 9000).toString();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  await prisma.email_otp.deleteMany({ where: { email } });

  await prisma.email_otp.create({
    data: {
      email,
      otp,
      expiresAt,
      lastSentAt: new Date(),
      attempts: 0,
    },
  });

  await transporter.sendMail({
    from: `"E-VOTE SYSTEM"`,
    to: email,
    subject: "Verify your email - E-VOTE SYSTEM",
    html: otpEmailTemplate({ otp })
  });
};

export const resendOtp = async (req, res) => {
  const { email } = req.body;

  const existing = await prisma.email_otp.findFirst({ where: { email } });

  if (existing && Date.now() - existing.lastSentAt < 30_000) {
    return res.status(429).json({
      message: "Please wait before requesting another OTP",
    });
  }

  await sendOtp(email);
  res.json({ success: true });
};

export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await prisma.email_otp.findFirst({
    where: { email },
  });

  if (!record) {
    return res.status(400).json({ message: "OTP not found" });
  }

  if (record.attempts >= 5) {
    return res.status(429).json({
      message: "Too many attempts. Request new OTP.",
    });
  }

  if (record.otp !== otp || record.expiresAt < new Date()) {
    await prisma.email_otp.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });

    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  await prisma.user.update({
    where: { email },
    data: { status: "verified" },
  });

  await prisma.email_otp.deleteMany({ where: { email } });

  res.json({ success: true });
};
