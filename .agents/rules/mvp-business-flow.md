---
trigger: always_on
---

# Jee.store MVP Business Flow

Source of truth for how the business works. Agents: read this before touching orders, payments, sales, warranties or notifications. If code and this file disagree, ask me, do not guess.

## 1. What the system is
Electronics shop (fans, lights, etc.) with **serial-numbered items**. Every physical unit is a `ProductItem`. Sold online (customers) and in-store (sellers). Each sold unit gets a warranty.

## 2. Roles
| Role | Can do |
|---|---|
| ADMIN | Everything: catalog, items, orders, payment verification, sellers, warranty claims, logs |
| SELLER (must be APPROVED) | Add items to stock, make offline sales, view own sales and warranties |
| CUSTOMER | Browse, order, pay, view own orders/warranties, file warranty claims |
| Guest | Browse, public warranty lookup by serial number |

Seller status: PENDING -> APPROVED (by admin). SUSPENDED/DISABLED sellers cannot sell.

## 3. Catalog and stock
- Category -> Product -> ProductVariant (price, attributes) -> ProductItem (one real unit, unique serial per variant).
- Item status: AVAILABLE, RESERVED, SOLD, DAMAGED, RETURNED, UNDER_REPAIR.
- **Real stock = count of AVAILABLE items.** `ProductVariant.stockQuantity` is only a cache. Update it in the same transaction whenever an item status changes.
- Only published + active products with AVAILABLE items can be bought.

## 4. Online order flow
1. Customer adds variants to cart, goes to checkout, picks address and payment way (COD or FULL).
2. Server (one transaction): check each variant has enough AVAILABLE items, pick items, set them RESERVED, create OnlineOrder (PENDING) + OnlineOrderItems. Server computes subtotal, discount, tax, shipping, total. Never trust client prices.
3. **COD:** admin confirms the order -> CONFIRMED.
4. **FULL (manual payment: bKash/Nagad/Rocket/bank):** customer submits Payment (method, amount, transactionId, optional proof image) -> status SUBMITTED, order paymentStatus PENDING. Admin checks it:
   - VERIFIED -> order paymentStatus PAID, order CONFIRMED.
   - REJECTED -> reason saved, customer can submit again.
5. Admin moves order: CONFIRMED -> PROCESSING -> SHIPPED (trackingNumber) -> DELIVERED.
6. On DELIVERED (one transaction): items -> SOLD, `deliveredAt` set, **warranty auto-created for each item** (see section 6). For COD, paymentStatus -> PAID.
7. Cancel: allowed only while PENDING or CONFIRMED (customer own order, or admin). Items back to AVAILABLE. If already PAID, admin handles refund manually and sets REFUNDED.
8. Return after delivery: admin sets RETURNED, item -> RETURNED (admin decides later: AVAILABLE or DAMAGED), warranty -> VOID.

Allowed status moves only forward as above. Reject anything else.

## 5. Offline (in-store) sale flow
1. Seller opens POS, scans/enters serial number.
2. Item must exist and be AVAILABLE, else reject.
3. Enter buyer name + phone (walk-in) or link an existing Customer. Enter price, discount, tax, payment method.
4. Server (one transaction): create OfflineSale with unique invoice number, compute total = price - discount + tax, item -> SOLD, create warranty (saleType OFFLINE), update stock cache.
5. Seller can print/see invoice. Seller only sees own sales. Admin sees all.

## 6. Warranty
- Created automatically on DELIVERED (online) or offline sale. Never created by hand in normal flow.
- startDate = delivery/sale date. endDate = startDate + `Product.warrantyMonths`. Terms copied from `Product.warrantyTerms`.
- Status: ACTIVE -> EXPIRED (when endDate passes, check on read or daily job), VOID (admin/return), CLAIMED (only after a claim is APPROVED).
- Public lookup: by serial number (+ phone for walk-in buyers). Show only status, product, dates. No personal data.
- Customers see only their own warranties. Sellers see warranties they issued.

## 7. Warranty claim flow
1. Customer picks own ACTIVE warranty, describes the problem -> claim SUBMITTED (claimNumber generated). Check ownership on the server.
2. Admin: UNDER_REVIEW -> APPROVED or REJECTED (with resolution note).
3. If APPROVED: warranty -> CLAIMED, item -> UNDER_REPAIR, claim UNDER_REPAIR -> COMPLETED. When done, item goes back to customer (status stays SOLD or as admin decides).
4. Claim limit: LIMITED = one active claim at a time (decide the exact count with me); UNLIMITED = no limit.
5. Cannot file a claim on EXPIRED or VOID warranty.

## 8. Notifications (MVP: IN_APP only)
Create a Notification on:
- Order placed, confirmed, shipped, delivered, cancelled -> customer
- Payment verified or rejected -> customer
- New order, new payment submitted -> admins
- Claim submitted -> admins. Claim status changed -> customer
- Seller approved/suspended -> seller
Create these inside the same service call that changes the status, not in controllers.

## 9. Audit and activity logs
- AuditLog (admin-level, with before/after in `changes`): product/variant/item create-update-delete, order status change, payment verify/reject, seller approval, claim status change, user role/active change.
- ActivityLog (lighter, user actions): login, order placed, claim filed.
- Write logs in services. Never log passwords, tokens or OTPs.

## 10. Out of MVP (do not build now)
Reviews, SMS/push/email marketing notifications, payment gateway integration, automatic refunds, warranty transfer, promotions/coupons, admin UI for filters, multi-warehouse.

## 11. Known schema gaps (fix when told, not before)
- `OfflineSale` lacks invoiceNumber, buyer name/phone, price, discount, tax, total, payment method/status (decision: add them, Option A).
- `Warranty.offlineSaleId` exists but has no relation to `OfflineSale`. Decide: add relation, or drop the field.
- `Review` has no `@@map`, and is out of MVP.
- Stock cache vs item count can drift. Always update both in one transaction.

## 12. Build order
1. Backend compiles (`tsc` clean), security holes closed.
2. Catalog + stock + items.
3. Online order + manual payment verification.
4. Warranty auto-create + claims.
5. Offline sale (POS).
6. Notifications + audit logs.
7. Replace frontend mock data, one dashboard at a time.