# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-02 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin: ডেট সিস্টেম স্ট্যান্ডার্ডাইজেশন (Day first: DD MMM YYYY) ও রিয়েল ম্যানুফ্যাকচার ডেট গ্রুপিং সম্পন্ন; পরবর্তী কাজ Analytics

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE
- [x] AGENTS.md নিয়ম, 5K-10K স্কেল ও Day-first Date Format গাইডলাইনস আছে — DONE
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
- [x] Audit Logs (`/admin/audit-logs`) real tracking & working fix — DONE
- [x] Product Variant Production Batches (`/admin/products/[id]/variants/[variantId]`) — DONE
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE (AGENTS.md আপডেট, `formatAppDate`, `formatAppDateTime`, real `manufacturedAt` batch clustering)
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
- 2026-11-02: ডেট ফরম্যাটিং স্ট্যান্ডার্ডাইজেশন এবং রিয়েল ম্যানুফ্যাকচার ডেট গ্রুপিং সম্পন্ন:
  1. `AGENTS.md` (Frontend & Backend) এ "Always Day First" (`DD MMM YYYY`, যেমন `02 Nov 2026` বা `DD/MM/YYYY`) হার্ড রুল সংযোজন।
  2. `src/lib/utils.ts` এ সার্বজনীন `formatAppDate`, `formatAppDateTime` ও `formatAppDateNumeric` ইউটিলিটি যোগ।
  3. ভ্যারিয়েন্ট ডিটেইলসে ইনসার্ট টাইম (`createdAt`) এর বদলে ইউজারের দেওয়া আসল উৎপাদন তারিখ (`manufacturedAt`) অনুযায়ী ব্যাচ গ্রুপিং ও টেবিলে ডিসপ্লে (ভিন্ন ভিন্ন তারিখে আপলোড করা মাল আলাদা আলাদা ব্যাচ কার্ড ও তারিখ দেখাচ্ছে)।
  4. অডিট লগ ও ভ্যারিয়েন্ট পেজে ডেট ফরম্যাট আমেরিকান (`Month Day, Year`) এর বদলে সম্পূর্ণ `Day Month Year` এ রূপান্তর (tsc ও build পাস: 0 errors)।
