import { IFeature } from "../../models/features.model";
import { IBaseRepository } from "./IBaseRepository";



export interface IFeatureRepository extends IBaseRepository<IFeature>{

  findFeatureById(id: string): Promise<IFeature | null>;
  getFeatureNamesByIds(ids: string[]): Promise<IFeature[]>;
  findFeatures():Promise<IFeature[]|null>;

}