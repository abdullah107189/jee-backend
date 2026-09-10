import type { NextFunction, Request, Response } from "express";
import type { UserRole } from "../../prisma/generated/prisma/client";
export interface RequestUser {
    id: string;
    role: UserRole;
}
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
export declare function authenticate(req: Request, _res: Response, next: NextFunction): Promise<void>;
/** Route-level guard. Must run after `authenticate`. */
export declare function authorize(...roles: UserRole[]): (req: Request, _res: Response, next: NextFunction) => void;
