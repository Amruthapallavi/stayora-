import mongoose, { Schema, Document } from "mongoose";
import { PropertyStatus } from "./status/status";





export interface IProperty extends Document {
  ownerId: mongoose.Types.ObjectId;
  title: string;
  type: string;
  description: string;
  category?: mongoose.Types.ObjectId |null;
  mapLocation?: {
    place?: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  address: string;
    houseNumber: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: number;
  
  bedrooms: number;
  bathrooms: number;
  furnishing: "Fully-Furnished" | "Semi-Furnished" | "Not Furnished";
  rentPerMonth: number;
  images: string[];
  minLeasePeriod: number;
  maxLeasePeriod: number;
  rules: string;
  cancellationPolicy: string;
  features: string[];
  otherFeatures?:string[];
  isRejected:boolean;
  rejectedReason:string;
  isBooked:boolean;
  averageRating:number;
  totalReviews: number;
  status:PropertyStatus;
  createdAt: Date;
  updatedAt: Date;
}


const propertySchema: Schema = new Schema(
  {
    ownerId: { type: Schema.Types.ObjectId, ref: "Owners", required: true },
    title: { type: String, required: true, trim: true },
    type: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category" },

    mapLocation: {
      place: { type: String, }, 
      coordinates: {
        latitude: { type: Number, default: null },
        longitude: { type: Number, default: null },
      },
    },

      address:{type:String},
      houseNumber: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      district: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: Number, required: true },
    

    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    furnishing: {
      type: String,
      enum: ["Fully-Furnished", "Semi-Furnished", "Not Furnished"],
      required: true,
    },
    rentPerMonth: { type: Number, required: true },
    images: { type: [String], default: [] },
    minLeasePeriod: { type: Number, required: true },
    maxLeasePeriod: { type: Number, required: true },
    rules: { type: String, default: "" },
    cancellationPolicy: { type: String, default: "" },
    features: { type: [String], default: [] },
    otherFeatures: { type: [String], default: [] },
    isRejected:{type:Boolean,default:false},
     rejectedReason:{type:String},
     averageRating: { type: Number, default: 0 },
totalReviews: { type: Number, default: 0 },
    isBooked:{type:Boolean,default:false},
    status: {
      type: String,
      enum: Object.values(PropertyStatus), default:PropertyStatus.Pending,
      required: true,
    },
  },
  { timestamps: true }
);

const Property = mongoose.model<IProperty>("Property", propertySchema);
export default Property;
