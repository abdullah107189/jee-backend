import { AppError } from "../../middleware/error.middleware";
import { hashPassword } from "../../utils/password";
import { ADMIN_MESSAGES } from "./admin.constant";
import { adminRepository } from "./admin.repository";
import type {
  AdminProfile,
  AdminQuery,
  CreateAdminInput,
  ListAdminsResult,
  UpdateAdminInput,
} from "./admin.type";

export const adminService = {
  async list(query: AdminQuery): Promise<ListAdminsResult> {
    const params = { search: query.search, skip: query.skip, take: query.take };
    const [admins, total] = await Promise.all([adminRepository.findMany(params), adminRepository.count(params)]);
    return { admins, total };
  },

  async getById(id: string): Promise<AdminProfile> {
    const admin = await adminRepository.findById(id);
    if (!admin) throw new AppError(ADMIN_MESSAGES.NOT_FOUND, 404);
    return admin;
  },

  async create(input: CreateAdminInput): Promise<AdminProfile> {
    const email = input.email.trim().toLowerCase();

    const existing = await adminRepository.findUserByEmail(email);
    if (existing) throw new AppError(ADMIN_MESSAGES.EMAIL_IN_USE, 409);

    return adminRepository.create({
      email,
      password: hashPassword(input.password),
      firstName: input.firstName.trim(),
      lastName: input.lastName.trim(),
      phone: input.phone?.trim(),
      permissions: input.permissions ?? [],
    });
  },

  async update(id: string, input: UpdateAdminInput): Promise<AdminProfile> {
    await this.getById(id);
    return adminRepository.update(id, input);
  },

  async remove(id: string): Promise<void> {
    const admin = await this.getById(id);
    await adminRepository.remove(id, admin.userId);
  },
};