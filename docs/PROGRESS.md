# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-02 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin: Global Product Items ক্লিনআপ ও Audit Logs ফিক্স সম্পন্ন; পরবর্তী কাজ Analytics

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE
- [x] AGENTS.md নিয়ম ও 5K-10K স্কেল গাইডলাইনস আছে — DONE
### M1 অনলাইন অর্ডার (COD) end-to-end
- [x] backend: order -> বৈধ status ধাপ -> DELIVERED -> item SOLD + warranty — DONE
- [x] frontend: admin status dropdown (বৈধ ধাপ, RETURNED, confirm dialog) — DONE
- [x] frontend: customer order list/details real API; Cancel শুধু PENDING — DONE
### M2 Public warranty check
- [x] backend: GET /warranties/check/:serial — DONE
- [x] frontend: /warranty real API — DONE
### M3 Seller
- [x] seller নতুন বিক্রি UI, বিক্রির ইতিহাস, নিজের warranty তালিকা — DONE
- [x] admin দিয়ে seller approve; seller এর serial দিয়ে item খোঁজার endpoint — DONE
### M4 Admin
- [x] orders, sellers, pending sellers, users: real API — DONE
- [x] warranties & claims desk: real API & technician update — DONE
- [x] brands: full CRUD, Add/Edit modal, real delete — DONE
- [x] product variant create & edit (Dual image: URL + File Upload) — DONE
- [x] Admin Dashboard Overview (`/admin`) real stats — DONE
- [x] Audit Logs (`/admin/audit-logs`) real tracking & working fix — DONE (auto-log, CSV export, payload inspect, safe search)
- [x] Global Product Items (`/admin/items`) বাদ দেওয়া হয়েছে (ভ্যারিয়েন্ট-ভিত্তিক আইটেম প্রিন্ট ও ম্যানেজমেন্ট সক্রিয়) — DONE
- [ ] Analytics (`/admin/analytics`) real insights/charts — TODO
- [ ] System Settings (`/admin/settings`) persistence — TODO (ইউজার পরে করবে)
- [ ] product create/edit (ক্লাউড ইমেজ আপলোড S3/Cloudinary) — PARTIAL (URL + Local Upload সম্পন্ন)
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; profile/warranty বাকি)
### M6 লঞ্চের আগে
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-02: অপ্রয়োজনীয় Global Product Items (`/admin/items`) রুট ও সাইডবার মেনু ক্লিনআপ সম্পন্ন; ভ্যারিয়েন্ট অনুযায়ী (`/admin/products/[id]/variants/[variantId]`) QR স্টিকার প্রিন্ট ও আইটেম ম্যানেজমেন্ট নির্বিঘ্নে চালু রাখা হয়েছে
- 2026-11-02: Audit Logs (`/admin/audit-logs`) এর ত্রুটি সমাধান করা হয়েছে (non-blocking `logAudit` ইউটিলিটি, সেলার/ওয়ারেন্টি/ব্র্যান্ড/ইউজার অ্যাকশনে অটো-লগিং, ফার্স্ট-রান অটো-ইনিশিয়ালাইজেশন, রিয়েল CSV এক্সপোর্ট এবং JSON পে-লোড ইন্সপেক্ট মোডাল; frontend lint ও backend build পাস: 0 errors)
- 2026-11-02: Admin Dashboard Overview (`/admin`) রিয়েল সমান্তরাল ডাটা ফেচিং এবং System Audit Logs (`/admin/audit-logs`) রিয়েল ব্যাকএন্ড API ইন্টিগ্রেশন সম্পন্ন (tsc/lint পাস: 0 errors)
- 2026-11-02: Admin Brand Management সম্পূর্ণ রিয়েল API CRUD ইন্টিগ্রেশন সম্পন্ন (Add Brand Modal, Edit Brand Modal, Real Delete Action; lint ও build পাস: 0 errors)
- 2026-11-02: Admin All Warranties (`/admin/warranties`) এবং Claims & Servicing Desk (`/admin/warranties/claims`) এর real API ইন্টিগ্রেশন সম্পন্ন
- 2026-11-02: Admin Product/Variant/Category তৈরি ও আপডেটের পর Instant On-Demand Cache Invalidation চালু (`revalidateTag`, `revalidatePath`)
