import { ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import handleZodError from "../errors/handleZodError";
import handlePrismaClientKnownRequestError from "../errors/handlePrismaError";
import { Prisma } from "../../prisma/generated/prisma/client";
import { config } from "../config/config";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly status: string;
  public readonly isOperational: boolean;
  public readonly details?: unknown;

  constructor(message: string, statusCode: number, details?: unknown) {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    this.isOperational = true;
    this.details = details;

    Error.captureStackTrace(this, this.constructor);
  }
}

type TErrorSource = {
  path: string | number;
  message: string;
};

const globalErrorHandler: ErrorRequestHandler = (err, req, res, next) => {
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

  // Custom AppError
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

  // Normal Error
  else if (err instanceof Error) {
    statusCode = 500;
    message = err.message;

    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === "development" ? err?.stack : null,
  });
};

export default globalErrorHandler;
