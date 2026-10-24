# AGENTS.md — JEE Backend

## Tech Stack
- Express 5 + TypeScript
- Prisma 7 (multi-file schema in `prisma/model/*.prisma`)
- PostgreSQL
- Bun runtime
- Zod validation

## Hard Rules

### Framework
- Express **5** only
- Async handlers — **NO try/catch** in controllers, use `catchAsync` wrapper
- All responses via `sendResponse(res, { statusCode, success, message, data })`
- NO Mongoose, NO MongoDB — Prisma + PostgreSQL only

### User Model
- Fields: `id, email, phone?, password, name, role, isVerified, isActive, ...`
- **`name` is a SINGLE field** — NO `firstName` / `lastName`
- Role enum: `ADMIN | SELLER | CUSTOMER`

### API Response Format (always)
```json
{ "success": true, "message": "...", "data": { ... } }
{ "success": false, "message": "...", "data": null }
```

### Validation
- Zod validation **before** any DB query
- - **Strict Business Validation on Create/Update**: create/update সময় বিজনেস ফিল্ড ভ্যালিডেশন বাধ্যতামূলক (যদি না থাকে Zod ও service লেভেলে চেক যুক্ত করো; যেমন: SHIPPED এর সময় trackingNumber ও courierName, PROCESSING এর সময় serialNumbers ছাড়া আপডেট নিষিদ্ধ)
- Use `validateXxxInput()` helper returning `{ ok, value | errors }`
- On fail → 400 with field-level errors

### Module Structure
```
src/modules/<name>/
├── <name>.type.ts
├── <name>.constant.ts
├── <name>.validation.ts
├── <name>.repository.ts
├── <name>.service.ts
├── <name>.controller.ts
└── <name>.route.ts
```

### Error Handling
- Throw `AppError(message, statusCode)` from services
- Global `globalErrorHandler` maps errors
- See `.agents/rules/api-error-rules.md`

### Naming
- Files: `kebab-case.ts`
- Functions: `camelCase`
- Types: `PascalCase`
- Constants: `UPPER_SNAKE_CASE`

## Do NOT
- ❌ Mongoose / MongoDB
- ❌ `firstName` + `lastName` on User
- ❌ Raw `res.status().json()` — use `sendResponse`
- ❌ Inline SQL — use Prisma
- ❌ `try/catch` in controller — use `catchAsync`
- ❌ DB query without Zod validation

## Payment Policy
MVP: COD only — Payment মডেল ভবিষ্যতের জন্য (SSLCommerz ইত্যাদি) schema তে রাখা আছে, এখন ব্যবহার হবে না।

## Sales & Warranty Policy
MVP তে অফলাইন sale/warranty মোছা যাবে না। RETURNED = ডেলিভারি ব্যর্থতা (SHIPPED থেকে)। ডেলিভারির পরের return/refund পরে।

## কাজের নিয়ম
- কাজ main এ। নিজে branch বানাবে না, commit বা push করবে না (user করবে)।
- প্রতি session এর শুরুতে AGENTS.md ও docs/PROGRESS.md পড়ো। git status ফাঁকা না থাকলে থেমে জানাও।
- কাজ শেষে PROGRESS.md আপডেট করো: লাইন টিক, প্রমাণ (ফাইল + build/test ফল), Done log এ এক লাইন, "এখন কোন কাজ চলছে" বদলাও। ফাইল ১২০ লাইনের মধ্যে রাখো।
- নতুন কাজ শুরুর আগে বর্তমান milestone এর প্রথম TODO নাও।
- কাজ শুরুর আগে কোন ফাইলে কী বদলাবে তার তালিকা দিয়ে অনুমতি নাও। scope এর বাইরে হাত দেবে না।
- Build/test ফেল করলে architecture বদলে সমাধান করবে না, কারণ রিপোর্ট করে থামবে।
- git checkout -- . / reset --hard / clean জিজ্ঞেস না করে চালাবে না।
- Backend repo: schema (prisma/) আমার অনুমতি ছাড়া বদলাবে না। repository layer মানবে।
