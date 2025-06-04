import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { Role, UserStatus } from "./status/status";

interface Address {
  houseNo: string;
  street: string;
  city: string;
  district: string;
  state: string;
  pincode: string;
}

export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  status: UserStatus;
  isVerified: boolean;
  role: Role;
  googleId?: string;
  otp?: string | null;
  otpExpires: Date | null;
  address?: Address; 
  createdAt: Date;
  updatedAt: Date;
}

const addressSchema = new Schema(
  {
    houseNo: { type: String, default: "" },
    street: { type: String, default: "" },
    city: { type: String, default: "" },
    district: { type: String, default: "" },
    state: { type: String, default: "" },
    pincode: { type: String, default: "" },
  },
  { _id: false } 
);

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: function (this: { googleId?: string }) {
        return !this.googleId;
      },
    },
    phone: { type: String, trim: true, default: null },
    status: { type: String, enum: Object.values(UserStatus), default:UserStatus.Active },
    role: { type: String, enum: Object.values(Role), default: Role.User },
    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String, default: null },

    address: { type: addressSchema, default: {} },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("User", UserSchema);
export default Users;
