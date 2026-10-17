# Skill — Add Backend Module

## Standard Steps

### 1. Prisma model (if needed)
Create `prisma/model/<name>.prisma`:
```prisma
model X {
  id        String   @id @default(cuid())
  // fields
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  deletedAt DateTime?

  @@index([...])
  @@map("xs")
}
```
Run: `npx prisma migrate dev --name add_<name>` + `npx prisma generate`

### 2. Create module files (7 files)
```
src/modules/<name>/
├── <name>.type.ts          # Prisma includes, DTOs, input types
├── <name>.constant.ts      # Messages, enums
├── <name>.validation.ts    # Zod schemas + validateXxxInput()
├── <name>.repository.ts    # DB queries (Prisma)
├── <name>.service.ts       # Business logic
├── <name>.controller.ts    # HTTP handlers (catchAsync)
└── <name>.route.ts         # Router + auth middleware
```

### 3. `<name>.type.ts`
```ts
import type { Prisma } from "../../../prisma/generated/prisma/client";

export const X_INCLUDE = { ... } satisfies Prisma.XInclude;
export type XWithRelations = Prisma.XGetPayload<{ include: typeof X_INCLUDE }>;

export interface CreateXInput { ... }
export interface UpdateXInput { ... }
```

### 4. `<name>.validation.ts`
```ts
import { z } from "zod";
export const createXSchema = z.object({ ... });
export const updateXSchema = createXSchema.partial();
export type CreateXInput = z.infer<typeof createXSchema>;
```

### 5. `<name>.repository.ts`
```ts
export const xRepository = {
  findMany(params) { return prisma.x.findMany({ where: {...}, include: X_INCLUDE }); },
  findById(id) { return prisma.x.findUnique({ where: { id }, include: X_INCLUDE }); },
  create(data) { return prisma.x.create({ data, include: X_INCLUDE }); },
  update(id, data) { return prisma.x.update({ where: { id }, data, include: X_INCLUDE }); },
  softDelete(id) { return prisma.x.update({ where: { id }, data: { deletedAt: new Date() } }); },
};
```

### 6. `<name>.service.ts`
```ts
const create = async (input: CreateXInput) => {
  const existing = await xRepository.findById(input.id);
  if (existing) throw new AppError("Already exists", 409);
  return xRepository.create({ ... });
};
export const xService = { create, list, getById, update, remove };
```

### 7. `<name>.controller.ts`
```ts
const create = catchAsync(async (req, res) => {
  const result = validateCreateXInput(req.body);
  if (!result.ok) return sendResponse(res, { statusCode: 400, success: false, message: "Validation failed", data: result.errors });
  const data = await xService.create(result.value);
  sendResponse(res, { statusCode: 201, success: true, message: X_MESSAGES.CREATED, data });
});
export const xController = { create, list, getById, update, remove };
```

### 8. `<name>.route.ts`
```ts
const router = Router();
router.get("/", xController.list);
router.get("/:id", xController.getById);
router.post("/", authenticate, authorize("ADMIN"), xController.create);
router.patch("/:id", authenticate, authorize("ADMIN"), xController.update);
router.delete("/:id", authenticate, authorize("ADMIN"), xController.remove);
export default router;
```

### 9. Register in `src/routes/index.ts`
```ts
import xRoutes from "../modules/<name>/<name>.route";

const moduleRoutes = [
  // ...
  { path: "/xs", route: xRoutes },
];
```

### 10. Test
```bash
curl http://localhost:5000/api/v1/xs
```

## Checklist
- [ ] Prisma model + migration
- [ ] 7 module files
- [ ] Route registered in `routes/index.ts`
- [ ] Auth middleware (`authenticate` + `authorize`)
- [ ] `sendResponse` everywhere
- [ ] `AppError` for known errors
- [ ] Zod validation before DB
- [ ] Tested with curl