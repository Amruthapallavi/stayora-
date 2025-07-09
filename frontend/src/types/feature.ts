

export interface IFeature {
    _id:string ;
    name: string;
    description: string;
    icon?: string; 
    createdAt: Date;
    updatedAt: Date;
}
export interface FeatureData {
  _id: string;
  name: string;
  description: string;
  icon: string;
}

export interface IFeatureResponse{
    features:IFeature[];
}