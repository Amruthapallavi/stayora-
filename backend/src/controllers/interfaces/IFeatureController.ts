import { Request, Response } from "express";



export interface IFeatureController{

    listFeatures(req:Request ,res:Response):Promise<void>;
    updateFeature(req: Request, res: Response): Promise<void>;
    removeFeature(req: Request, res: Response): Promise<void>;
    addFeature(req: Request, res: Response): Promise<void>;


}