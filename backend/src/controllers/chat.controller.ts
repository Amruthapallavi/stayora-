import { Request,Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { IChatController } from "./interfaces/IChatController";
import { io } from "../config/socket";
import chatService from "../services/chat.service";
import notificationService from "../services/notification.service";
class chatController implements IChatController{
    // async getChat(req: Request, res: Response): Promise<void> {
    //     try {
    //       const { sender, receiver } = req.query;
    //     //   if (!sender || !receiver) {
    //     //     throw new Error("Sender and receiver are required");
    //     //   }
    //       console.log(req.body,"this is from chat controller");
    //     //   const result = await chatService.getConversation(
    //     //     String(sender),
    //     //     String(receiver)
    //     //   );
    //     //   res.status(result.status).json({
    //     //     message: result.message,
    //     //     data: result.data,
    //     //   });
    //     } catch (error) {
    //       console.error("error fetching conversation:", error);
    //       res.status(STATUS_CODES.BAD_REQUEST).json({
    //         error:
    //           error instanceof Error
    //             ? error.message
    //             : "Failed to fetch conversation",
    //       });
    //     }
    //   }
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
            room
          } = req.body;
          console.log(req.body,"for send message")
          const result = await chatService.sendMessage({
            sender,
            senderModel,
            receiver,
            receiverModel,
            propertyId,
            content,
        });
          console.log(result)
          if (room) {
            io.to(room).emit("receiveMessage", { ...result.data.toObject(), room });
          } else {
            io.emit("receiveMessage", { ...result.data.toObject(), room: "all" });
          }
    
          const notification = await notificationService.createNotification(
            receiver,
            receiverModel,
            "chat",
            "You have a new message"
          );
          io.to(receiver).emit("newNotification", notification);
    
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
          const result = await chatService.getConversation(
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
          const result = await chatService.listConversations(userId);
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
console.log(convId,userId,"contri")
    if (!convId || !userId) {
       res.status(400).json({ message: "convId and userId are required" });
       return; 

    }

    const result = await chatService.markAsRead(convId, userId);
    console.log(result,"from markAsRead")
    res.status(200).json({ success: true, updatedCount: result });
    return; 

  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
}

}

export default new chatController();

