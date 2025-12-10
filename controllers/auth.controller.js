import bcrypt from "bcrypt";
import "dotenv/config";
import { prisma } from "../lib/prisma.js";
import { signAccessToken } from "../utils/jwt.js";
import { generateRefreshToken } from "../services/token.service.js";

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await prisma.user.findUnique({ 
    omit: {
        password: false, 
    },
    // select: {
    //     // firstName: true,
    //     // lastName: true,
    //     // password: true 
    // },
    where: { email }, 
    
    });
  if (!user) return res.status(401).json({ message: "Invalid login" });
  const valid = await bcrypt.compare(password, user?.password);
  if (!valid) return res.status(401).json({ message: "Invalid login" });

  // access token
  const accessToken = signAccessToken({ id: user.id });

  // refresh token
  const refreshToken = await generateRefreshToken(user.id);

  // set refresh token as HTTP-only cookie
  res.cookie("refresh_token", refreshToken, {
    httpOnly: false,
    secure: true,    // required in production
    sameSite: "none",
    // sameSite: "strict",
    maxAge: process.env.JWT_REFRESH_EXPIRES_IN * 86400000 // 7 days
  });

//   remove password again before sending
  const { password: _, ...safe } = user;

  return res.json({
    message: "Logged in",
    user: safe
    // token: accessToken
  });
}
