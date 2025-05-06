import  { IService }  from "../../models/service.model";
export interface IServiceService {
listServices():Promise<{message:string,status:number,services:IService[]|null}>;
createService(serviceData:Partial<IService>):Promise <{message:string,status:number}>;
updateServiceStatus(
    id: string,
    status: string
  ): Promise<{ message: string; status: number }>;

}