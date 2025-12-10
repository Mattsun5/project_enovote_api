import { prisma } from "../lib/prisma.js";
import "dotenv/config";
import { signAccessToken, verifyRefreshToken } from "../utils/jwt.js";
import { rotateRefreshToken } from "../services/token.service.js";

export async function refresh(req, res) {
  try {
    const oldRefreshToken = req.cookies.refresh_token;

    if (!oldRefreshToken)
      return res.status(401).json({ message: "Missing refresh token" });

    // ensure token exists in DB
    const stored = await prisma.refresh_token.findUnique({
      where: { token: oldRefreshToken }
    });

    if (!stored)
      return res.status(401).json({ message: "Refresh token invalid" });

    // verify JWT
    const decoded = verifyRefreshToken(oldRefreshToken);

    // ROTATE token (delete old, create new)
    const newRefreshToken = await rotateRefreshToken(oldRefreshToken);

    const newAccessToken = signAccessToken({ id: decoded.id });

    // send back new rotated refresh token
    res.cookie("refresh_token", newRefreshToken, {
      // httpOnly: true,
      // secure: true,
      // sameSite: "strict",
      maxAge: process.env.JWT_REFRESH_EXPIRES_IN * 86400000 
    });

    res.json({
      message: "Token refreshed"
    //   token: newAccessToken
    });

  } catch (err) {
    console.log(err);
    return res.status(401).json({ message: "Invalid refresh token" });
  }
}
