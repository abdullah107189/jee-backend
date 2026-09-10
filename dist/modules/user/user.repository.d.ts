import type { Prisma, UserRole } from "../../../prisma/generated/prisma/client";
export interface FindUsersParams {
    search?: string;
    role?: UserRole;
    isActive?: boolean;
    skip: number;
    take: number;
    excludeDeleted?: boolean;
}
export declare const userRepository: {
    findMany(params: FindUsersParams): Prisma.PrismaPromise<{
        createdAt: Date;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        isVerified: boolean;
        lastLogin: Date | null;
        lastName: string;
        phone: string | null;
        role: UserRole;
        updatedAt: Date;
    }[]>;
    count(params: Omit<FindUsersParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__UserClient<{
        createdAt: Date;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        isVerified: boolean;
        lastLogin: Date | null;
        lastName: string;
        phone: string | null;
        role: UserRole;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByEmail(email: string): Prisma.Prisma__UserClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByIdWithAllFields(id: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.UserUncheckedCreateInput): Prisma.Prisma__UserClient<{
        createdAt: Date;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        isVerified: boolean;
        lastLogin: Date | null;
        lastName: string;
        phone: string | null;
        role: UserRole;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.UserUpdateInput): Prisma.Prisma__UserClient<{
        createdAt: Date;
        email: string;
        firstName: string;
        id: string;
        isActive: boolean;
        isVerified: boolean;
        lastLogin: Date | null;
        lastName: string;
        phone: string | null;
        role: UserRole;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDelete(id: string): Prisma.Prisma__UserClient<{
        deletedAt: Date | null;
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
