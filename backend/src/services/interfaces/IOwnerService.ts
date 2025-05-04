import { Response } from "express";
import { IOwner } from "../../models/owner.model";
export interface IOwnerService {
  registerOwner(ownerData: Partial<IOwner>): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
//   resendOTP(email: string): Promise<{ message: string; status: number }>;
loginOwner(
  email: string,
  password: string,
  res: Response<any, Record<string, any>> 
): Promise<{ owner: IOwner; token: string; message: string; refreshToken:string, status: number }>;
//   processGoogleAuth(
//     profile: any
//   ): Promise<{ user: IOwner; token: string; message: string; status: number }>;

}