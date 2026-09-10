import type { Request, Response } from "express";
export declare const orderController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateStatus(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    cancel(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
