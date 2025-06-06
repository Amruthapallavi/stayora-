import { IUser } from "./user";

export interface Property {
  id: string;
  title: string;
  type: string;
  rentPerMonth: number;
  city: string;
  images: string[];
  views?: number;
  bookings?: number;
  revenue?: number;
}

export interface StatCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  trend?: 'up' | 'down';
  trendValue?: string;
}


export interface IResponse {
    success: boolean;
    message: string;
    status?:number;
    error?: boolean;
  }
  
  export interface IReview {
  _id: string;
  userId: Partial<IUser>;
  rating:number;
  reviewText: string;
  createdAt: string; 
}
export interface IReviewResponse{
  message:string;
  reviews:IReview[]
}