import { IUser } from "../models/user.model";

export interface PaginationDTO {
  page: number;
  limit: number;
}
export interface VerifyOtpDTO {
  email: string;
  otp: string;
}
export interface ResendOtpDTO {
  email: string;
}
export interface ResetPasswordDTO {
  email: string;
  newPassword: string;
}
export interface GoogleProfileDTO {
  id: string;
  email: string;
  displayName: string;
}

export interface IReviewResponse {
  _id: string;
  userId: Partial<IUser>;
  ratings:number;
  reviewText: string;
  createdAt: string; 
}
