import { Request, Response } from "express";



export interface IFeatureController{

    listFeatures(req:Request ,res:Response):Promise<void>;
    
}