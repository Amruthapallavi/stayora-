import { IService } from "../models/service.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IServiceService } from "./interfaces/IServiceService";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { IServiceRepository } from "../repositories/interfaces/IServiceRepository";
import { ServiceStatus } from "../models/status/status";

@injectable()
export class ServiceService implements IServiceService {
  constructor(
    @inject(TYPES.ServiceRepository)
      private serviceRepository: IServiceRepository
    
  ){}
      async listServices(): Promise<{ services: IService[] |[]; status: number; message: string }> {
        try {
          const services = await this.serviceRepository.findAllServices();
      
          return {
            services,
            status: STATUS_CODES.OK,
            message: "successfully fetched", 
          };
        } catch (error) {
          console.error("Error in listServices:", error);
          return { 
            services: [], 
            message: MESSAGES.ERROR.SERVER_ERROR, 
            status: STATUS_CODES.INTERNAL_SERVER_ERROR 
          };
        }
      }

      async createService(serviceData: Partial<IService>): Promise<{ message: string; status: number }> {
        try {
          const { name, description, image, price, contactMail, contactNumber } = serviceData;
      
          if (!name || !description || !price || !contactMail || !contactNumber) {
            return { message: MESSAGES.ERROR.INVALID_INPUT, status: STATUS_CODES.BAD_REQUEST };
          }
      
          if (price <= 0 || isNaN(price)) {
            return { message: "Enter a valid price.", status: STATUS_CODES.BAD_REQUEST };
          }
      
          const existingService = await this.serviceRepository.findServiceWithName(name);
          if (existingService) {
            return { message: MESSAGES.ERROR.SERVICE_ALREADY_EXISTS, status: STATUS_CODES.CONFLICT };
          }
      
          await this.serviceRepository.create({ name, description, price, contactMail, contactNumber, image });
      
          return { message: "Service added successfully!", status: STATUS_CODES.CREATED };
        } catch (error) {
          console.error("Error in add Service:", error);
          return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
        }
      }
      
       
        async updateServiceStatus(id: string, status: string): Promise<{ message: string; status: number }> {
         try {
           const service = await this.serviceRepository.findService(id);
        
           if (!service) {
             return {
               message: "Service not found",
               status: STATUS_CODES.NOT_FOUND, 
             };
           }
         
           service.status = service.status === ServiceStatus.Active ? ServiceStatus.Disabled : ServiceStatus.Active;
         
           
           
           await service.save();
         
           return {
             message: "Successful",
             status: STATUS_CODES.OK, 
           };
         } catch (error) {
          
         
          console.error("Error in addService:", error);
          return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
        }
      }
      
      
}

export default ServiceService;