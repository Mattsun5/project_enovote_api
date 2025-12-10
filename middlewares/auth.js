import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

export async function protect(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer "))
      return res.status(401).json({ message: "Not authenticated" });

    const token = auth.split(" ")[1];
    const decoded = verifyAccessToken(token);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, role: true }
    });

    if (!user) return res.status(401).json({ message: "Invalid token user" });

    req.user = user;
    next();

  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
