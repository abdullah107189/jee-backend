import type { NextFunction, Request, Response } from "express";
import { config } from "../config/config";
import type { JwtPayload } from "../utils/jwt";
import { verifyToken } from "../utils/jwt";
import { AppError } from "./error.middleware";
import { prisma } from "../lib/prisma";

export interface RequestUser {
  id: string;
  role: UserRole;
}

// Augment Express.Request with the authenticated user (set by `authenticate`).
declare global {
  namespace Express {
    interface Request {
      user?: RequestUser;
    }
  }
}

/**
 * Verifies the `Authorization: Bearer <token>` header, loads the user and
 * attaches `req.user`. Throws 401/403 when authentication is impossible.
 */
export async function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    if (req.user) {
      next();
      return;
    }

    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) {
      throw new AppError("Authentication token is missing", 401);
    }

    const token = header.slice("Bearer ".length).trim();
    let payload: JwtPayload;
    try {
      payload = verifyToken(token, config.jwtSecret);
    } catch {
      throw new AppError("Invalid or expired authentication token", 401);
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, role: true, isActive: true },
    });

    if (!user) throw new AppError("User account no longer exists", 401);
    if (!user.isActive) throw new AppError("User account is disabled", 403);

    req.user = { id: user.id, role: user.role };
    next();
  } catch (err) {
    next(err);
  }
}

/** Route-level guard. Must run after `authenticate`. */
export function authorize(...roles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      next(new AppError("Authentication required", 401));
      return;
    }
    if (!roles.includes(req.user.role)) {
      next(
        new AppError("You do not have permission to perform this action", 403),
      );
      return;
    }
    next();
  };
}
