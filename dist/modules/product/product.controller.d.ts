import type { Request, Response } from "express";
export declare const productController: {
    list(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    create(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    update(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    remove(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listVariants(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listVariantsByProduct(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getVariantById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createVariant(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateVariant(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeVariant(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    listItems(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    getItemById(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    createItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    updateItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
    removeItem(req: Request, res: Response): Promise<Response<any, Record<string, any>>>;
};
