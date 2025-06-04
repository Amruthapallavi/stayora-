import { IBooking } from "../models/booking.model";
import { BookingStatus, PaymentStatus } from "../models/status/status";


export interface CreateBookingOrderResponseDTO {
  id: string;
  amount: number;
  currency: string;
  bookingId: string;
}
export interface VerifyBookingPaymentResponseDTO {
  isValid: boolean;
  booking: IBooking | null;
}
export interface BookingUpdateDTO {
  paymentStatus: PaymentStatus;
  bookingStatus: BookingStatus;
  paymentId: string;
}

export interface IResponse {
  status: number;
  message: string;
}

export default interface verifySubscriptionPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    ownerId:string;
planName:string;
price:number;
allowedProperties:number;    
  }


export interface AddOnDTO {
  serviceId: string;
  serviceName: string;
  serviceCost: number;
  contactNumber?: string;
  contactMail?: string;
}

export interface BookingDTO {
//   _id: string;                     
  bookingId: string;
  userId: string;
  ownerId: string;
  propertyId: string;
  propertyName: string;
  propertyImages: string[];
  moveInDate: string;             
  rentalPeriod: number;
  endDate: string;
  rentPerMonth: number;
  addOn: AddOnDTO[];
  addOnCost: number;
  totalCost: number;
  paymentMethod: string;
  paymentId?: string;
  paymentStatus: string;
  bookingStatus: string;
  isCancelled: boolean;
  cancellationReason?: string;
  refundAmount: number;
  createdAt: string;
  updatedAt: string;
}

export interface IBookingData {
  userId:  string;
  ownerId: string;
  propertyId: string;
  propertyName: string;
  propertyImages: string[];
  moveInDate: Date | string;
  rentalPeriod: number; 
  endDate: Date | string;
  rentPerMonth: number;
  addOn?: {
    serviceId: string;
    serviceName: string;
    serviceCost: number;
  }[];
  addOnCost?: number;
  totalCost: number;
  paymentMethod: string;
  paymentStatus:PaymentStatus;
  bookingStatus: BookingStatus;
  bookingId: string;
}

