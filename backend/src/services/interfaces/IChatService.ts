import { IMessage } from "../../models/message.model";
import { IOwner } from "../../models/owner.model";
import { IUser } from "../../models/user.model";



export interface SendMessageInput {
    sender: string;
    senderModel: string;
    receiver: string;
    receiverModel: string;
    propertyId?:string;
    content: string;
    images?: string[];
  }
  
  export interface IChatService {
    sendMessage(
      input: SendMessageInput
    ): Promise<{ message: string; status: number; data: IMessage }>;
 
    getConversation(
      sender: string,
      receiver: string
    ): Promise<{
      message: string;
      status: number;
      data: IMessage[];
      chatPartner: IUser | IOwner;
    }>;
  
    listConversations(
      userId: string
    ): Promise<{ message: string; status: number; data: any[] }>;
  
    markAsRead(
      convId: string,
      userId: string
    ): Promise<{ message: string; status: number; data: any }>;
  }



  