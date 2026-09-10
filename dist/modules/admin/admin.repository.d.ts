import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindAdminsParams {
    search?: string;
    skip: number;
    take: number;
}
export interface CreateAdminRepositoryData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    permissions?: string[];
}
export declare const adminRepository: {
    findMany(params: FindAdminsParams): Prisma.PrismaPromise<({
        user: {
            email: string;
            firstName: string;
            id: string;
            isActive: boolean;
            isVerified: boolean;
            lastLogin: Date | null;
            lastName: string;
            phone: string | null;
            role: import("../../../prisma/generated/prisma/enums").UserRole;
        };
    } & {
        id: string;
        userId: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    })[]>;
    count(params: Omit<FindAdminsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__AdminClient<({
        user: {
            email: string;
            firstName: string;
            id: string;
            isActive: boolean;
            isVerified: boolean;
            lastLogin: Date | null;
            lastName: string;
            phone: string | null;
            role: import("../../../prisma/generated/prisma/enums").UserRole;
        };
    } & {
        id: string;
        userId: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByUserId(userId: string): Prisma.Prisma__AdminClient<{
        id: string;
        userId: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findUserByEmail(email: string): Prisma.Prisma__UserClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** Creates the ADMIN user and its Admin profile in one operation. */
    create(data: CreateAdminRepositoryData): Prisma.Prisma__AdminClient<{
        user: {
            email: string;
            firstName: string;
            id: string;
            isActive: boolean;
            isVerified: boolean;
            lastLogin: Date | null;
            lastName: string;
            phone: string | null;
            role: import("../../../prisma/generated/prisma/enums").UserRole;
        };
    } & {
        id: string;
        userId: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.AdminUpdateInput): Prisma.Prisma__AdminClient<{
        user: {
            email: string;
            firstName: string;
            id: string;
            isActive: boolean;
            isVerified: boolean;
            lastLogin: Date | null;
            lastName: string;
            phone: string | null;
            role: import("../../../prisma/generated/prisma/enums").UserRole;
        };
    } & {
        id: string;
        userId: string;
        permissions: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** Removes the Admin profile and soft-deletes the backing User account. */
    remove(id: string, userId: string): Promise<void>;
};
