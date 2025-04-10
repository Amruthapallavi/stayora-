import { IProperty } from "./IProperty";
import { IUser } from "./user.interface";

export interface IBooking {
  _id:string;
  bookingId: string;
  bookingStatus: string ;
  paymentId: string;
  userName?:string;
  ownerName?:string;
  ownerEmail?:string;
  userEmail?:string;
  paymentMethod: string;
  paymentStatus: string ;
  createdAt: string;
  updatedAt: string;
  moveInDate: string;
  endDate: string;
  rentPerMonth: number;
  rentalPeriod: number;
  totalCost: number;
  addOnCost: number;
  addOn: IAddOn[];
  propertyId: IProperty;
  propertyName: string;
  propertyImages: string[];
  userId: IUser;
  ownerId: string;
}

export interface IAddOn {
  serviceId: string;
  serviceName: string;
  serviceCost: number;
}