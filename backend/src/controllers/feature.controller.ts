import { Request, Response } from "express";
import { IFeatureController } from "./interfaces/IFeatureController";
import { STATUS_CODES } from "../utils/constants";
import ownerService from "../services/owner.service";
import featureService from "../services/featureService";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import IFeatureService from "../services/interfaces/IFeatureService";

@injectable()
export class FeatureController implements IFeatureController {
  constructor(
    @inject(TYPES.FeatureService)
      private _featureService: IFeatureService
    
  ){}
    
async listFeatures(req:Request, res:Response):Promise<void>{
    try {
      const result = await this._featureService.listFeatures();
      res.status(result.status).json({
        features: result.features,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to fetch features",
      });
    }
  }
  
  async removeFeature(req:Request,res:Response): Promise<void>{
    try {
      const featureId = req.params.id;
      const result = await this._featureService.removeFeature(featureId);
      res.status(result.status).json({
        message: result.message,
      }); 
    } catch (error) {
      
    }
  }
  async updateFeature(req:Request,res:Response):Promise<void>{
    try {
      const featureId = req.params.id;
    const updatedData= req.body.data;
    const result = await this._featureService.updateFeature(featureId,updatedData)
    
    res.status(result.status).json({
      message: result.message,
    });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
      error: error instanceof Error ? error.message : "Failed to update feature",
      });
    }
  }
  

  
  async addFeature(req:Request,res:Response): Promise<void>{
  try {
    const featureData = req.body;
    const result = await this._featureService.addFeature(featureData);
    res.status(result.status).json({
      message: result.message,
    }); 
   } catch (error) {
    console.log(error)
  }
  }

}


export default FeatureController;