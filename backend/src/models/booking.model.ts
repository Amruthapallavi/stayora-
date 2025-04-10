import mongoose, { Schema, Document, ObjectId } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IAddOn {
  serviceId: ObjectId;
  serviceName: string;
  serviceCost: number;
  contactNumber?:string;
  contactMail?:string;
}

export interface IBooking extends Document {
  bookingId: string;
  userId: ObjectId;
  ownerId:ObjectId;
  propertyId: ObjectId;
  propertyName: string;
  propertyImages: string[];
  moveInDate: Date;
  rentalPeriod: number;
  endDate: Date;
  rentPerMonth: number;
  addOn: IAddOn[];
  addOnCost: number;
  totalCost: number;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus: "pending" | "completed" | "failed";
  bookingStatus: "pending" | "confirmed" | "cancelled";
  createdAt: Date;
  updatedAt: Date;
}

const addOnSchema = new Schema<IAddOn>(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true },
    serviceCost: { type: Number, required: true },
  },
  { _id: false }
);

const bookingSchema = new Schema<IBooking>(
  {
    bookingId: {
      type: String,
      unique: true,
      default: () => `BOOK-${uuidv4().split("-")[0].toUpperCase()}`,
    },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    ownerId: { type: Schema.Types.ObjectId, ref: "Owner", required: true },

    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    propertyName: { type: String, required: true },
    propertyImages: [{ type: String, required: true }],
    moveInDate: { type: Date, required: true },
    rentalPeriod: { type: Number, required: true },
    endDate: { type: Date, required: true },
    rentPerMonth: { type: Number, required: true },
    addOn: { type: [addOnSchema], default: [] },
    addOnCost: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    paymentId: { type: String },
    paymentStatus: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
    },
    bookingStatus: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model<IBooking>("Booking", bookingSchema);
export default Booking;
