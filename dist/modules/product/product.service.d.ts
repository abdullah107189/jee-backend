import { Prisma } from "../../../prisma/generated/prisma/client";
import type { CreateItemInput, CreateProductInput, CreateVariantInput, ItemQuery, ListItemsResult, ListProductsResult, ListVariantsResult, ProductItemWithRelations, ProductQuery, ProductVariantWithRelations, ProductWithRelations, VariantQuery } from "./product.type";
export declare const productService: {
    list(query: ProductQuery): Promise<ListProductsResult>;
    getById(id: string): Promise<ProductWithRelations>;
    create(input: CreateProductInput): Promise<ProductWithRelations>;
    update(id: string, input: Prisma.ProductUpdateInput): Promise<ProductWithRelations>;
    remove(id: string): Promise<void>;
    listVariants(query: VariantQuery & {
        productId?: string;
    }): Promise<ListVariantsResult>;
    getVariantById(id: string): Promise<ProductVariantWithRelations>;
    createVariant(productId: string, input: CreateVariantInput): Promise<ProductVariantWithRelations>;
    updateVariant(id: string, input: Prisma.ProductVariantUpdateInput): Promise<ProductVariantWithRelations>;
    removeVariant(id: string): Promise<void>;
    listItems(query: ItemQuery): Promise<ListItemsResult>;
    getItemById(id: string): Promise<ProductItemWithRelations>;
    createItem(variantId: string, input: CreateItemInput): Promise<ProductItemWithRelations>;
    updateItem(id: string, input: Prisma.ProductItemUpdateInput): Promise<ProductItemWithRelations>;
    removeItem(id: string): Promise<void>;
};
