/*
  Warnings:

  - You are about to drop the column `maxPrice` on the `products` table. All the data in the column will be lost.
  - You are about to drop the column `minPrice` on the `products` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "products_minPrice_idx";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "maxPrice",
DROP COLUMN "minPrice";
