import { ZodError, ZodIssue } from "zod";
import {
  TErrorSources,
  TGenericErrorResponse,
} from "../interfaces/error.interface";

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSources = err.issues.map((issue: ZodIssue) => {
    if (issue.code === "invalid_union_discriminator") {
      return {
        path: issue?.path[issue.path.length - 1],
        message: "Invalid shape selected. Please choose a valid panel type.",
      };
    }
    return {
      path: issue?.path[issue.path.length - 1],
      message: issue.message,
    };
  });

  const statusCode = 400;
  
  // প্রথম error message টি main message এ রাখা হবে
  const firstErrorMessage = errorSources[0]?.message || "Validation Error";

  return {
    statusCode,
    message: firstErrorMessage,
    errorSources,
  };
};

export default handleZodError;
