---
trigger: always_on
---

# API Error Rules — JEE Backend

## AppError
```ts
export default class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = "AppError";
  }
}
```

## Prisma Error Mapping

| Prisma Code | HTTP Status | Meaning |
|-------------|-------------|---------|
| `P2002` | **409** | Unique constraint violation |
| `P2025` | **404** | Record not found |
| `P2003` | **400** | Foreign key constraint fail |
| `P2014` | **400** | Relation violation |
| `P2000` | **400** | Value too long |

## Zod Errors → 400
```ts
if (!result.ok) {
  return sendResponse(res, {
    statusCode: 400,
    success: false,
    message: "Validation failed",
    data: result.errors,   // field-level errors
  });
}
```

## Global Error Handler Shape
```json
{
  "success": false,
  "message": "Human-readable message",
  "errorSources": [{ "path": "field", "message": "..." }],
  "stack": "..." // only in development
}
```

## Service Pattern
```ts
if (!user) throw new AppError("User not found", 404);
if (existing) throw new AppError("Email already exists", 409);
if (!item) throw new AppError("Item not available", 400);
```

## Controller Pattern
```ts
const create = catchAsync(async (req, res) => {
  const result = validateCreateXInput(req.body);
  if (!result.ok) {
    return sendResponse(res, {
      statusCode: 400,
      success: false,
      message: "Validation failed",
      data: result.errors,
    });
  }
  const data = await xService.create(result.value);
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: X_MESSAGES.CREATED,
    data,
  });
});
```

## Do NOT
- ❌ 500 for known errors (use 400/404/409)
- ❌ Leak Prisma errors directly
- ❌ `res.status().send()` — use `sendResponse`
- ❌ Skip `next(error)` in catch