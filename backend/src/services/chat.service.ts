import { IChatService, SendMessageInput } from "./interfaces/IChatService";
import { io } from '../config/socket';
import mongoose from "mongoose";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IMessage } from "../models/message.model";
import { IMessageReposiotry } from "../repositories/interfaces/IMessageRepository";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { UserResponseDTO } from "../DTO/UserResponseDto";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { mapOwnerToDTO } from "../mappers/ownerMapper";
import { mapUserToDTO } from "../mappers/userMapper";

@injectable()
export class ChatService implements IChatService {
  constructor(
    @inject(TYPES.MessageRepository)
      private _messageRepository: IMessageReposiotry,
      @inject(TYPES.UserRepository)
      private _userRepository: IUserRepository,
      @inject(TYPES.OwnerRepository)
      private _ownerRepository: IOwnerRepository
    
  ){}  

  async sendMessage(
    input: SendMessageInput
  ): Promise<{ message: string; status: number; data: IMessage }> {
    const senderObj = new mongoose.Types.ObjectId(input.sender);
    const receiverObj = new mongoose.Types.ObjectId(input.receiver);
    const propertyObj = new mongoose.Types.ObjectId(input.propertyId );

    const message = await this._messageRepository.create({
      sender: senderObj,
      senderModel: input.senderModel,
      receiver: receiverObj,
      receiverModel: input.receiverModel,
      content: input.content,
      propertyId:propertyObj,
      image: input.image ?? undefined, 
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
): Promise<{
  message: string;
  status: number;
  data: IMessage[];
  chatPartner: UserResponseDTO | OwnerResponseDTO;
}> {
  const messages = await this._messageRepository.findConversation(sender, receiver);
  const user = await this._userRepository.findOne({ _id: receiver });
  const owner = user ? null : await this._ownerRepository.findOne({ _id: receiver });

  if (!user && !owner) {
    throw new Error("Chat partner not found");
  }

  const chatPartner = user
    ? mapUserToDTO(user)
    : mapOwnerToDTO(owner!); 

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
    const conversations = await this._messageRepository.aggregateConversations(
      userId
    );
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
    const updatedCount = await this._messageRepository.markMessagesAsRead(convId, userId);    return {
      message: "Messages marked as read",
      status: 200,
      data: { updatedCount }
    };
  }
  
  
}


export default ChatService;