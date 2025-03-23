import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IProperty extends Document {
  owner: mongoose.Types.ObjectId;
  name: string;
  address: string;
  location: {
    type: "Point";
    coordinates: number[];
  };
  price: number;
  images: string[];
  services: string[];
  status: "active" | "disabled";
  verificationStatus: "pending" | "approved" | "rejected";
  createdAt: Date;
  updatedAt: Date;
}

const propertySchema: Schema = new Schema(
  {
    owner: { type: Schema.Types.ObjectId, ref: "Owner", required: true },
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
        index: "2dsphere",
      },
    },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    services: { type: [String], default: [] },
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    verificationStatus: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const property = mongoose.model<IProperty>("Venue", propertySchema);
export default property;