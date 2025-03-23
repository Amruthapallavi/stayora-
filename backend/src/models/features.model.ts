import mongoose, { Schema, Document } from "mongoose";

export interface IFeature extends Document {
  name: string;
  description: string;
  icon?: string; 
  createdAt: Date;
  updatedAt: Date;
}

const featureSchema: Schema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    icon: { type: String, trim: true }, // Optional field for icon URL
  },
  { timestamps: true }
);

const Feature = mongoose.model<IFeature>("Feature", featureSchema);
export default Feature;
