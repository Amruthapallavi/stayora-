import { INotificationService } from "./interfaces/INotificationServices";
import { INotification } from "../models/notification.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { Types } from 'mongoose';
import { INotificationRepository } from "../repositories/interfaces/INotificationRepository";

import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";

@injectable()
export class NotificationService implements INotificationService {
  constructor(
    @inject(TYPES.NotificationRepository)
      private notificationRepository: INotificationRepository
    
  ){}


  async createNotification(
    recipient: string,
    recipientModel: string,
    type: string,
    message: string,
    otherId: string | null
  ): Promise<{ message: string; status: number; data: INotification }> {
    
    const recipientObjectId = new Types.ObjectId(recipient);
  
    let otherIdObjectId: Types.ObjectId | null = null;
  
    if (otherId && Types.ObjectId.isValid(otherId)) {
      otherIdObjectId = new Types.ObjectId(otherId); 
    }
  
    const notification = await this.notificationRepository.create({
      recipient: recipientObjectId,
      recipientModel,
      type,
      message,
      otherId: otherIdObjectId, 
      read: false,
    });
  
    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_CREATED,
      status: STATUS_CODES.CREATED,
      data: notification,
    };
  }


  async getNotifications(
    recipientId: string
  ): Promise<{ message: string; status: number; data: INotification[] }> {
    const notifications = await this.notificationRepository.findByRecipient(
      recipientId
    );
    return {
      message: MESSAGES.SUCCESS.NOTIFICATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: notifications,
    };
  }
  async markAsRead(
    notificationId: string
  ): Promise<{ message: string; status: number; data: INotification | null }> {
    const updatedNotification = await this.notificationRepository.update(
      notificationId,
      { read: true }
    );
    return {
      message: MESSAGES.SUCCESS.NOTIFICATION_UPDATED,
      status: STATUS_CODES.OK,
      data: updatedNotification,
    };
  }
}

export default  NotificationService;