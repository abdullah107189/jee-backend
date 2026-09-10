import { Prisma } from "../../../prisma/generated/prisma/client";
import { AppError } from "../../middleware/error.middleware";
import { hashPassword } from "../../utils/password";
import { USER_MESSAGES } from "./user.constant";
import { userRepository } from "./user.repository";
import type {
  CreateUserInput,
  ListUsersResult,
  PublicUser,
  UpdateUserInput,
  UserQuery,
} from "./user.type";

export const userService = {
  async list(query: UserQuery): Promise<ListUsersResult> {
    const params = {
      search: query.search,
      role: query.role,
      isActive: query.isActive,
      skip: query.skip,
      take: query.take,
      excludeDeleted: true,
    };
    const [users, total] = await Promise.all([userRepository.findMany(params), userRepository.count(params)]);
    return { users, total };
  },

  async getById(id: string): Promise<PublicUser> {
    const user = await userRepository.findById(id);
    if (!user) throw new AppError(USER_MESSAGES.NOT_FOUND, 404);
    return user;
  },

  async me(userId: string): Promise<PublicUser> {
    return this.getById(userId);
  },

  async create(input: CreateUserInput): Promise<PublicUser> {
    const email = input.email.trim().toLowerCase();

    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError(USER_MESSAGES.EMAIL_IN_USE, 409);

    try {
      return await userRepository.create({ ...input, email });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(USER_MESSAGES.EMAIL_IN_USE, 409);
      }
      throw error;
    }
  },

  async update(id: string, input: UpdateUserInput): Promise<PublicUser> {
    await this.getById(id);

    const { password, ...rest } = input;
    const data: Prisma.UserUpdateInput = rest;
    if (typeof password === "string") data.password = hashPassword(password);

    try {
      return await userRepository.update(id, data);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(USER_MESSAGES.EMAIL_IN_USE, 409);
      }
      throw error;
    }
  },

  async updateMe(userId: string, input: Prisma.UserUpdateInput): Promise<PublicUser> {
    await this.getById(userId);

    try {
      return await userRepository.update(userId, input);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError(USER_MESSAGES.EMAIL_IN_USE, 409);
      }
      throw error;
    }
  },

  async remove(id: string): Promise<void> {
    await this.getById(id);
    await userRepository.softDelete(id);
  },
};