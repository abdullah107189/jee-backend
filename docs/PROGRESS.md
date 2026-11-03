# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-03 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin: রিয়েল অ্যানালিটিক্স ও রিপোর্টস (`/admin/analytics`) এন্ড-টু-এন্ড সম্পন্ন (রিয়েল ব্যাকএন্ড এগ্রিগেশন, সেলস ট্রেন্ড, ক্যাটাগরি ডিস্ট্রিবিউশন, টপ সেলার, বেস্ট সেলিং প্রোডাক্ট, লো-স্টক অ্যালার্ট, এক্সপায়ারিং ওয়ারেন্টি, ডাইনামিক ফিল্টারিং, 60-30-10 কালার ও CSV এক্সপোর্ট)।

## নিয়ম
DONE = build পাস + প্রমাণ | PARTIAL = কী বাকি লেখো | TODO | UNVERIFIED

## Milestones
### M0 স্থিতিশীল করা
- [x] পুরনো feature branch main এ merge, build/test পাস — DONE
- [x] AGENTS.md নিয়ম, 5K-10K স্কেল, 60-30-10 কালার ও Day-first Date Format গাইডলাইনস আছে — DONE
- [x] ডার্ক/লাইট মোড (Shadcn ThemeProvider + 1-Click Navbar Toggle + Zero FOUC) — DONE
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
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE
- [x] Analytics (`/admin/analytics`) real insights/charts — DONE
- [ ] System Settings (`/admin/settings`) persistence — TODO (ইউজার পরে করবে)
- [ ] product create/edit (ক্লাউড ইমেজ আপলোড S3/Cloudinary) — PARTIAL (URL + Local Upload সম্পন্ন)
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; profile/warranty বাকি)
### M6 লঞ্চের আগে
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-03:
  1. `JEE backend`: নতুন `/api/v1/analytics` মডিউল তৈরি করা হয়েছে (`analytics.service.ts`, `analytics.controller.ts`, `analytics.route.ts`, `analytics.type.ts`) যা রিয়েল ডেটাবেজ (OnlineOrder, OfflineSale, ProductVariant, Warranty, Category) থেকে সেলস ট্রেন্ড, ক্যাটাগরি সেলস, টপ সেলার, বেস্ট সেলিং প্রোডাক্ট, লো-স্টক ও এক্সপায়ারিং ওয়ারেন্টি লাইভ এগ্রিগেট করে।
  2. `Jee frontend`: `admin.service.ts`-এর `getAnalytics()` থেকে সব মক ডেটা সরিয়ে রিয়েল API কানেক্ট করা হয়েছে।
  3. `AnalyticsContent.tsx`: Shadcn UI ডিজাইন ও 60-30-10 কালার রুল অনুযায়ী নতুন KPI সামারি কার্ড, ফিল্টার রি-রেন্ডারিং (This Month, Quarter, Year, All Time), রিয়েল CSV এক্সপোর্ট, এবং ডে-ফার্স্ট ডেট ফরম্যাটিং (`formatAppDate`) যুক্ত করা হয়েছে।
  4. ফ্রন্টএন্ড (`bun run lint`) এবং ব্যাকএন্ড (`bun run build`) টাইপচেক সফলভাবে পাস (0 errors)।
