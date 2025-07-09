import { IProperty } from "./property";


export interface ICart {
  _id: string;
  userId: string;
  properties: IProperty[];
  totalCost: number;
  createdAt: Date;
  updatedAt: Date;

  moveInDate?: string | Date;
  rentalPeriod?: number;
  endDate?: string | Date;
  selectedAddOns?: string[];
}

interface CartData {
  _id: string;
  userId: string;
  properties: PropertySummary[]; 
  totalCost: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
interface PropertySummary {
  _id: string;
}

export interface CartResponse {
  cartData: CartData;
  property: IProperty;
}