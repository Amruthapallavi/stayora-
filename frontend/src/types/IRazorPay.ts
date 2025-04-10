import { IBooking } from "./IBooking";

export interface RazorpayOrderResponse {
    id: string;
    amount: number;
    currency: string;
  }
  
  export interface RazorpayVerifyResponse {
    success: boolean;
    booking: IBooking; // Assuming you have a `Booking` interface/type defined
  }
  



  export interface Feature {
    _id: string;
    name: string;
  }
  
 export interface FormData {
    title: string;
    type: string;
    minLeasePeriod: string;
    maxLeasePeriod: string;
    bedrooms: string;
    bathrooms: string;
    houseNumber: string;
    street: string;
    address: string;
    city: string;
    district: string;
    state: string;
    pincode: string;
    rentPerMonth: string;
    furnishing: string;
    description: string;
    rules: string;
    cancellationPolicy: string;
    selectedFeatures: string[];
    addedOtherFeatures: string[];
    selectedImages: string[];
    mapLocation?: { lat: number; lng: number };
  }
  
  