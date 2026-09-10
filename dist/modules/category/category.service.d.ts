import { Prisma } from "../../../prisma/generated/prisma/client";
import type { CategoryWithCount, CategoryQuery, CreateCategoryInput, ListCategoriesResult } from "./category.type";
export declare const categoryService: {
    list(query: CategoryQuery): Promise<ListCategoriesResult>;
    getById(id: string): Promise<CategoryWithCount>;
    create(input: CreateCategoryInput): Promise<CategoryWithCount>;
    update(id: string, input: Prisma.CategoryUpdateInput): Promise<CategoryWithCount>;
    remove(id: string): Promise<void>;
};
