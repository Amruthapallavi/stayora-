import { IAddOn } from "./booking";
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
