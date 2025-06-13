import { Request, Response } from "express";

export interface INotificationController {
  getNotifications(req: Request, res: Response): Promise<void>;
  markNotificationAsRead(req: Request, res: Response): Promise<void>;
  deleteNotification(req:Request,res:Response):Promise<void>;
}