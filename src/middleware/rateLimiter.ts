import type { NextFunction, Request, Response } from "express";

interface RateLimitOptions {
  windowMs: number;
  max: number;
  message?: string;
}

export function rateLimiter(options: RateLimitOptions) {
  const requests = new Map<string, { count: number; resetTime: number }>();

  // Periodically clean up expired entries
  const timer = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of requests.entries()) {
      if (record.resetTime <= now) {
        requests.delete(key);
      }
    }
  }, 60000);
  if (timer.unref) timer.unref();

  return (req: Request, res: Response, next: NextFunction) => {
    const ip = req.ip || req.socket.remoteAddress || "global";
    const now = Date.now();
    const record = requests.get(ip);

    if (!record || record.resetTime <= now) {
      requests.set(ip, { count: 1, resetTime: now + options.windowMs });
      return next();
    }

    if (record.count >= options.max) {
      return res.status(429).json({
        statusCode: 429,
        success: false,
        message: options.message || "Too many requests, please try again later.",
      });
    }

    record.count += 1;
    return next();
  };
}

export const warrantyCheckRateLimiter = rateLimiter({
  windowMs: 60 * 1000, // 1 minute
  max: 60, // 60 requests per minute
});
