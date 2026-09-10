import type { Prisma } from "../../../prisma/generated/prisma/client";
export interface FindCategoriesParams {
    search?: string;
    /** undefined = all, null = root only, string = direct children. */
    parentId?: string | null;
    isActive?: boolean;
    skip: number;
    take: number;
}
export declare const categoryRepository: {
    findMany(params: FindCategoriesParams): Prisma.PrismaPromise<({
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
        level: number;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    })[]>;
    count(params: Omit<FindCategoriesParams, "skip" | "take">): Prisma.PrismaPromise<number>;
    findById(id: string): Prisma.Prisma__CategoryClient<({
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
        level: number;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }) | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findBySlug(slug: string): Prisma.Prisma__CategoryClient<{
        id: string;
        level: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    findParent(parentId: string): Prisma.Prisma__CategoryClient<{
        id: string;
        level: number;
    } | null, null, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    create(data: Prisma.CategoryUncheckedCreateInput): Prisma.Prisma__CategoryClient<{
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
        level: number;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    update(id: string, data: Prisma.CategoryUpdateInput): Prisma.Prisma__CategoryClient<{
        _count: {
            children: number;
            products: number;
        };
    } & {
        id: string;
        name: string;
        slug: string;
        description: string | null;
        parentId: string | null;
        level: number;
        icon: string | null;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
    softDelete(id: string): Prisma.Prisma__CategoryClient<{
        id: string;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: Prisma.GlobalOmitConfig | undefined;
    }>;
};
