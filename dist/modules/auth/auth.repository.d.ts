import type { Prisma } from "../../../prisma/generated/prisma/client";
export declare const authRepository: {
    findByEmail(email: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByPhone(phone: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findById(id: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import("../../../prisma/generated/prisma/enums").UserRole;
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
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updateLastLogin(id: string): Prisma.Prisma__UserClient<{
        id: string;
        email: string;
        phone: string | null;
        password: string;
        firstName: string;
        lastName: string;
        role: import("../../../prisma/generated/prisma/enums").UserRole;
        isVerified: boolean;
        isActive: boolean;
        lastLogin: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    updatePassword(id: string, hashedPassword: string): Prisma.Prisma__UserClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
