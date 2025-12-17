import { verifyAccessToken } from "../utils/jwt.js";
import { prisma } from "../lib/prisma.js";

export async function authenticate(req, res, next) {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith("Bearer "))
    {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const token = auth.split(" ")[1];
    const decoded = verifyAccessToken(token);
    if (!decoded?.id) {
      return res.status(400).json({ message: "Invalid token payload" });
    }
    
    console.log(`decode ${decoded}`);
    // verify user still exists
    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { 
        id: true,
        email: true,
        f_name: true,
        l_name: true,
        role: true,
        status: true }
    });
    if (!user) return res.status(401).json({ message: "user not found" });

    req.user = user;
    // req.user = decoded;
    next();

  } catch (err) {
    console.error("AUTH ERROR:", err.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
