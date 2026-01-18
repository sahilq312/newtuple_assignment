import { type Request, type Response, type NextFunction } from "express";
import jwt from "jsonwebtoken";
import type { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      userId?: number;
    }
  }
}

const getJwtSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

export const authorize = (req: Request, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // ✅ 1. Cookie-based auth (preferred)
    if (req.cookies?.access_token) {
      token = req.cookies.access_token;
    }

    // 🔁 2. Header-based auth (fallback)
    if (!token && req.headers.authorization?.startsWith("Bearer ")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, getJwtSecret());

    if (
      typeof decoded !== "object" ||
      decoded === null ||
      !("userId" in decoded)
    ) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.userId = (decoded as JwtPayload & { userId: number }).userId;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
