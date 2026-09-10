import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindBrandsParams {
    search?: string;
    isActive?: boolean;
    skip: number;
    take: number;
}
export declare const brandRepository: {
    findMany(params: FindBrandsParams): Prisma.PrismaPromise<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    count(params: Omit<FindBrandsParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__BrandClient<({
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findBySlug(slug: string): Prisma.Prisma__BrandClient<{
        id: string;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.BrandUncheckedCreateInput): Prisma.Prisma__BrandClient<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.BrandUpdateInput): Prisma.Prisma__BrandClient<{
        _count: {
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        logo: string | null;
        description: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDelete(id: string): Prisma.Prisma__BrandClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
