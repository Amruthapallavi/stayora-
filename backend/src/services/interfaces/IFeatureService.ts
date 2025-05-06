import { IFeature } from "../../models/features.model";
export interface FeatureData {
    name: string;
    description: string;
    icon: string;
  }

export default interface IFeatureService {
    listFeatures():Promise<{status:number,message:string,features:IFeature[] | []}>

    
      addFeature(featureData: FeatureData): Promise<{
        message: string;
        status: number;
      }>;
    
      updateFeature(
        id: string,
        updatedData: Record<string, any>
      ): Promise<{
        message: string;
        status: number;
      }>;
    
      removeFeature(id: string): Promise<{
        message: string;
        status: number;
      }>;
}