import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  sender: mongoose.Types.ObjectId;
  senderModel: string;
  receiver: mongoose.Types.ObjectId;
  receiverModel: string;
  content: string;
  propertyId?:mongoose.Types.ObjectId;
  image?: string;
  isRead: boolean;
  timestamp: Date;
  createdAt: Date;
}

const messageSchema: Schema = new Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "$senderModel",
    },
    senderModel: { type: String, required: true, enum: ["User", "Owner"] },
    receiver: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "$receiverModel",
    },
    receiverModel: { type: String, required: true, enum: ["User", "Owner"] },

    propertyId:{type: Schema.Types.ObjectId},
    image: { type: String, default: [] },
  content: {
  type: String,
  required: function(this: IMessage) {
    return !this.image || this.image.length === 0;
  }
},


    isRead: {
      type: Boolean,
      default: false
    },
    timestamp: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

const Message = mongoose.model<IMessage>("Message", messageSchema);
export default Message;