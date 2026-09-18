import { ZodError } from "zod";

type TErrorSource = {
  path: string | number;
  message: string;
};

type TGenericErrorResponse = {
  statusCode: number;
  message: string;
  errorSources: TErrorSource[];
};

const handleZodError = (err: ZodError): TGenericErrorResponse => {
  const errorSources: TErrorSource[] = err.issues.map((issue) => {
    const lastPath = issue.path[issue.path.length - 1];

    return {
      path:
        typeof lastPath === "string" || typeof lastPath === "number"
          ? lastPath
          : "unknown",
      message: issue.message,
    };
  });

  return {
    statusCode: 400,
    message: errorSources[0]?.message || "Validation Error",
    errorSources,
  };
};

export default handleZodError;
