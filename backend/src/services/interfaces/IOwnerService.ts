import { IOwner } from "../../models/owner.model";
export interface IOwnerService {
  registerOwner(ownerData: Partial<IOwner>): Promise<{ message: string }>;
//   verifyOTP(email: string, otp: string): Promise<{ message: string }>;
//   resendOTP(email: string): Promise<{ message: string; status: number }>;
//   loginUser(
//     email: string,
//     password: string
//   ): Promise<{ user: IOwner; token: string }>;
//   processGoogleAuth(
//     profile: any
//   ): Promise<{ user: IOwner; token: string; message: string; status: number }>;

}