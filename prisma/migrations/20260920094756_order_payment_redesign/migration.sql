/*
  Warnings:

  - The values [Bkash,Nagad,Rocket] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `customerEmail` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `customerName` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `customerPhone` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `invoiceNumber` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `notes` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `paymentMethod` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `paymentStatus` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `salePrice` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `tax` on the `offline_sales` table. All the data in the column will be lost.
  - You are about to drop the column `total` on the `offline_sales` table. All the data in the column will be lost.
  - The `paymentStatus` column on the `online_orders` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `gateway` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `gatewayResponse` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `offlineSaleId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `processedAt` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `verificationStatus` on the `payments` table. All the data in the column will be lost.
  - The `status` column on the `payments` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `variantId` to the `online_order_items` table without a default value. This is not possible if the table is not empty.
  - Made the column `onlineOrderId` on table `payments` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "PaymentWay" AS ENUM ('COD', 'FULL');

-- CreateEnum
CREATE TYPE "OrderPaymentStatus" AS ENUM ('UNPAID', 'PENDING', 'PAID', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentRecordStatus" AS ENUM ('PENDING', 'SUBMITTED', 'VERIFIED', 'REJECTED', 'CANCELLED');

-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'BKASH', 'NAGAD', 'ROCKET', 'BANK_TRANSFER', 'CARD', 'OTHER');
ALTER TABLE "payments" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "public"."PaymentMethod_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_offlineSaleId_fkey";

-- DropForeignKey
ALTER TABLE "payments" DROP CONSTRAINT "payments_onlineOrderId_fkey";

-- DropForeignKey
ALTER TABLE "warranties" DROP CONSTRAINT "warranties_offlineSaleId_fkey";

-- DropIndex
DROP INDEX "offline_sales_customerId_idx";

-- DropIndex
DROP INDEX "offline_sales_invoiceNumber_idx";

-- DropIndex
DROP INDEX "offline_sales_invoiceNumber_key";

-- DropIndex
DROP INDEX "online_orders_orderNumber_idx";

-- DropIndex
DROP INDEX "payments_offlineSaleId_idx";

-- DropIndex
DROP INDEX "payments_transactionId_idx";

-- AlterTable
ALTER TABLE "offline_sales" DROP COLUMN "customerEmail",
DROP COLUMN "customerName",
DROP COLUMN "customerPhone",
DROP COLUMN "discount",
DROP COLUMN "invoiceNumber",
DROP COLUMN "notes",
DROP COLUMN "paymentMethod",
DROP COLUMN "paymentStatus",
DROP COLUMN "salePrice",
DROP COLUMN "tax",
DROP COLUMN "total";

-- AlterTable
ALTER TABLE "online_order_items" ADD COLUMN     "variantId" TEXT NOT NULL,
ALTER COLUMN "price" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2);

-- AlterTable
ALTER TABLE "online_orders" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentWay" "PaymentWay" NOT NULL DEFAULT 'COD',
ALTER COLUMN "subtotal" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "discount" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "tax" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "shipping" SET DATA TYPE DECIMAL(12,2),
ALTER COLUMN "total" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "paymentStatus",
ADD COLUMN     "paymentStatus" "OrderPaymentStatus" NOT NULL DEFAULT 'UNPAID';

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "gateway",
DROP COLUMN "gatewayResponse",
DROP COLUMN "offlineSaleId",
DROP COLUMN "processedAt",
DROP COLUMN "verificationStatus",
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'BDT',
ADD COLUMN     "payerAccount" TEXT,
ADD COLUMN     "paymentNote" TEXT,
ADD COLUMN     "proofImage" TEXT,
ADD COLUMN     "rejectionReason" TEXT,
ALTER COLUMN "onlineOrderId" SET NOT NULL,
ALTER COLUMN "amount" SET DATA TYPE DECIMAL(12,2),
DROP COLUMN "status",
ADD COLUMN     "status" "PaymentRecordStatus" NOT NULL DEFAULT 'SUBMITTED';

-- DropEnum
DROP TYPE "PaymentStatus";

-- DropEnum
DROP TYPE "PaymentVerificationStatus";

-- CreateIndex
CREATE INDEX "online_order_items_variantId_idx" ON "online_order_items"("variantId");

-- CreateIndex
CREATE INDEX "online_orders_paymentStatus_idx" ON "online_orders"("paymentStatus");

-- CreateIndex
CREATE INDEX "online_orders_paymentWay_idx" ON "online_orders"("paymentWay");

-- CreateIndex
CREATE INDEX "payments_status_idx" ON "payments"("status");

-- CreateIndex
CREATE INDEX "payments_method_idx" ON "payments"("method");

-- CreateIndex
CREATE INDEX "payments_createdAt_idx" ON "payments"("createdAt");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_onlineOrderId_fkey" FOREIGN KEY ("onlineOrderId") REFERENCES "online_orders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
