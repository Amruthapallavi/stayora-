import { Response } from "express";
import { IUser } from "../../models/user.model";
export interface IUserService {
  registerUser(userData: Partial<IUser>): Promise<{ message: string }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string }>;
  resendOTP(email: string): Promise<{ message: string; status: number }>;
  loginUser(
    email: string,
    password: string,
  res: Response<any, Record<string, any>> 
  ): Promise<{ user: IUser; token: string ,message:string,refreshToken:string}>;
  processGoogleAuth(
    profile: any
  ): Promise<{ user?: IUser; token?: string; message: string; status: number }>;
}