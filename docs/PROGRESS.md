# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-03 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin সম্পূর্ণ সম্পন্ন! সিস্টেম সেটিংস পারসিস্টেন্স (`/admin/settings`) ও রিয়েল ডাটাবেজ ব্যাকআপ সম্পন্ন। পরবর্তী কাজ: M5 Customer Dashboard (রিয়েল API, প্রোফাইল, ওয়ারেন্টি ট্র্যাকিং ও ক্লেইম)।

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
### M4 Admin (সম্পূর্ণ সম্পন্ন ✅)
- [x] orders, sellers, pending sellers, users: real API — DONE
- [x] warranties & claims desk: real API & technician update — DONE
- [x] brands: full CRUD, Add/Edit modal, real delete — DONE
- [x] product variant create & edit (Dual image: URL + File Upload) — DONE
- [x] Admin Dashboard Overview (`/admin`) real stats — DONE
- [x] Audit Logs (`/admin/audit-logs`) real tracking & working fix — DONE
- [x] Product Variant Production Batches (`/admin/products/[id]/variants/[variantId]`) — DONE
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE
- [x] Analytics (`/admin/analytics`) real insights/charts — DONE
- [x] System Settings (`/admin/settings`) persistence & DB snapshot backup — DONE
### M5 Customer dashboard
- [ ] orders, warranties, profile real API (mock বাদ) — PARTIAL (orders DONE; profile/warranty বাকি)
### M6 লঞ্চের আগে
- [ ] 5K-10K কনকারেন্ট ট্রাফিক লোড টেস্টিং, রেট-লিমিট ও সিকিউরিটি টেস্ট — TODO
- [x] অনেকক্ষণ PENDING অর্ডার (MVP: admin হাতে cancel) — DONE
- [ ] deploy, migrate deploy, DB backup — TODO

## Done log
- 2026-11-03:
  1. `JEE backend`: নতুন `/api/v1/settings` মডিউল যুক্ত করা হয়েছে (`setting.service.ts`, `setting.controller.ts`, `setting.route.ts`)। স্টোর প্রোফাইল, COD পেমেন্ট অপশন, ডিফল্ট ওয়ারেন্টি পলিসি ও অডিট সেটিংস পারসিস্টেন্টলি সেভ হয় এবং অডিট লগে রেকর্ড হয়।
  2. `JEE backend`: `GET /api/v1/settings/backup` এন্ডপয়েন্ট তৈরি করা হয়েছে যা সম্পূর্ণ ডাটাবেজ (ক্যাটাগরি, ব্র্যান্ড, প্রোডাক্ট, ভ্যারিয়েন্ট, আইটেম, অর্ডার, সেলস, ওয়ারেন্টি, সেলার ও কাস্টমার) থেকে রিয়েলটাইম JSON স্ন্যাপশট তৈরি করে।
  3. `Jee frontend`: `admin.service.ts`-এ `getSystemSettings()`, `updateSystemSettings()`, এবং `getDatabaseBackup()` যুক্ত করা হয়েছে।
  4. `SettingsContent.tsx`: Shadcn UI ও 60-30-10 কালার নিয়মে রিফ্যাক্টর করা হয়েছে; লাইভ ফর্ম সেভ এবং "Backup Now" বাটনে এক ক্লিকে রিয়েল JSON ব্যাকআপ ফাইল ডাউনলোড চালু করা হয়েছে।
  5. `bun run build` (backend) ও `bun run lint` (frontend) সফলভাবে পাস (0 errors)।
