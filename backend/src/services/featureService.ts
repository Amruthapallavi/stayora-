import Feature, { IFeature } from "../models/features.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import IFeatureService, { FeatureData } from "./interfaces/IFeatureService";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { IFeatureRepository } from "../repositories/interfaces/IFeatureRepository";


@injectable()
export class FeatureService implements IFeatureService {
  constructor(
    @inject(TYPES.FeatureRepository)
      private _featureRepository: IFeatureRepository
    
  ){}    
      async listFeatures(): Promise<{ features: IFeature[]; status: number; message:string }> {
        try {
          const features = await this._featureRepository.findFeatures();
    
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

      
      async removeFeature(id: string): Promise<{ message: string; status: number }> {
        try {
          const feature = await this._featureRepository.findFeature(id);
          if (!feature) {
            return {
              message: "bo feature found",
              status: STATUS_CODES.NOT_FOUND, 
            };
          }
          const result=await this._featureRepository.deleteFeature( id);
          
          return {
            message: "Successfully deleted",
            status: STATUS_CODES.OK,
          };
        } catch (error) {
          console.error("Error in remove feature:", error);
          return { 
            message: MESSAGES.ERROR.SERVER_ERROR, 
            status: STATUS_CODES.INTERNAL_SERVER_ERROR 
          };
        }
      }
       async updateFeature(
          id: string,
          updatedData: Record<string, any>
        ): Promise<{ message: string; status: number }> {
          try {
            const feature = await this._featureRepository.findFeature(id);
            if (!feature) {
              return {
                message: "Feature not found",
                status: STATUS_CODES.NOT_FOUND,
              };
            }
        
            Object.assign(feature, updatedData);
        
            await feature.save();
        
            return {
              message: "Update successful",
              status: STATUS_CODES.OK,
            };
          } catch (error) {
            console.error("Error in updateFeature:", error);
            return {
              message: MESSAGES.ERROR.SERVER_ERROR,
              status: STATUS_CODES.INTERNAL_SERVER_ERROR,
            };
          }
        }
         
       
        
          async addFeature(featureData: FeatureData): Promise<{ message: string; status: number }> {
            try {
              let { name, description,icon } = featureData;
              
        
              if (!name || !description ) {
                return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
              }
        
              
        
              const existingFeature = await this._featureRepository.findOne({ name });
              if (existingFeature) {
                return { message: "Feature already exists.", status: STATUS_CODES.CONFLICT };
              }
        
              const newFeature = new Feature({ name, description, icon });
              await newFeature.save();
              return { message: "Feature added successfully!", status: STATUS_CODES.CREATED };
            } catch (error) {
              console.error("Error in addService:", error);
              return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
            }
          }
        
    

}


export default FeatureService;