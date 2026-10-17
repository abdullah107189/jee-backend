-- DropIndex
DROP INDEX "online_order_items_productItemId_key";

-- AlterTable
ALTER TABLE "offline_sales" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "customerName" TEXT,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "invoiceNumber" TEXT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "paymentMethod" "PaymentMethod" NOT NULL DEFAULT 'CASH',
ADD COLUMN     "salePrice" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "tax" DECIMAL(12,2) NOT NULL DEFAULT 0,
ADD COLUMN     "total" DECIMAL(12,2) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "offline_sales_invoiceNumber_key" ON "offline_sales"("invoiceNumber");
