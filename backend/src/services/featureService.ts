import { IFeature } from "../models/features.model";
import featureRepository from "../repositories/feature.repository";
import ownerRepository from "../repositories/owner.repository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import IFeatureService from "./interfaces/IFeatureService";


class featureService implements IFeatureService{
    
      async listFeatures(): Promise<{ features: IFeature[]; status: number; message:string }> {
        try {
          const features = await featureRepository.findFeatures();
    
        console.log(features)
        return {
          features,
          status: STATUS_CODES.OK,
          message:"successfully fetched"
        };
        } catch (error) {
          console.error("Error in listServices:", error);
          return { 
            features: [], 
            message: MESSAGES.ERROR.SERVER_ERROR, 
            status: STATUS_CODES.INTERNAL_SERVER_ERROR 
        }
      }
    
      }
    

}


export default new featureService();