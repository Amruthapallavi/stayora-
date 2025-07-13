import { Request,Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { IChatController } from "./interfaces/IChatController";
import { io } from "../config/socket";
import { IChatService } from "../services/interfaces/IChatService";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";

@injectable()
export class ChatController implements IChatController {
  constructor(
    @inject(TYPES.ChatService)
      private _chatService: IChatService
    
  ){}
   
      async sendMessage(req: Request, res: Response): Promise<void> {
        try {
            const senderId=req.body.userId;
          const {
            sender,
            senderModel,
            receiver,
            receiverModel,
            propertyId,
            content,
            room,
  
          } = req.body;
          const imagePath = req.file ? req.file.path : null;

          const result = await this._chatService.sendMessage({
            sender,
            senderModel,
            receiver,
            receiverModel,
            propertyId,
            content,
           image: imagePath ?? undefined,

        });
          if (room) {
            io.to(room).emit("receiveMessage", { ...result.data.toObject(), room });
          } else {
            io.emit("receiveMessage", { ...result.data.toObject(), room: "all" });
          }
    
          // const notification = await notificationService.createNotification(
          //   receiver,
          //   receiverModel,
          //   "chat",
          //   "You have a new message"
          // );
          // io.to(receiver).emit("newNotification", notification);
    
          res.status(result.status).json({
            message: result.message,
            data: result.data,
          });
        } catch (error) {
          console.error("error sending message:", error);
          res.status(STATUS_CODES.BAD_REQUEST).json({
            error:
              error instanceof Error ? error.message : "Failed to send message",
          });
        }
      }
      
      async getConversation(req: Request, res: Response): Promise<void> {
        try {
          const { sender, receiver } = req.query;
          if (!sender || !receiver) {
            throw new Error("Sender and receiver are required");
          }
          const result = await this._chatService.getConversation(
            String(sender),
            String(receiver)
          );
          res.status(result.status).json({
            message: result.message,
            data: result.data,
            chatPartner:result.chatPartner,
          });
        } catch (error) {
          console.error("error fetching conversation:", error);
          res.status(STATUS_CODES.BAD_REQUEST).json({
            error:
              error instanceof Error
                ? error.message 
                : "Failed to fetch conversation",
          });
        }
      }
      async listConversations(req: Request, res: Response): Promise<void> {
        try {
          const userId = (req as any).userId;
          const result = await this._chatService.listConversations(userId);
          res.status(result.status).json({
            message: result.message,
            data: result.data,
          });
        } catch (error) {
          console.error("error fetching conversations", error);
          res.status(STATUS_CODES.BAD_REQUEST).json({
            error:
              error instanceof Error
                ? error.message
                : "Failed to fetch conversations",
          });
        }
      }

async markMessagesAsRead  (req: Request, res: Response) :Promise<void>{
  try {
    const { convId, userId } = req.body.params;
    if (!convId || !userId) {
       res.status(400).json({ message: "convId and userId are required" });
       return; 

    }

    const result = await this._chatService.markAsRead(convId, userId);
    res.status(200).json({ success: true, updatedCount: result });
    return; 

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

}

export default  ChatController;