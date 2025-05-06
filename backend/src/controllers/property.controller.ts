import { Request, Response } from "express";
import ownerService from "../services/owner.service";
import propertyService from "../services/property.service";
import { IPropertyController } from "./interfaces/IPropertyController";
import { STATUS_CODES } from "../utils/constants";
import adminService from "../services/admin.service";
import { IPropertyService } from "../services/interfaces/IPropertyService";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";

@injectable()
export class PropertyController implements IPropertyController {
  constructor(
    @inject(TYPES.PropertyService)
      private propertyService: IPropertyService
    
  ){}




    
async createProperty(req: Request, res: Response): Promise<void> {
    try {
      console.log("from controller");
  
      const data = req.body;
      const ownerId = (req as any).userId; 
  
      const uploadedImages = (req.files as Express.Multer.File[] | undefined) || [];
  
      const imageUrls = uploadedImages.map((file: any) => file.path); 
  
      console.log("Image URLs:", imageUrls);
  
      const result = await this.propertyService.createProperty({ data, ownerId, images: imageUrls });
  
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getPropertyByOwner(req:Request,res:Response):Promise<void>{
    try {
      const ownerId = (req as any).userId; 
    
    const result = await this.propertyService.getPropertyByOwner(ownerId);
        res.status(result.status).json({
          properties: result.properties,
        });
    } catch (error) {
      console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch properties",
        });
    }
    }
    async deletePropertyById(req: Request, res: Response):Promise<void> {
      try {
        const propertyId = req.params.id;
        await this.propertyService.deletePropertyById(propertyId);
        res.status(200).json({ message: 'Property deleted successfully' });
      } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Failed to delete property' });
      }
    }
    async getAllProperties(req:Request,res:Response):Promise<void>{
    try {
    
    const result = await this.propertyService.getAllProperties();
        res.status(result.status).json({
          properties: result.properties,
        });
    } catch (error) {
      console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch properties",
        });
    }
    }

    async getFilteredProperties(req: Request, res: Response):Promise<void> {
      try {
        const filters = req.query;  
  console.log(filters)
        const properties = await this.propertyService.getFilteredProperties(filters);
  
         res.json(properties);
      } catch (error) {
        console.error('Error in PropertyController:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
    }
    
     async approveProperty(req: Request, res: Response) :Promise<void> {
      try {
        const propertyId = req.params.id;
        await this.propertyService.approveProperty(propertyId);
        res.status(200).json({ message: 'Property approved successfully' });
      } catch (error) {
        console.error('Error approving property:', error);
        res.status(500).json({ message: 'Failed to approve property' });
      }
    }

    
 async blockUnblockProperty(req: Request, res: Response):Promise<void> {
  try {
    const propertyId = req.params.id;
    const { status } = req.body;
    await this.propertyService.blockUnblockProperty(propertyId, status);
    res.status(200).json({ message: `Property status updated to ${status}` });
  } catch (error) {
    console.error('Error updating property status:', error);
    res.status(500).json({ message: 'Failed to update status' });
  }
}

async deleteProperty(req: Request, res: Response):Promise<void> {
  try {
    const propertyId = req.params.id;
    await this.propertyService.deleteProperty(propertyId);
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    console.error('Error deleting property:', error);
    res.status(500).json({ message: 'Failed to delete property' });
  }
}
async rejectProperty(req:Request,res:Response): Promise<void>{
  try {
    const id = req.params.id;
    const {reason}=req.body;
    const result = await this.propertyService.rejectProperty(id,reason);
    res.status(result.status).json({
      message: result.message,
    }); 
  } catch (error) {
    
  }
}

     async getPropertyById(req:Request,res:Response):Promise<void>{
      try {
        const id=req.params.id;
        console.log(id);
        const result = await this.propertyService.getPropertyById(id);
        res.status(result.status).json({
          Property: result.property,
          booking:result.booking,
          ownerData:result.ownerData,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch property",
        });
      }
     }

    
  
}



export default PropertyController;