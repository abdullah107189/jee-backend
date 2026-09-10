import type { Prisma, SellerStatus } from "../../../prisma/generated/prisma/client";
export interface FindSellersParams {
    search?: string;
    status?: SellerStatus;
    skip: number;
    take: number;
}
export interface CreateSellerRepositoryData {
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
export declare const sellerRepository: {
    findMany(params: FindSellersParams): Prisma.PrismaPromise<({
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
        companyName: string;
        businessLicense: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        taxId: string | null;
        status: SellerStatus;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    count(params: Omit<FindSellersParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__SellerClient<({
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
        companyName: string;
        businessLicense: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        taxId: string | null;
        status: SellerStatus;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findByUserId(userId: string): Prisma.Prisma__SellerClient<({
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
        companyName: string;
        businessLicense: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        taxId: string | null;
        status: SellerStatus;
        approvedAt: Date | null;
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
    /** Creates the SELLER user and its Seller profile in one operation. */
    create(data: CreateSellerRepositoryData): Prisma.Prisma__SellerClient<{
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
        companyName: string;
        businessLicense: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        taxId: string | null;
        status: SellerStatus;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.SellerUpdateInput): Prisma.Prisma__SellerClient<{
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
        companyName: string;
        businessLicense: string | null;
        address: string | null;
        city: string | null;
        state: string | null;
        zipCode: string | null;
        country: string;
        taxId: string | null;
        status: SellerStatus;
        approvedAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    /** Removes the Seller profile and soft-deletes the backing User account. */
    remove(id: string, userId: string): Promise<void>;
};
