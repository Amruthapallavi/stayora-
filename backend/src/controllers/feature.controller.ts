import { Request, Response } from "express";
import { IFeatureController } from "./interfaces/IFeatureController";
import { STATUS_CODES } from "../utils/constants";
import ownerService from "../services/owner.service";
import featureService from "../services/featureService";


class featureController implements IFeatureController {

    
async listFeatures(req:Request, res:Response):Promise<void>{
    try {
      const result = await featureService.listFeatures();
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

}


export default new featureController();