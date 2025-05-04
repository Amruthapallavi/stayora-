import notificationRepository from "../repositories/notification.repository";
import { INotificationService } from "./interfaces/INotificationServices";
import { INotification } from "../models/notification.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import mongoose from "mongoose";

class NotificationService implements INotificationService {
  async createNotification(
    recipient: string,
    recipientModel: string,
    type: string,
    message: string
  ): Promise<{ message: string; status: number; data: INotification }> {
    const notification = await notificationRepository.create({
      recipient: new mongoose.Types.ObjectId(recipient),
      recipientModel,
      type,
      message,
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
    const notifications = await notificationRepository.findByRecipient(
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
    const updatedNotification = await notificationRepository.update(
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

export default new NotificationService();