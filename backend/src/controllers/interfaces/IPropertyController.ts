import { Request, Response } from "express";



export interface IPropertyController {

  createProperty:(req:Request ,res:Response)=>Promise<void>;
  // updateProperty(req: Request, res: Response): Promise<void>;
  getPropertyByOwner(req: Request, res: Response): Promise<void>;
  deletePropertyById(req: Request, res: Response): Promise<void>;
  getAllProperties(req: Request, res: Response): Promise<void>;

}