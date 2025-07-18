import { Request, Response } from "express";
import IServiceController from "./interfaces/IServiceController";
import { STATUS_CODES } from "../utils/constants";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { IServiceService } from "../services/interfaces/IServiceService";

@injectable()
export class ServiceController implements IServiceController {
  constructor(
    @inject(TYPES.ServiceService)
    private _serviceService: IServiceService
  ) {}
  async listServices(req: Request, res: Response): Promise<void> {
    try {
      const result = await this._serviceService.listServices();
      res.status(result.status).json({
        services: result.services,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch services",
      });
    }
  }
  async createService(req: Request, res: Response): Promise<void> {
    try {
      const serviceData = req.body;
      const serviceImage = req.file?.path;
      const result = await this._serviceService.createService(serviceData);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.log(error);
    }
  }

  async updateServiceStatus(req: Request, res: Response): Promise<void> {
    const serviceId = req.params.id;
    const status = req.body.status;
    const result = await this._serviceService.updateServiceStatus(serviceId, status);

    res.status(result.status).json({
      message: result.message,
    });
  }
}

export default ServiceController;
