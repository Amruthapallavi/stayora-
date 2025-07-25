import { INotification } from "../../models/notification.model";

export interface INotificationService {
  createNotification(
    recipient: string,
    recipientModel: string,
    type: string,
    message: string,
    otherId:string | null,
  ): Promise<{ message: string; status: number; data: INotification }>;
  getNotifications(
    recipientId: string
  ): Promise<{ message: string; status: number; data: INotification[] }>;
  markAsRead(
    notificationId: string
  ): Promise<{ message: string; status: number; data: INotification | null }>;
  deleteNotification(notificationId:string):Promise<{message:string,status:number}>;
}