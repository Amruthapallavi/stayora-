import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IOwner extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  govtId: string;
  govtIdStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  address: string;
  houses?: ObjectId;
  status: "Pending" | "Blocked" | "Active";
  isVerified: boolean;
  otp?: string | null;
  otpExpires: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ownerSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    phone: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    address: { type: String, trim: true },
    houses: { type: Schema.Types.ObjectId, ref: "houses", default: null },
    status: {
      type: String,
      enum: ["Pending", "Blocked", "Active"],
      default: "Pending",
    },
    govtId: { type: String, required: true }, // Stores uploaded file path
    govtIdStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    rejectionReason: { type: String, default: null }, // Stores rejection reason

    isVerified: { type: Boolean, default: false },
    otp: { type: String, default: null },
    otpExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

const Owners = mongoose.model<IOwner>("Owners", ownerSchema);
export default Owners;
