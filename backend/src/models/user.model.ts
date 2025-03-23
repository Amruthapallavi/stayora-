import mongoose, { Schema, Document, ObjectId } from "mongoose";



export interface IUser extends Document {
  _id: ObjectId;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  bookings?: ObjectId;
  status: "Active" | "Blocked";
  isVerified: boolean;
  role:"user" | "admin";
  googleId?: string;
  otp?:string|null,
  otpExpires:Date |null,
  createdAt: Date;
  updatedAt: Date;
}

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
    bookings: { type: Schema.Types.ObjectId, ref: "Bookings", default: null },
    status: { type: String, enum: ["Active", "Blocked"], default: "Active" },
    role: { type: String, enum: ["user", "admin"], default: "user" },

    isVerified: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    googleId: { type: String, default: null },
  },
  { timestamps: true }
);

const Users = mongoose.model<IUser>("User", UserSchema);
export default Users;