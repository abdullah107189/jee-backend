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