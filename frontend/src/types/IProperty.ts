export interface IOwner {
    _id: string;
    name: string;
    email: string;
    phone: string;
  }
  
  export interface IProperty {
    _id: string;
    ownerId: string | IOwner; // Updated to handle populated owner
    title: string;
    type: string;
    description: string;
    category?: string;
    location?: {
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
    status: "pending" | "active" | "blocked" |"booked";
    cancellationPolicy: string;
    features: string[];
    isBooked: boolean;
    createdAt: string; // ISO date string
    updatedAt: string;
  }
  