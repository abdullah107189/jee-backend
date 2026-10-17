---
trigger: always_on
---

# Prisma Rules — JEE Backend

## Schema Layout (Prisma 7 multi-file)
```
prisma/
├── schema.prisma          # generator + datasource only
└── model/
    ├── user.prisma
    ├── product.prisma
    ├── order.prisma
    ├── offline-sale.prisma
    └── ...
```
- `prisma.config.ts` sets `schema: "prisma"` (folder root)
- After change: `npx prisma migrate dev --name <name>` + `npx prisma generate`

## OfflineSale (POS)
- 1 sale = 1 ProductItem (serial-scoped)
- Fields: `productItemId @unique, sellerId, customerId?, customerName, customerPhone, customerEmail?, salePrice, discount, tax, total, invoiceNumber? @unique, paymentMethod, paymentStatus, saleDate, notes?`
- Auto-create `Warranty` on sale completion
- Invoice number server-generated: `INV-<timestamp><random>`

## ProductItem — Serial Tracking
- Each physical unit = 1 ProductItem row
- Fields: `id, variantId, serialNumber, status, metadata?, manufacturedAt?`
- Status flow: `AVAILABLE → RESERVED → SOLD`
- Return flow: `SOLD → RETURNED → AVAILABLE`
- `@@unique([variantId, serialNumber])`
- Index: `@@index([status])`

## Money Fields
- Always `Decimal @db.Decimal(12, 2)`
- NO `Float` for money
- Convert to `Number()` in service before response

## Soft Delete
- Use `deletedAt DateTime?`
- Filter `deletedAt: null` in all queries
- NEVER hard-delete critical records

## Migrations
```bash
npx prisma migrate dev --name add_<feature>
npx prisma generate
```
- Dev only: `npx prisma migrate reset` (destroys data)
- Production: `npx prisma migrate deploy`

## Indexes
- `@@index([foreignKey])` on all FK
- `@@index([status])`, `@@index([createdAt])` on query columns
- `@@unique([field1, field2])` for composite

## Do NOT
- ❌ Edit applied migrations
- ❌ Skip `prisma generate`
- ❌ `Float` for money
- ❌ Hard delete