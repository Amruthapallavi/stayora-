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
      private messageRepository: IMessageReposiotry,
      @inject(TYPES.UserRepository)
      private userRepository: IUserRepository,
      @inject(TYPES.OwnerRepository)
      private ownerRepository: IOwnerRepository
    
  ){}  

  async sendMessage(
    input: SendMessageInput
  ): Promise<{ message: string; status: number; data: IMessage }> {
    const senderObj = new mongoose.Types.ObjectId(input.sender);
    const receiverObj = new mongoose.Types.ObjectId(input.receiver);
    const propertyObj = new mongoose.Types.ObjectId(input.propertyId );

    const message = await this.messageRepository.create({
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
  const messages = await this.messageRepository.findConversation(sender, receiver);

  const user = await this.userRepository.findOne({ _id: receiver });
  const owner = user ? null : await this.ownerRepository.findOne({ _id: receiver });

  if (!user && !owner) {
    throw new Error("Chat partner not found");
  }

  // Type guard-based mapping
  const chatPartner = user
    ? mapUserToDTO(user)
    : mapOwnerToDTO(owner!); // `owner!` is safe here because we already checked it's not null

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
    const conversations = await this.messageRepository.aggregateConversations(
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
    const updatedCount = await this.messageRepository.markMessagesAsRead(convId, userId);
    console.log(updatedCount)
    return {
      message: "Messages marked as read",
      status: 200,
      data: { updatedCount }
    };
  }
  
  
}


export default ChatService;