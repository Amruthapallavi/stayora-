import { IService } from "../../models/service.model";
import { IBaseRepository } from "./IBaseRepository";


export interface IServiceRepository extends IBaseRepository<IService>{
    findAllServices(): Promise<IService[] | []>;

  findServiceWithName(name: string): Promise<IService | null>;
  findService(serviceId: string): Promise<IService | null>;
}

    
