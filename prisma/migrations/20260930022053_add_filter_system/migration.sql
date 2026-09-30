-- CreateEnum
CREATE TYPE "FilterType" AS ENUM ('MULTI_SELECT', 'SINGLE_SELECT', 'RANGE', 'BOOLEAN');

-- CreateTable
CREATE TABLE "filter_groups" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filter_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filters" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "type" "FilterType" NOT NULL,
    "filterGroupId" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "filters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "filter_options" (
    "id" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "filter_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "product_filter_values" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "filterId" TEXT NOT NULL,
    "filterOptionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_filter_values_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "filter_groups_slug_key" ON "filter_groups"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "filter_groups_categoryId_key" ON "filter_groups"("categoryId");

-- CreateIndex
CREATE INDEX "filter_groups_categoryId_idx" ON "filter_groups"("categoryId");

-- CreateIndex
CREATE INDEX "filters_filterGroupId_idx" ON "filters"("filterGroupId");

-- CreateIndex
CREATE INDEX "filter_options_filterId_idx" ON "filter_options"("filterId");

-- CreateIndex
CREATE UNIQUE INDEX "filter_options_filterId_value_key" ON "filter_options"("filterId", "value");

-- CreateIndex
CREATE INDEX "product_filter_values_productId_idx" ON "product_filter_values"("productId");

-- CreateIndex
CREATE INDEX "product_filter_values_filterId_filterOptionId_idx" ON "product_filter_values"("filterId", "filterOptionId");

-- CreateIndex
CREATE UNIQUE INDEX "product_filter_values_productId_filterId_filterOptionId_key" ON "product_filter_values"("productId", "filterId", "filterOptionId");

-- AddForeignKey
ALTER TABLE "filter_groups" ADD CONSTRAINT "filter_groups_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filters" ADD CONSTRAINT "filters_filterGroupId_fkey" FOREIGN KEY ("filterGroupId") REFERENCES "filter_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "filter_options" ADD CONSTRAINT "filter_options_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_filter_values" ADD CONSTRAINT "product_filter_values_productId_fkey" FOREIGN KEY ("productId") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_filter_values" ADD CONSTRAINT "product_filter_values_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "filters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "product_filter_values" ADD CONSTRAINT "product_filter_values_filterOptionId_fkey" FOREIGN KEY ("filterOptionId") REFERENCES "filter_options"("id") ON DELETE CASCADE ON UPDATE CASCADE;
