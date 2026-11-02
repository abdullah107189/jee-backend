# Jee.store PROGRESS (agent আপডেট রাখবে)
শেষ আপডেট: 2026-11-02 | Repo: frontend & backend

## এখন কোন কাজ চলছে
- M4 Admin: ভ্যারিয়েন্ট প্রোডাকশন ব্যাচ রিভার্স ক্রনোলজিক্যাল সর্টিং (সর্বশেষ ব্যাচ প্রথমে), মসৃণ হরিজন্টাল স্ক্রল ও মোবাইল-ফার্স্ট রেসপন্সিভ কার্ড লেআউট সম্পন্ন; পরবর্তী কাজ Analytics

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
- [x] Product Variant Production Batches (`/admin/products/[id]/variants/[variantId]`) — DONE (Reverse Sort: Newest Batch First, Horizontal Scroll, Mobile Card UI)
- [x] Global Date Format Hard Rule (Day first: DD MMM YYYY / DD/MM/YYYY) — DONE
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
- 2026-11-02: ভ্যারিয়েন্ট প্রোডাকশন ব্যাচ ও মোবাইল UX আপগ্রেড সম্পন্ন:
  1. **Newest Batch First**: একাধিক প্রোডাকশন ব্যাচ থাকলে সর্বশেষ ব্যাচটি কার্ডের শুরুতে আসবে (Batch #N `Latest` ট্যাগ সহ) এবং আগের ব্যাচগুলো ক্রমান্বয়ে সাজানো থাকবে।
  2. **Horizontal Scroll Container**: ১০-২০টি ব্যাচ থাকলেও স্ক্রলবার কন্টেইনারে মসৃণভাবে হরাইজন্টালি স্লাইড করা যায়, ফলে পেজ লম্বা হয়ে নষ্ট হয় না।
  3. **Filter Units Overflow Scroll**: ফিল্টার পিলস বারে `overflow-x-auto` এবং `whitespace-nowrap` যোগ যাতে ফোনে ও ডেস্কটপে স্মুথভাবে স্ক্রল হয়।
  4. **Mobile-First UX/UI**: ফোনে টেবিলের বদলে সুন্দর টাচ-ফ্রেন্ডলি কার্ড ভিউ (সিরিয়াল নাম্বার, স্ট্যাটাস, ব্যাচ, ডেট এবং সিঙ্গেল-ট্যাপ স্টিকার প্রিন্ট ও ডিলিট বাটন), রেসপন্সিভ হেডার এবং ফুল-স্ক্রিন ফ্রেন্ডলি মোডাল ডায়ালগ।
