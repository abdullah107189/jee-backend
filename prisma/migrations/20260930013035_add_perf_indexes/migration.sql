-- DropIndex
DROP INDEX "product_variants_deletedAt_idx";

-- DropIndex
DROP INDEX "product_variants_price_idx";

-- DropIndex
DROP INDEX "product_variants_productId_idx";

-- DropIndex
DROP INDEX "products_categoryId_idx";

-- CreateIndex
CREATE INDEX "product_variants_productId_isDefault_idx" ON "product_variants"("productId", "isDefault");

-- CreateIndex
CREATE INDEX "product_variants_productId_isActive_price_idx" ON "product_variants"("productId", "isActive", "price");

-- CreateIndex
CREATE INDEX "products_categoryId_isPublished_isActive_createdAt_idx" ON "products"("categoryId", "isPublished", "isActive", "createdAt");

-- CreateIndex
CREATE INDEX "products_categoryId_brandId_isPublished_idx" ON "products"("categoryId", "brandId", "isPublished");
