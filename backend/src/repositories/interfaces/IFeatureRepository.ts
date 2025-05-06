import { IFeature } from "../../models/features.model";
import { IBaseRepository } from "./IBaseRepository";



export interface IFeatureRepository extends IBaseRepository<IFeature>{

  findFeatureById(id: string): Promise<IFeature | null>;
  findFeatures(): Promise<IFeature[]>;
  getFeatureNamesByIds(ids: string[]): Promise<IFeature[]>;
  findFeature(featureId: string): Promise<IFeature | null>;
  deleteFeature(featureId: string): Promise<IFeature | null>;

}