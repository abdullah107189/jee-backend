import type { Request, Response } from "express";
export declare const brandController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
