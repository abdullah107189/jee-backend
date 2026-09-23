-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "fullSlug" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "image" TEXT,
ADD COLUMN     "productCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "sortOrder" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "categories_fullSlug_idx" ON "categories"("fullSlug");

-- CreateIndex
CREATE INDEX "categories_isActive_sortOrder_idx" ON "categories"("isActive", "sortOrder");
