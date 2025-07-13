import { Request, Response } from "express";
import { IPropertyController } from "./interfaces/IPropertyController";
import { STATUS_CODES } from "../utils/constants";
import { IPropertyService } from "../services/interfaces/IPropertyService";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { PaginationQueryDTO } from "../DTO/PaginationDTO";

@injectable()
export class PropertyController implements IPropertyController {
  constructor(
    @inject(TYPES.PropertyService)
    private _propertyService: IPropertyService
  ) {}

  async createProperty(req: Request, res: Response): Promise<void> {
    try {
      const data = req.body;
      const ownerId = (req as any).userId;

      const uploadedImages =
        (req.files as Express.Multer.File[] | undefined) || [];

      const imageUrls = uploadedImages.map((file: any) => file.path);

      const result = await this._propertyService.createProperty({
        data,
        ownerId,
        images: imageUrls,
      });

      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Error adding property:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  async getPropertyByOwner(req: Request, res: Response): Promise<void> {
    try {
      const ownerId = (req as any).userId;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const searchTerm =
        typeof req.query.search === "string" ? req.query.search : "";
      const result = await this._propertyService.getPropertyByOwner(
        ownerId,
        page,
        limit,
        searchTerm
      );
      res.status(result.status).json({
        properties: result.properties,
        totalPages: result.totalPages,
        currentPage: result.currentPage,
        totalProperties: result.totalProperties,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch properties",
      });
    }
  }
  async deletePropertyById(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      await this._propertyService.deletePropertyById(propertyId);
      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  }
  async getAllProperties(req: Request, res: Response): Promise<void> {
    try {
      const { page, limit, search }: PaginationQueryDTO = {
        page: parseInt(req.query.page as string) || 1,
        limit: parseInt(req.query.limit as string) || 10,
        search: typeof req.query.search === "string" ? req.query.search : "",
      };

      const result = await this._propertyService.getAllProperties(
        page,
        limit,
        search
      );
      res.status(result.status).json({
        properties: result.properties,
        currentPage: result.currentPage,
        totalPages: result.totalPages,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch properties",
      });
    }
  }

  async getFilteredProperties(req: Request, res: Response): Promise<void> {
    try {
      const filters = req.query;
      const properties = await this._propertyService.getFilteredProperties(
        filters
      );
      res.json(properties);
    } catch (error) {
      console.error("Error in PropertyController:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  } 

  async approveProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      await this._propertyService.approveProperty(propertyId);
      res.status(200).json({ message: "Property approved successfully" });
    } catch (error) {
      console.error("Error approving property:", error);
      res.status(500).json({ message: "Failed to approve property" });
    }
  }

  async blockUnblockProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      const { status } = req.body;
      await this._propertyService.blockUnblockProperty(propertyId, status);
      res.status(200).json({ message: `Property status updated to ${status}` });
    } catch (error) {
      console.error("Error updating property status:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  }

  async deleteProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      await this._propertyService.deleteProperty(propertyId);
      res.status(200).json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  }
  async rejectProperty(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      const { reason } = req.body;
      const result = await this._propertyService.rejectProperty(propertyId, reason);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {}
  }

  async getPropertyById(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      const result = await this._propertyService.getPropertyById(propertyId);
      res.status(result.status).json({
        Property: result.property,
        booking: result.booking,
        ownerData: result.ownerData,
      });
    } catch (error) {
      console.error(error);
      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch property",
      });
    }
  }

  async addReview(req: Request, res: Response): Promise<void> {
    try {
      const { bookingId, rating, reviewText } = req.body;

      const result = await this._propertyService.addReview(
        bookingId,
        rating,
        reviewText
      );
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("Error adding review:", error);

      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error: error instanceof Error ? error.message : "Failed to add review",
      });
    }
  }
  async getReviews(req: Request, res: Response): Promise<void> {
    try {
      const propertyId = req.params.id;
      const result = await this._propertyService.getReviews(propertyId);
      res.status(result.status).json({
        reviews: result.reviews,
        message: result.message,
      });
    } catch (error) {
      console.error("Error for fetching reviews:", error);

      res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
        error:
          error instanceof Error ? error.message : "Failed to fetch reviews",
      });
    }
  }
}

export default PropertyController;