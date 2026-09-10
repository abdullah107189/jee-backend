import { Request, Response, NextFunction } from 'express';
export declare class AppError extends Error {
    readonly statusCode: number;
    readonly status: string;
    constructor(message: string, statusCode: number);
}
export declare const errorMiddleware: (err: any, req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>>;
