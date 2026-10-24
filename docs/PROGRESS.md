# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-10-24 | Repo: backend

## এখন কোন কাজ চলছে
- M3: Seller

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE (main branch, bun run build পাস, bun test: 14 pass, 0 fail)
- [x] AGENTS.md নিয়ম আছে — DONE (AGENTS.md আপডেট সম্পন্ন)
### M1 অনলাইন অর্ডার (COD) end-to-end
- [x] backend: order -> বৈধ status ধাপ -> DELIVERED -> item SOLD + warranty (টেস্টসহ) — DONE (src/modules/order/order.service.ts, src/modules/order/order.route.ts, tests/mvp-flow.test.ts Case c2 & c3)
- [x] frontend: admin status dropdown (বৈধ ধাপ, RETURNED, confirm dialog) — অন্য repo
- [x] frontend: customer order list/details real API; Cancel শুধু PENDING — অন্য repo
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial — DONE (src/modules/warranty/warranty.route.ts, src/modules/warranty/warranty.service.ts, tests/mvp-flow.test.ts Case k)
- [x] frontend: /warranty real API (mock বাদ) — অন্য repo (frontend এ সম্পন্ন)
### M3 Seller
- [ ] সিদ্ধান্ত: seller account কে বানাবে (খোলা প্রশ্ন) — TODO
- [x] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — DONE (src/modules/seller/seller.service.ts, src/modules/product/product.route.ts)
- [x] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — DONE backend API (src/modules/offline-sale/offline-sale.service.ts, tests/mvp-flow.test.ts Case f)
### M4 Admin
- [x] product create/edit (ছবি আপলোডসহ) — PARTIAL (src/modules/product/product.service.ts create/update endpoints প্রস্তুত, direct file upload বাদ)
- [x] orders, sellers, pending sellers, users: mock বাদ, real API — DONE backend API (src/modules/order, src/modules/seller, src/modules/user)
### M5 Customer dashboard
- [x] orders, warranties, profile real API (mock বাদ) — DONE backend API (src/modules/order/order.route.ts, src/modules/warranty/warranty.route.ts, src/modules/user/user.route.ts)
### M6 লঞ্চের আগে
- [ ] seed admin, env নথি, CORS/helmet/rate limit — PARTIAL (rate limit সম্পন্ন, seed ও env নথি বাকি)
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE (admin can cancel via PATCH /orders/:id/status)
- [ ] deploy, migrate deploy, DB backup — TODO

## MVP এর পরে
ডেলিভারির পরের return/refund, warranty claim, notification, review, banner/settings,
SSLCommerz, analytics, audit log UI

## সিদ্ধান্ত
- MVP: COD only; Payment মডেল ভবিষ্যতের জন্য, ব্যবহার হয় না
- RETURNED = ডেলিভারি ব্যর্থ (SHIPPED থেকে)
- sale/warranty মোছা যায় না (void/return পরে)
- Frontend: শুধু App Router, src/pages নয়
- কাজ main এ, user নিজে commit করে

## খোলা প্রশ্ন
- seller account কে বানাবে? (সুপারিশ: admin বানাবে/approve করবে, APPROVED ছাড়া বিক্রি নেই)

## Done log
- 2026-10-24: Frontend /warranty real API সম্পন্ন (mock বাদ)
- 2026-10-24: Order transitions (RETURNED, DELIVERED -> item SOLD + warranty) ও 14টি integration টেস্ট পাস
- 2026-10-24: Public warranty check GET /warranties/check/:serialNumber সম্পন্ন
- 2026-10-24: Backend build ও test পাস (bun run build & bun test: 14 pass, 0 fail)
