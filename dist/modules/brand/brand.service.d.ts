import { Prisma } from "../../../prisma/generated/prisma/client";
import type { BrandQuery, BrandWithCount, CreateBrandInput, ListBrandsResult } from "./brand.type";
export declare const brandService: {
    list(query: BrandQuery): Promise<ListBrandsResult>;
    getById(id: string): Promise<BrandWithCount>;
    create(input: CreateBrandInput): Promise<BrandWithCount>;
    update(id: string, input: Prisma.BrandUpdateInput): Promise<BrandWithCount>;
    remove(id: string): Promise<void>;
};
