import { IBooking } from "./booking";
import { IOwner } from "./owner";

// export interface IOwner {
//     _id: string;
//     name: string;
//     email: string;
//     phone: string;
//   }
  
  export interface IProperty {
    
    _id: string;
    ownerId: string | IOwner; 
    title: string;
    type: string;
    description: string;
    category?: string;
    mapLocation?: {
      place?: string;
      coordinates: {
        latitude: number;
        longitude: number;
      };
    };
    address: string;
    houseNumber: string;
    street: string;
    city: string;
    id:string;
    averageRating:number;
    totalReviews:number;
    district: string;
    state: string;
    pincode: number;
    bedrooms: number;
    bathrooms: number;
    furnishing: "Fully-Furnished" | "Semi-Furnished" | "Not Furnished";
    rentPerMonth: number;
    images: string[];
    minLeasePeriod: number;
    maxLeasePeriod: number;
    rules: string;
    status: "pending" | "active" | "blocked" |"booked" |"rejected";
    cancellationPolicy: string;
    features: string[];
    isBooked: boolean;
     isApproved: boolean;
otherFeatures?:string[]
    createdAt: string; 
    updatedAt: string;
    ownerData?:IOwner;
  
  }
  



export interface PropertyResponse {
  properties: IProperty[];
  totalPages?:number;
  currentPage?:number;
  totalProperties?:number;
}


export interface IPropertyDetails{
  Property:IProperty;
  booking:IBooking[]|[];
  ownerData?:IOwner
}








 export interface Property {
    _id: string;
    ownerId: string;
    title: string;
    type: string;
    description: string;
    address: string;
    city: string;
    state: string;
    pincode: number;
    bedrooms: number;
    bathrooms: number;
    furnishing: 'Fully-Furnished' | 'Semi-Furnished' | 'Unfurnished';
    rentPerMonth: number;
    images: string[];
    minLeasePeriod: number;
    maxLeasePeriod: number;
    rules: string;
    cancellationPolicy: string;
    features: string[]; 
    mapLocation: {
      coordinates: {
        latitude: number | null;
        longitude: number | null;
      };
    };
    isApproved: boolean;
    createdAt: string; 
    updatedAt: string; 
  }
  
  interface owner{
    name:string,
    phone:string,
    email:string
  }


 export interface PropertyFormData {
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

export interface PropertyRes {
  _id: string; 
  title: string;
  location: string;
  beds: number;
  baths: number;
  type: string;
  rentPerMonth: number;
  images: string[];
  bedrooms: number;
  bathrooms: number;
  city: string;
  district: string;
  state: string;
}



export interface FormData {
  title: string;
  description: string;
  type: string;
  bedrooms: string;
  bathrooms: string;
  address: string;
  houseNumber:string,
  street:string,
  city: string;
  district: string;
  state: string;
  pincode: string;
  rentPerMonth: string;
  minLeasePeriod: string;
  maxLeasePeriod: string;
  furnishing: string;
  rules: string;
  selectedImages: any[];
  cancellationPolicy: string;
}

export interface FormErrors {
  title?: string;
  description?: string;
  type?: string;
  bedrooms?: string;
  bathrooms?: string;
  address?: string;
  city?: string;
  district?: string;
  state?: string;
  houseNumber?:string,
  street?:string,
  pincode?: string;
  rentPerMonth?: string;
  minLeasePeriod?: string;
  maxLeasePeriod?: string;
  furnishing?: string;
  selectedImages?: any[];
}

export interface Feature {
  _id: string;
  name: string;
}