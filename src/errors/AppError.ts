class AppError extends Error {
  public statusCode: number;
  public status: string;
  public isOperational: boolean;
  public details?: unknown;

  constructor(message: string, statusCode: number, detailsOrStack?: unknown, stack = "") {
    super(message);

    this.statusCode = statusCode;
    this.status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";
    this.isOperational = true;

    if (typeof detailsOrStack === "string") {
      this.stack = detailsOrStack || undefined;
      this.details = undefined;
    } else {
      this.details = detailsOrStack;
      if (stack) {
        this.stack = stack;
      } else {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
}

export default AppError;
export { AppError };
