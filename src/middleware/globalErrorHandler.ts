import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import handleZodError from "../errors/handleZodError";
import handlePrismaClientKnownRequestError from "../errors/handlePrismaError";
import { Prisma } from "../../prisma/generated/prisma/client";
import { config } from "../config/config";
import AppError from "../errors/AppError";
export { AppError };

type TErrorSource = {
  path: string | number;
  message: string;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isProduction = (config.NODE_ENV || process.env.NODE_ENV) === "production";

  let statusCode = 500;
  let message = "Something went wrong!";

  let errorSources: TErrorSource[] = [
    {
      path: "",
      message: "Something went wrong",
    },
  ];

  // Zod Error
  if (err instanceof ZodError) {
    const simplifiedError = handleZodError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Prisma Known Request Error (P2002, P2025, P2003, etc.)
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    const simplifiedError = handlePrismaClientKnownRequestError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorSources = simplifiedError.errorSources;
  }
  // Custom AppError (Operational error)
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }
  // Generic / Unexpected Error (Non-operational error)
  else if (err instanceof Error) {
    statusCode = 500;
    message = isProduction ? "Something went wrong!" : err.message;
    errorSources = [
      {
        path: "",
        message: isProduction ? "Something went wrong!" : err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: isProduction ? null : err?.stack ?? null,
  });
};

export default globalErrorHandler;
