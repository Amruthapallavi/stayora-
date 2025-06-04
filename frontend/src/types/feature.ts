

export interface IFeature {
    _id:string;
    name: string;
    description: string;
    icon?: string; 
    createdAt: Date;
    updatedAt: Date;
}

export interface IFeatureResponse{
    features:IFeature[];
}