/*
  Warnings:

  - You are about to drop the column `uniqueId` on the `product_items` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[variantId,serialNumber]` on the table `product_items` will be added. If there are existing duplicate values, this will fail.
  - Made the column `serialNumber` on table `product_items` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "product_items_uniqueId_idx";

-- DropIndex
DROP INDEX "product_items_variantId_uniqueId_key";

-- AlterTable
ALTER TABLE "product_items" DROP COLUMN "uniqueId",
ALTER COLUMN "serialNumber" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "product_items_variantId_serialNumber_key" ON "product_items"("variantId", "serialNumber");
