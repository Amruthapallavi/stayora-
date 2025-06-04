import mongoose, { Schema, Document } from "mongoose";
import { ServiceStatus } from "./status/status";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  availability: boolean;
  status: ServiceStatus;
  image: string; 
  contactMail:string;
  contactNumber:string;
  createdAt: Date;
  updatedAt: Date;
}

const serviceSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true },
    contactMail:{type:String,required:true,trim:true},
    contactNumber: { type: String, trim: true, default: null },

    availability: { type: Boolean, default: true }, 
    status: { type: String, enum: Object.values(ServiceStatus), default: ServiceStatus.Active },
    image: { type: String }, 
  },
  { timestamps: true }
);

const Service = mongoose.model<IService>("Service", serviceSchema);
export default Service;
