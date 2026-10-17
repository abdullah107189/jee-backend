import { Prisma } from "../../prisma/generated/prisma/client";

type TErrorSource = {
  path: string | number;
  message: string;
};

type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
};

export const handlePrismaClientKnownRequestError = (
  err: Prisma.PrismaClientKnownRequestError,
): TGenericErrorResponse => {
  let statusCode = 400;
  let message = "Database Error";
  let errorSources: TErrorSource[] = [];

  switch (err.code) {
    case "P2002": {
      // Unique constraint failed
      statusCode = 409;
      const target = Array.isArray(err.meta?.target)
        ? (err.meta?.target as string[]).join(", ")
        : (err.meta?.target as string) || "field";
      message = `Duplicate value for: ${target}`;
      errorSources = [
        {
          path: target,
          message: `${target} already exists`,
        },
      ];
      break;
    }

    case "P2025": {
      // Record not found
      statusCode = 404;
      message = (err.meta?.cause as string) || "Record not found";
      errorSources = [
        {
          path: "",
          message,
        },
      ];
      break;
    }

    case "P2003": {
      // Foreign key constraint failed
      statusCode = 400;
      const fieldName = (err.meta?.field_name as string) || "foreign key";
      message = `Foreign key constraint failed on: ${fieldName}`;
      errorSources = [
        {
          path: fieldName,
          message: `Referenced entity does not exist or cannot be modified due to foreign key constraint (${fieldName})`,
        },
      ];
      break;
    }

    default: {
      statusCode = 400;
      message = err.message || "Prisma Database Error";
      errorSources = [
        {
          path: "",
          message,
        },
      ];
      break;
    }
  }

  return {
    statusCode,
    message,
    errorSources,
  };
};

export default handlePrismaClientKnownRequestError;
