import mongoose from "mongoose";
import Users from "../models/user.model";
import Owners from "../models/owner.model";
import Message, { IMessage } from "../models/message.model";
import BaseRepository from "./base.repository";
import { IMessageReposiotry } from "./interfaces/IMessageRepository";

class messageRepository
  extends BaseRepository<IMessage>
  implements IMessageReposiotry
{
  constructor() {
    super(Message);
  }
  async findConversation(senderId: string, receiverId: string) {
    try {
      const messages = await Message.find({
        $or: [
          { sender: senderId, receiver: receiverId },
          { sender: receiverId, receiver: senderId },
        ],
      })
        .populate("sender") 
        .populate("receiver") 
        .sort({ createdAt: 1 });
  
      return messages;
    } catch (error) {
      console.error("Error fetching conversation:", error);
      throw new Error("Failed to load conversation");
    }
  }
  
  
  async aggregateConversations(userId: string): Promise<any[]> {
    const objectId = new mongoose.Types.ObjectId(userId);
    const result = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: objectId }, { receiver: objectId }],
        },
      },
      {
        $project: {
          sender: 1,
          receiver: 1,
          content: 1,
          propertyId: 1,
          image:1,
          createdAt: 1,
          isRead: 1,
          partner: {
            $cond: {
              if: { $eq: ["$sender", objectId] },
              then: "$receiver",
              else: "$sender",
            },
          },
        },
      },
      {
        $group: {
          _id: "$partner",
          lastMessage: { $last: "$$ROOT" },
          messagesCount: { $sum: 1 },
          unreadCount: {
            $sum: {
              $cond: [
                { $and: [{ $eq: ["$receiver", objectId] }, { $eq: ["$isRead", false] }] },
                1,
                0,
              ],
            },
          },
        },
      },
      {
        $lookup: {
          from: "users",
          let: { partnerId: "$_id" },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ["$_id", "$$partnerId"] },
                    { $eq: ["$userId", "$$partnerId"] },
                  ],
                },
              },
            },
          ],
          as: "userPartner",
        },
      },
      {
        $lookup: {
          from: "owners",
          localField: "_id",
          foreignField: "_id",
          as: "ownerPartner",
        },
      },
      {
        $addFields: {
          partner: {
            $ifNull: [
              { $arrayElemAt: ["$userPartner", 0] },
              { $arrayElemAt: ["$ownerPartner", 0] },
            ],
          },
        },
      },
      {
        $project: {
          userPartner: 0,
          vendorPartner: 0,
        },
      },
      {
        $sort: { "lastMessage.createdAt": -1 },
      },
    ]);
    return result;
  }
  
  async markMessagesAsRead(otherUserId: string, userId: string): Promise<number> {
    const result = await Message.updateMany(
      {
        sender: otherUserId,
        receiver: userId,
        isRead: false
      },
      { $set: { isRead: true } }
    );
  
    return result.modifiedCount;
  }
  
  
  
}

export default messageRepository;