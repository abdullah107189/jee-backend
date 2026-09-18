import type { Prisma } from "../../../prisma/generated/prisma/client";

/** Admin rows always come with their User account (no password). */
export const ADMIN_WITH_USER_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      phone: true,
      name: true,
      role: true,
      isVerified: true,
      isActive: true,
      lastLogin: true,
    },
  },
} satisfies Prisma.AdminInclude;

export type AdminProfile = Prisma.AdminGetPayload<{
  include: typeof ADMIN_WITH_USER_INCLUDE;
}>;

export interface CreateAdminInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  /** JSON array of permission strings, e.g. ["products.manage", "orders.manage"]. */
  permissions?: string[];
}

/** Only permissions are directly editable on the Admin row itself. */
export type UpdateAdminInput = Pick<Prisma.AdminUpdateInput, "permissions">;

export interface AdminQuery {
  search?: string;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListAdminsResult {
  admins: AdminProfile[];
  total: number;
}
