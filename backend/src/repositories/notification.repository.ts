import Notification, { INotification } from "../models/notification.model";
import BaseRepository from "./base.repository";
import { INotificationRepository } from "./interfaces/INotificationRepository";

class NotificationRepository
  extends BaseRepository<INotification>
  implements INotificationRepository
{
  constructor() {
    super(Notification);
  }

  async findByRecipient(recipientId: string): Promise<INotification[]> {
    return Notification.find({ recipient: recipientId, read: false })
      .sort({ createdAt: -1 })
      .exec();
  }
}

export default new NotificationRepository();