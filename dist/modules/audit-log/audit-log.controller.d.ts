import type { Request, Response } from "express";
export declare const auditLogController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    stats(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
