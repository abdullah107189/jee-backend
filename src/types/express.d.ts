import type { UserRole } from "../../prisma/generated/prisma/enums";

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        userId?: string;
        email: string;
        role: UserRole | string;
        name: string;
      };
    }
  }
}

export {};
