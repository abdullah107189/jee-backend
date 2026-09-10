import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindCustomersParams {
    search?: string;
    skip: number;
    take: number;
}
export interface CreateCustomerRepositoryData {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone?: string;
    shippingAddress?: Prisma.InputJsonValue;
    billingAddress?: Prisma.InputJsonValue;
    preferredPayment?: Prisma.InputJsonValue;
}
export declare const customerRepository: {
    findMany(params: FindCustomersParams): Prisma.PrismaPromise<({
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
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        preferredPayment: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    count(params: Omit<FindCustomersParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__CustomerClient<({
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
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        preferredPayment: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByUserId(userId: string): Prisma.Prisma__CustomerClient<({
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
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        preferredPayment: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findUserByEmail(email: string): Prisma.Prisma__UserClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** Creates the CUSTOMER user and its Customer profile in one operation. */
    create(data: CreateCustomerRepositoryData): Prisma.Prisma__CustomerClient<{
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
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        preferredPayment: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.CustomerUpdateInput): Prisma.Prisma__CustomerClient<{
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
        shippingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        billingAddress: import("@prisma/client/runtime/client").JsonValue | null;
        preferredPayment: import("@prisma/client/runtime/client").JsonValue | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** Removes the Customer profile and soft-deletes the backing User account. */
    remove(id: string, userId: string): Promise<void>;
};
