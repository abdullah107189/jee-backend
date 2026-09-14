import { prisma } from "../../lib/prisma";
import type { Prisma } from "../../../prisma/generated/prisma/client";

export const authRepository = {
  findByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },

  findByPhone(phone: string) {
    return prisma.user.findUnique({ where: { phone } });
  },

  findById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  create(data: Prisma.UserUncheckedCreateInput) {
    return prisma.user.create({ data });
  },

  updateLastLogin(id: string) {
    return prisma.user.update({ where: { id }, data: { lastLogin: new Date() } });
  },

  updatePassword(id: string, hashedPassword: string) {
    return prisma.user.update({ where: { id }, data: { password: hashedPassword }, select: { id: true } });
  },
};