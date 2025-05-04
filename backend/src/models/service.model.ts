import mongoose, { Schema, Document } from "mongoose";

export interface IService extends Document {
  name: string;
  description: string;
  price: number;
  availability: boolean;
  status: "active" | "disabled";
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
    status: { type: String, enum: ["active", "disabled"], default: "active" },
    image: { type: String }, 
  },
  { timestamps: true }
);

const Service = mongoose.model<IService>("Service", serviceSchema);
export default Service;
