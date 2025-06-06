import { Request, Response } from "express";

export interface IPropertyController {
  createProperty(req: Request, res: Response): Promise<void>;
  getPropertyByOwner(req: Request, res: Response): Promise<void>;
  deletePropertyById(req: Request, res: Response): Promise<void>;
  getAllProperties(req: Request, res: Response): Promise<void>;
  getFilteredProperties(req: Request, res: Response): Promise<void>;
  approveProperty(req: Request, res: Response): Promise<void>;
  blockUnblockProperty(req: Request, res: Response): Promise<void>;
  deleteProperty(req: Request, res: Response): Promise<void>;
  rejectProperty(req: Request, res: Response): Promise<void>;
  addReview(req:Request,res:Response):Promise<void>;
  getReviews(req:Request,res:Response):Promise<void>;
  // locationProperties(req:Request,res:Response):Promise<void>;
  getPropertyById(req: Request, res: Response): Promise<void>;
}
