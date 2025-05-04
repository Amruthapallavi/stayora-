import { IFeature } from "../../models/features.model";


export default interface IFeatureService {
    listFeatures():Promise<{status:number,message:string,features:IFeature[]}>

}