import type { Prisma, SellerStatus } from "../../../prisma/generated/prisma/client";

export const SELLER_WITH_USER_INCLUDE = {
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
} satisfies Prisma.SellerInclude;

export type SellerProfile = Prisma.SellerGetPayload<{ include: typeof SELLER_WITH_USER_INCLUDE }>;

export interface CreateSellerInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  companyName: string;
  businessLicense?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country: string;
  taxId?: string;
}

/** Admin update — any Seller field including status. */
export type UpdateSellerInput = Prisma.SellerUpdateInput;

/** Seller self-service update — company/address fields only, no status. */
export interface SellerProfileInput {
  companyName?: string;
  businessLicense?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  zipCode?: string | null;
  country?: string;
  taxId?: string | null;
}

export interface SellerQuery {
  search?: string;
  status?: SellerStatus;
  page: number;
  limit: number;
  skip: number;
  take: number;
}

export interface ListSellersResult {
  sellers: SellerProfile[];
  total: number;
}