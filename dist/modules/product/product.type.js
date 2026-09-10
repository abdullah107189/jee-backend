export const PRODUCT_INCLUDE = {
    category: true,
    brand: true,
    _count: { select: { variants: true, reviews: true } },
};
export const PRODUCT_VARIANT_INCLUDE = {
    product: { select: { id: true, name: true, slug: true } },
    _count: { select: { productItems: true } },
};
export const PRODUCT_ITEM_INCLUDE = {
    variant: {
        include: {
            product: { select: { id: true, name: true, slug: true } },
        },
    },
};
//# sourceMappingURL=product.type.js.map