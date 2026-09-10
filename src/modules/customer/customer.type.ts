import type { Prisma } from "../../../prisma/generated/prisma/client";

export const CUSTOMER_WITH_USER_INCLUDE = {
  user: {
    select: {
      id: true,
      email: true,
      phone: true,
      firstName: true,
      lastName: true,
      role: true,
      isVerified: true,
      isActive: true,
      lastLogin: true,
    },
  },
} satisfies Prisma.CustomerInclude;

export type CustomerProfile = Prisma.CustomerGetPayload<{ include: typeof CUSTOMER_WITH_USER_INCLUDE }>;

export interface CreateCustomerInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  shippingAddress?: unknown;
  billingAddress?: unknown;
  preferredPayment?: unknown;
}

/** Customer rows only expose Json profile fields on update — use the user module for account fields. */
export type UpdateCustomerInput = Prisma.CustomerUpdateInput;

export interface CustomerQuery {
  search?: string;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListCustomersResult {
  customers: CustomerProfile[];
  total: number;
}