import Feature, { IFeature } from "../models/features.model";
import BaseRepository from "./base.repository";
import { IFeatureRepository } from "./interfaces/IFeatureRepository";



class featureRepository extends BaseRepository<IFeature> implements IFeatureRepository{

    constructor(){
        super(Feature);

    }

    async findFeatureById(id:string): Promise<IFeature |null>{
       return await Feature.findById(id)
    }
     async findFeatures(): Promise<IFeature[]>{
            return await Feature.find()
          }
    
    async getFeatureNamesByIds(ids: string[]): Promise<IFeature[]> {
        return await Feature.find(
          { _id: { $in: ids } },
          { name: 1, _id: 0 } 
        );
      }
      async findFeature(featureId:string): Promise<IFeature |null>{
        return await Feature.findOne({_id:featureId})
      }
      async deleteFeature(featureId:string): Promise<IFeature | null>{
        return await Feature.findByIdAndDelete({_id:featureId});
      }
}

export default featureRepository;