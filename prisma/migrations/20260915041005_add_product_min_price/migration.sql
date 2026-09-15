-- AlterTable
ALTER TABLE "products" ADD COLUMN     "maxPrice" DECIMAL(10,2),
ADD COLUMN     "minPrice" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "products_minPrice_idx" ON "products"("minPrice");
