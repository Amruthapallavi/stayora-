import { Request, Response } from "express";
import ownerService from "../services/owner.service";
import propertyService from "../services/property.service";
import { IPropertyController } from "./interfaces/IPropertyController";
import { STATUS_CODES } from "../utils/constants";
import adminService from "../services/admin.service";




class propertyController implements IPropertyController {


    
async createProperty(req: Request, res: Response): Promise<void> {
    try {
      console.log("from controller");
  
      const data = req.body;
      const ownerId = (req as any).userId; 
  
      const uploadedImages = (req.files as Express.Multer.File[] | undefined) || [];
  
      const imageUrls = uploadedImages.map((file: any) => file.path); 
  
      console.log("Image URLs:", imageUrls);
  
      const result = await propertyService.createProperty({ data, ownerId, images: imageUrls });
  
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
    
    const result = await propertyService.getPropertyByOwner(ownerId);
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
        await propertyService.deletePropertyById(propertyId);
        res.status(200).json({ message: 'Property deleted successfully' });
      } catch (error) {
        console.error('Error deleting property:', error);
        res.status(500).json({ message: 'Failed to delete property' });
      }
    }
    async getAllProperties(req:Request,res:Response):Promise<void>{
    try {
    
    const result = await propertyService.getAllProperties();
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
        const properties = await propertyService.getFilteredProperties(filters);
  
         res.json(properties);
      } catch (error) {
        console.error('Error in PropertyController:', error);
         res.status(500).json({ message: 'Internal Server Error' });
      }
    }
    
  
}



export default new propertyController();