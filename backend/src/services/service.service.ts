import { IService } from "../models/service.model";
import adminRepository from "../repositories/admin.repository";
import serviceRepository from "../repositories/serviceRepository";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IServiceService } from "./interfaces/IServiceService";


class serviceService implements IServiceService{

      async listServices(): Promise<{ services: any[]; status: number; message: string }> {
        try {
          const services = await serviceRepository.findAllServices();
      
          console.log("Fetched Services:", services); 
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
      
          const existingService = await serviceRepository.findService(name);
          if (existingService) {
            return { message: MESSAGES.ERROR.SERVICE_ALREADY_EXISTS, status: STATUS_CODES.CONFLICT };
          }
      
          await serviceRepository.create({ name, description, price, contactMail, contactNumber, image });
      
          return { message: "Service added successfully!", status: STATUS_CODES.CREATED };
        } catch (error) {
          console.error("Error in add Service:", error);
          return { message: MESSAGES.ERROR.SERVER_ERROR, status: STATUS_CODES.INTERNAL_SERVER_ERROR };
        }
      }
      
      
      
      
}

export default new serviceService();