/*
  Warnings:

  - You are about to drop the column `label` on the `filter_options` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `filter_options` table. All the data in the column will be lost.
  - You are about to drop the column `filterGroupId` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `label` on the `filters` table. All the data in the column will be lost.
  - You are about to drop the column `sortOrder` on the `filters` table. All the data in the column will be lost.
  - The `type` column on the `filters` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `filter_groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product_filter_values` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `filters` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `filters` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "filter_groups" DROP CONSTRAINT "filter_groups_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "filter_options" DROP CONSTRAINT "filter_options_filterId_fkey";

-- DropForeignKey
ALTER TABLE "filters" DROP CONSTRAINT "filters_filterGroupId_fkey";

-- DropForeignKey
ALTER TABLE "product_filter_values" DROP CONSTRAINT "product_filter_values_filterId_fkey";

-- DropForeignKey
ALTER TABLE "product_filter_values" DROP CONSTRAINT "product_filter_values_filterOptionId_fkey";

-- DropForeignKey
ALTER TABLE "product_filter_values" DROP CONSTRAINT "product_filter_values_productId_fkey";

-- DropIndex
DROP INDEX "filters_filterGroupId_idx";

-- AlterTable
ALTER TABLE "filter_options" DROP COLUMN "label",
DROP COLUMN "sortOrder";

-- AlterTable
ALTER TABLE "filters" DROP COLUMN "filterGroupId",
DROP COLUMN "isActive",
DROP COLUMN "label",
DROP COLUMN "sortOrder",
ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "slug" TEXT NOT NULL,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'MULTI_SELECT';

-- DropTable
DROP TABLE "filter_groups";

-- DropTable
DROP TABLE "product_filter_values";

-- DropEnum
DROP TYPE "FilterType";

-- CreateTable
CREATE TABLE "category_filters" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "category_filters_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "category_filters_categoryId_idx" ON "category_filters"("categoryId");

-- CreateIndex
CREATE INDEX "category_filters_filterId_idx" ON "category_filters"("filterId");

-- CreateIndex
CREATE UNIQUE INDEX "category_filters_categoryId_filterId_key" ON "category_filters"("categoryId", "filterId");

-- CreateIndex
CREATE UNIQUE INDEX "filters_slug_key" ON "filters"("slug");

-- CreateIndex
CREATE INDEX "filters_slug_idx" ON "filters"("slug");

-- AddForeignKey
ALTER TABLE "filter_options" ADD CONSTRAINT "filter_options_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "filters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_filters" ADD CONSTRAINT "category_filters_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "category_filters" ADD CONSTRAINT "category_filters_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "filters"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
