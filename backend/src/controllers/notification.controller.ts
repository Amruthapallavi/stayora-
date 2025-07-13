import { Request, Response } from "express";
import notificationService from "../services/notification.service";
import { STATUS_CODES } from "../utils/constants";
import { INotificationController } from "./interfaces/INotificationController";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { INotificationService } from "../services/interfaces/INotificationServices";

@injectable()
export class NotificationController implements INotificationController {
  constructor(
    @inject(TYPES.NotificationService)
      private _notificationService: INotificationService
    
  ){}

  async getNotifications(req: Request, res: Response): Promise<void> {
    try {
      const recipient = (req as any).userId;
      const result = await this._notificationService.getNotifications(recipient);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error fetching notifications:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch notifications",
      });
    }
  }
  async markNotificationAsRead(req: Request, res: Response): Promise<void> {
    try {
      const { notificationId } = req.params;
      const result = await this._notificationService.markAsRead(notificationId);
      res.status(result.status).json({
        message: result.message,
        data: result.data,
      });
    } catch (error) {
      console.error("error updating notification read status:", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to mark notification as read",
      });
    } 
  }
   async deleteNotification(req: Request, res: Response): Promise<void> {
    try {
      const notificationId  = req.params.id;
      const result = await this._notificationService.deleteNotification(notificationId);
      res.status(result.status).json({
        message: result.message,
      });
    } catch (error) {
      console.error("error deleting notification", error);
      res.status(STATUS_CODES.BAD_REQUEST).json({
        error:
          error instanceof Error
            ? error.message
            : "Failed to delete notification",
      });
    }
  }

}

export default NotificationController;