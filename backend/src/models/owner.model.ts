import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IOwner extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  phone: string;
  password: string;
  govtId: string;
  address:string;
  houses?: ObjectId;
  status: "pending" | "blocked" | "active";
  isVerified: boolean;
  otp?: string;
  otpExpires:Date |undefined,

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
      enum: ["pending", "blocked", "active"],
      default: "pending",
    },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },  },
  { timestamps: true }
);

const owners = mongoose.model<IOwner>("Owners", ownerSchema);
export default owners;