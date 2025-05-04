import mongoose, { Schema, Document, ObjectId } from "mongoose";

export interface IAddOn {
  serviceId: ObjectId;
  serviceName: string;
  serviceCost: number;
}
interface ILocation {
  latitude: number;
  longitude: number;
}

interface IProperty {
  propertyId: mongoose.Types.ObjectId;
  propertyName: string;
  moveInDate?: Date;
  rentalPeriod?: number;
  endDate?: Date;
  address?:string;
  propertyImages: string[];
  rentPerMonth: number;
  addOn?: IAddOn[];
  addOnCost?: number;
  totalCost: number;
  location?:ILocation[];
}

export interface ICart extends Document {
  _id: ObjectId;
  userId: ObjectId;
  properties: IProperty[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;
}

const addOnSchema: Schema = new Schema(
  {
    serviceId: { type: Schema.Types.ObjectId, ref: "Service", required: true },
    serviceName: { type: String, required: true },
    serviceCost: { type: Number, required: true },
  },
  { _id: false }
);

const propertySchema: Schema = new Schema(
  {
    propertyId: { type: Schema.Types.ObjectId, ref: "Property", required: true },
    propertyName: { type: String, required: true },
    moveInDate: { type: Date, required: false },         
    rentalPeriod: { type: Number, required: false },     
    endDate: { type: Date, required: false },            
    propertyImages: [{ type: String, required: true }],
    rentPerMonth: { type: Number, required: true },
    addOn: { type: [addOnSchema], default: [] },
    addOnCost: { type: Number, default: 0 },
    totalCost: { type: Number, required: true },
    location: {
      latitude: { type: Number, required: false },
      longitude: { type: Number, required: false },
    },
  },
  { _id: false }
);



const cartSchema: Schema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    properties: { type: [propertySchema], required: true },
    totalCost: { type: Number, required: true },
  },
  { timestamps: true }
);

const Cart = mongoose.model<ICart>("Cart", cartSchema);
export default Cart;
