import { Request, Response } from "express";
import IServiceController from "./interfaces/IServiceController";
import { STATUS_CODES } from "../utils/constants";
import adminService from "../services/admin.service";
import serviceService from "../services/service.service";


class serviceController implements IServiceController {

    async listServices(req:Request, res:Response):Promise<void>{
        try {
          const result = await serviceService.listServices();
          res.status(result.status).json({
            services: result.services,
          });
        } catch (error) {
          console.error(error);
          res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            error: error instanceof Error ? error.message : "Failed to fetch services",
          });
        }
      }
      async createService(req:Request, res:Response):Promise<void>{
        try {
          const serviceData= req.body;
          const serviceImage = req.file?.path;
          const result = await serviceService.createService(serviceData);
          res.status(result.status).json({
            message: result.message,
          }); 
         } catch (error) {
          console.log(error)
        }
      }
}


export default new serviceController();