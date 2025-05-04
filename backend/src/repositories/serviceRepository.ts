import Service, { IService } from "../models/service.model";
import BaseRepository from "./base.repository";
import { IServiceRepository } from "./interfaces/IServiceRepository";


class serviceRepository extends BaseRepository<IService> implements IServiceRepository {
    constructor(){
        super(Service)
    }
   
    async findAllServices():Promise<IService[]>{
        return await Service.find()
      }
      async findService(name:string):Promise<IService|null>{
        return await Service.findOne({name:name})
      }

}



export default new serviceRepository();