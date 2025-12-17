import { prisma } from "../lib/prisma.js";
import { signRefreshToken } from "../utils/jwt.js";
import jwt from "jsonwebtoken";

async function generateRefreshToken(userId) {
  const token = signRefreshToken({ id: userId });

  const decoded = jwt.decode(token);
  const expiresAt = new Date(decoded.exp * 1000);

  await prisma.refresh_token.upsert({
    where: { userId },
    update: { token },
    create: { userId, token, expiresAt },
  });
  // await prisma.refresh_token.create({
  //   data: {
  //     userId,
  //     token,
  //     expiresAt
  //   }
  // });

  return token;
}

async function rotateRefreshToken(oldToken) {
  // find existing token
  const existing = await prisma.refresh_token.findUnique({
    where: { token: oldToken }
  });

  if (!existing) return null;

  // delete old token
  await prisma.refresh_token.delete({
    where: { token: oldToken }
  });

  // create new one
  return generateRefreshToken(existing.userId);
}

async function revokeToken(token) {
  await prisma.refresh_token.deleteMany({
    where: { token }
  });
}

export { generateRefreshToken, rotateRefreshToken, revokeToken};