import { IOwner } from "./owner";
import { IProperty } from "./property";
import { IUser } from "./user";

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
  propertyId: string |IProperty;
  propertyName: string;
  propertyImages: string[];
  userId: string | IUser;
  ownerId: string;
}

export interface IAddOn {
  serviceId: string;
  serviceName: string;
  serviceCost: number;
  contactNumber?: string;
}

export interface IBookingList{
  _id: string;
  bookingId: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  cancellationReason?: string;
  createdAt: string; 
  updatedAt: string; 
  endDate: string;
  moveInDate: string;
  isCancelled: boolean;
  rentalPeriod: number;
  rentPerMonth: number;
  totalCost: number;
  refundAmount: number;
  paymentId: string;
  paymentMethod: 'razorpay' | 'stripe' | 'cash' | 'wallet';
  paymentStatus: 'completed' | 'pending' | 'refunded';
  userId: string;
  ownerId: string;
  propertyId: IProperty;
  propertyImages?:string[];
  addOnCost: number;
  bookings: BookingAddOn[];
}
export interface BookingAddOn {
  addOn: IAddOn[];
}
export interface IBookingResponse {
  bookings: IBookingList[];
  currentPage: number;
  totalPages: number;
  status: string; 
}

export interface IBookingAdminResponse {
  bookings: ISimpleBooking[];  
  currentPage: number;
  totalPages: number;
}
export interface ISimpleBooking {
  _id: string;
  id?: string; 
  bookingId: string;
  bookingStatus: 'confirmed' | 'pending' | 'cancelled' | 'completed';
  createdAt: string;
  moveInDate: string;
  endDate: string;
  totalCost: number;
  paymentStatus: 'completed' | 'pending' | 'refunded';

  userName: string;
  userEmail: string;
  ownerName: string;
  ownerEmail: string;

  propertyName: string;
}


export interface IBookingDetailedData{
  bookingData:IBooking;
  userData:IUser;
  ownerData?:IOwner;
}

export interface IReviewUserResponse{
  user:string;
  mail:string;
  createdAt:string;
  reviewText:string;
  rating:number;
}

export interface IOwnerBookingDetails {
 bookingData:{ _id: string;
  bookingId: string;
  bookingStatus: "confirmed" | "pending" | "cancelled" | string;
  createdAt: string;
  updatedAt: string;
  moveInDate: string;
  endDate: string;
  rentalPeriod: number;
  rentPerMonth: number;
  totalCost: number;
  refundAmount: number;
  addOn: string[]; 
  addOnCost: number;
  isCancelled: boolean;
  paymentId: string;
  paymentMethod: "razorpay" | "stripe" | "wallet" | string;
  paymentStatus: "completed" | "pending" | "failed" | string;
  propertyId: {
    _id: string;
    title: string;
    type: string;
    location: {
      lat: number;
      lng: number;
    };
    ownerId: string;
  };
  propertyImages: string[];
  propertyName: string;
  ownerId: string;
  userId: string;
}
  userData: IUser;
  ownerData?:IOwner;
}



export interface IOwnerBookings {
  _id: string;
  bookingId: string;
  userId: IUser;
  ownerId: string;
  propertyId: IProperty;
  propertyName: string;
  propertyImages: string[];
  bookingStatus: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  moveInDate: string;
  endDate: string;
  rentalPeriod: number;
  rentPerMonth: number;
  totalCost: number;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  isCancelled: boolean;
  refundAmount: number;
  addOn: IAddOn[];
  addOnCost: number;
  createdAt: string;
  updatedAt: string;
}
export interface IOwnerBookingRes{
  bookings:IOwnerBookings[];
  totalPages?:number;
  currentPage?:number;
}

export interface IAddOn {
  serviceId: string;
  serviceName: string;
  serviceCost: number;
}

export interface IMapLocation {
  coordinates: {
    latitude: number;
    longitude: number;
  };
}


export interface IBookingRes {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  createdAt: string;
  updatedAt: string;
  moveInDate: string;
  endDate: string;
  rentalPeriod: number;
  rentPerMonth: number;
  totalCost: number;
  refundAmount: number;
  addOnCost: number;
  addOn: IAddOn[];
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  isCancelled: boolean;

  userId: string;
  ownerId: string;
  propertyId: string;

  // Property details
  address: string;
  bathrooms: number;
  bedrooms: number;
  cancellationPolicy: string;
  category: string | null;
  city: string;
  description: string;
  district: string;
  features: string[];
  furnishing: string;
  houseNumber: string;
  images: string[];
  mapLocation: IMapLocation;
  maxLeasePeriod: number;
  minLeasePeriod: number;
  otherFeatures: string[];
  pincode: number;
  propertyImages: string[];
  propertyName: string;
  rules: string;
  state: string;
  status: string;
  street: string;
  title: string;
  type: string;

  isBooked: boolean;
  isRejected: boolean;

  ownerData: IOwnerData;
}




//common
export interface IBookingDetailsResponse {
  bookingData: IBookingData;
  userData: IUserData;
  ownerData?: IOwner; 
}

interface IBookingData {
  _id: string;
  bookingId: string;
  bookingStatus: string;
  paymentId: string;
  paymentMethod: string;
  paymentStatus: string;
  moveInDate: string;
  endDate: string;
  isCancelled: boolean;
  createdAt: string;
  updatedAt: string;
  rentPerMonth: number;
  rentalPeriod: number;
  totalCost: number;
  refundAmount: number;
  addOnCost: number;
  addOn: any[]; // You can define a proper interface if addons have a structure
  ownerId: string;
  userId: string;
  propertyId: IPropertyDetails;
  propertyName: string;
  propertyImages: string[];
}

interface IPropertyDetails {
  _id: string;
  title: string;
  type: string;
  furnishing: string;
  description: string;
  rentPerMonth: number;
  minLeasePeriod: number;
  maxLeasePeriod: number;
  features: string[];
  otherFeatures: string[];
  cancellationPolicy: string;
  rules: string;
  averageRating: number;
  totalReviews: number;
  isBooked: boolean;
  isRejected: boolean;
  category: string | null;
  status: string;
  address: string;
  street: string;
  houseNumber: string;
  city: string;
  district: string;
  state: string;
  pincode: number;
  bathrooms: number;
  bedrooms: number;
  mapLocation: {
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  images: string[];
  createdAt: string;
  updatedAt: string;
}

interface IUserData {
  id: string;
  name: string;
  email: string;
  phone: string;
  isVerified: boolean;
  status: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  address: {
    houseNo: string;
    street: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
  };
}

export interface IOwnerData {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  isVerified: boolean;
  isSubscribed: boolean;
  govtId: string;
  govtIdStatus: string;
  subscriptionStart: string | null;
  subscriptionEnd: string | null;
  rejectionReason: string | null;
  address?: {
    houseNo?: string;
    street?: string;
    city?: string;
    district?: string;
    state?: string;
    pincode?: string;
  };
  createdAt: string;
  updatedAt: string;
}




