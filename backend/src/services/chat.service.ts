import { IChatService, SendMessageInput } from "./interfaces/IChatService";
import { io } from '../config/socket';
// import chatRepository from "../repositories/chat.repository";
import mongoose from "mongoose";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IMessage } from "../models/message.model";
import messageRepository from "../repositories/message.repository";
import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import ownerRepository from "../repositories/owner.repository";
import { IOwner } from "../models/owner.model";


class chatService implements IChatService {
  async sendMessage(
    input: SendMessageInput
  ): Promise<{ message: string; status: number; data: IMessage }> {
    console.log(input,"chgr")
    const senderObj = new mongoose.Types.ObjectId(input.sender);
    const receiverObj = new mongoose.Types.ObjectId(input.receiver);
    const propertyObj = new mongoose.Types.ObjectId(input.propertyId );

    const message = await messageRepository.create({
      sender: senderObj,
      senderModel: input.senderModel,
      receiver: receiverObj,
      receiverModel: input.receiverModel,
      content: input.content,
      propertyId:propertyObj,
      images: input.images || [],
    });
    return {
      message: MESSAGES.SUCCESS.MESSAGE_SENT,
      status: STATUS_CODES.OK,
      data: message,
    };
  }
  async getConversation(
    sender: string,
    receiver: string
  ): Promise<{ message: string; status: number; data: IMessage[] ; chatPartner:IUser |IOwner}> {
    console.log(sender,receiver,"get conversation")
    const messages = await messageRepository.findConversation(sender, receiver);
    const chatPartner: IUser | IOwner | null = 
    await userRepository.findOne({ _id: receiver }) || 
    await ownerRepository.findOne({ _id: receiver });
      if (!chatPartner) {
      throw new Error("Chat partner not found");
    }
         
    return {
      message: MESSAGES.SUCCESS.CONVERSATION_FETCHED,
      status: STATUS_CODES.OK,
      data: messages,
      chatPartner,
    };
  }
  async listConversations(
    userId: string
  ): Promise<{ message: string; status: number; data: any[] }> {
    const conversations = await messageRepository.aggregateConversations(
      userId
    );
    console.log(conversations,"all conversations")
    return {
      message: MESSAGES.SUCCESS.CONVERSATIONS_FETCHED,
      status: STATUS_CODES.OK,
      data: conversations,
    };
  }
  async markAsRead(
    convId: string,
    userId: string
  ): Promise<{ message: string; status: number; data: any }> {
    const updatedCount = await messageRepository.markMessagesAsRead(convId, userId);
  console.log(updatedCount,"updated count")
    return {
      message: "Messages marked as read",
      status: 200,
      data: { updatedCount }
    };
  }
  
  
}


export default new chatService();