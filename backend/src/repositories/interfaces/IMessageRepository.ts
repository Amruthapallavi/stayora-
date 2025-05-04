import { IBaseRepository } from "./IBaseRepository";
import { IMessage } from "../../models/message.model";

export interface IMessageReposiotry extends IBaseRepository<IMessage> {
  findConversation(senderId: string, receiverId: string): Promise<IMessage[]>;
  aggregateConversations(userId: string): Promise<IMessage[]>;

}