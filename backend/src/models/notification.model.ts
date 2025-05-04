import mongoose, { Schema, Document } from "mongoose";

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  recipientModel: string;
  type: string;
  message: string;
  read: boolean;
  createdAt: Date;
}

const notificationSchema: Schema = new Schema(
  {
    recipient: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "recipientModel",
    },
    recipientModel: { type: String, required: true, enum: ["User", "Owner"] },
    type: { type: String, required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export default mongoose.model<INotification>(
  "Notification",
  notificationSchema
);