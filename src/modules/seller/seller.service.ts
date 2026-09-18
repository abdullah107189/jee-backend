import type { Prisma } from "../../../prisma/generated/prisma/client";
import AppError  from "../../errors/AppError";
import { hashPassword } from "../../utils/password";
import { SELLER_MESSAGES } from "./seller.constant";
import { sellerRepository } from "./seller.repository";
import type {
  CreateSellerInput,
  ListSellersResult,
  SellerProfile,
  SellerProfileInput,
  SellerQuery,
} from "./seller.type";

export const sellerService = {
  async list(query: SellerQuery): Promise<ListSellersResult> {
    const params = { search: query.search, status: query.status, skip: query.skip, take: query.take };
    const [sellers, total] = await Promise.all([sellerRepository.findMany(params), sellerRepository.count(params)]);
    return { sellers, total };
  },

  async getById(id: string): Promise<SellerProfile> {
    const seller = await sellerRepository.findById(id);
    if (!seller) throw new AppError(SELLER_MESSAGES.NOT_FOUND, 404);
    return seller;
  },

  async getByUserId(userId: string): Promise<SellerProfile> {
    const seller = await sellerRepository.findByUserId(userId);
    if (!seller) throw new AppError(SELLER_MESSAGES.NOT_FOUND, 404);
    return seller;
  },

  async create(input: CreateSellerInput): Promise<SellerProfile> {
    const email = input.email.trim().toLowerCase();

    const existing = await sellerRepository.findUserByEmail(email);
    if (existing) throw new AppError(SELLER_MESSAGES.EMAIL_IN_USE, 409);

    return sellerRepository.create({
      email,
      password: hashPassword(input.password),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim(),
      companyName: input.companyName.trim(),
      businessLicense: input.businessLicense?.trim(),
      address: input.address?.trim(),
      city: input.city?.trim(),
      state: input.state?.trim(),
      zipCode: input.zipCode?.trim(),
      country: input.country.trim(),
      taxId: input.taxId?.trim(),
    });
  },

  async update(id: string, input: Prisma.SellerUpdateInput): Promise<SellerProfile> {
    await this.getById(id);
    return sellerRepository.update(id, input);
  },

  async updateMe(userId: string, input: SellerProfileInput): Promise<SellerProfile> {
    const seller = await this.getByUserId(userId);
    return sellerRepository.update(seller.id, input as Prisma.SellerUpdateInput);
  },

  async remove(id: string): Promise<void> {
    const seller = await this.getById(id);
    await sellerRepository.remove(id, seller.userId);
  },
};