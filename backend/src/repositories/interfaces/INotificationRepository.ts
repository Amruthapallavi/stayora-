import { IBaseRepository } from "./IBaseRepository";
import { INotification } from "../../models/notification.model";

export interface INotificationRepository
  extends IBaseRepository<INotification> {
  create(data: Partial<INotification>): Promise<INotification>;
  findByRecipient(recipientId: string): Promise<INotification[]>;
  update(
    id: string,
    updateData: Partial<INotification>
  ): Promise<INotification | null>;
}