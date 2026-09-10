import { config } from '../config/config';
export class AppError extends Error {
    statusCode;
    status;
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 && statusCode < 500 ? 'fail' : 'error';
        Error.captureStackTrace(this, this.constructor);
    }
}
export const errorMiddleware = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';
    // Development Error Response
    if (config.nodeEnv === 'development') {
        return res.status(err.statusCode).json({
            status: err.status,
            message: err.message,
            stack: err.stack,
            error: err,
        });
    }
    // Production Error Response
    return res.status(err.statusCode).json({
        status: err.status,
        message: err.isOperational ? err.message : 'Something went wrong!',
    });
};
//# sourceMappingURL=error.middleware.js.map