# Skill — POS Offline Sale

## Purpose
Seller counter e POS terminal: scan serial → create OfflineSale → auto-generate Warranty.

## Workflow

### 1. Scan serial
`POST /offline-sales/scan` → validate ProductItem + return variant + price

### 2. Fill customer + payment
```json
{
  "productItemId": "...",
  "customerName": "Abdullah",
  "customerPhone": "01711111111",
  "salePrice": 5000,
  "discount": 200,
  "paymentMethod": "CASH"
}
```

### 3. `POST /offline-sales` — service logic
```ts
const create = async (sellerUserId: string, input) => {
  const seller = await sellerRepo.findByUserId(sellerUserId);
  if (!seller) throw new AppError("Seller profile not found", 404);

  return prisma.$transaction(async (tx) => {
    // 1. Validate ProductItem serial
    const item = await tx.productItem.findUnique({
      where: { id: input.productItemId },
    });
    if (!item) throw new AppError("Item not found", 404);
    if (item.status !== "AVAILABLE") {
      throw new AppError("Item is not available for sale", 409);
    }
    if (item.deletedAt) throw new AppError("Item is deleted", 400);

    // 2. Compute total
    const total = input.salePrice - (input.discount ?? 0) + (input.tax ?? 0);

    // 3. Generate invoice number
    const invoiceNumber = `INV-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

    // 4. Create OfflineSale
    const sale = await tx.offlineSale.create({
      data: {
        productItemId: item.id,
        sellerId: seller.id,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        customerId: input.customerId ?? null,
        salePrice: input.salePrice,
        discount: input.discount ?? 0,
        tax: input.tax ?? 0,
        total,
        paymentMethod: input.paymentMethod,
        paymentStatus: "PAID",
        invoiceNumber,
        notes: input.notes,
      },
    });

    // 5. Mark item SOLD
    await tx.productItem.update({
      where: { id: item.id },
      data: { status: "SOLD" },
    });

    // 6. Auto-create Warranty
    const variant = await tx.productVariant.findUnique({
      where: { id: item.variantId },
      include: { product: { select: { warrantyMonths: true, warrantyTerms: true } } },
    });

    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + (variant?.product.warrantyMonths ?? 12));

    const warranty = await tx.warranty.create({
      data: {
        productItemId: item.id,
        sellerId: seller.id,
        customerId: input.customerId ?? null,
        customerName: input.customerName,
        customerPhone: input.customerPhone,
        startDate,
        endDate,
        status: "ACTIVE",
      },
    });

    return { sale, warranty };
  });
};
```

### 4. Response shape
```json
{
  "success": true,
  "message": "Sale completed",
  "data": {
    "saleId": "...",
    "invoiceNumber": "INV-XXXX",
    "total": 4800,
    "warrantyId": "...",
    "warrantyEndDate": "2027-10-10"
  }
}
```

## Endpoints
```
POST /offline-sales/scan       # scan serial → item validation
POST /offline-sales            # create sale (SELLER only)
GET  /offline-sales            # list (SELLER own, ADMIN all)
GET  /offline-sales/:id        # detail
POST /offline-sales/:id/void   # void (ADMIN only)
```

## Rules
- Always `prisma.$transaction` — item + sale + warranty atomic
- Lock ProductItem status before sale (`AVAILABLE` check)
- Auto-create Warranty from `Product.warrantyMonths`
- Invoice number server-side generated
- Void → item status → `AVAILABLE`, warranty → `VOID`
- Auth: `authorize("SELLER")` for create, `authorize("SELLER","ADMIN")` for read