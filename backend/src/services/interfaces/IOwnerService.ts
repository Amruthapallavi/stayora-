import { Response } from "express";
import { IOwner } from "../../models/owner.model";
import { IProperty } from "../../models/property.model";
import mongoose from "mongoose";
import { OwnerResponseDTO } from "../../DTO/OwnerResponseDTO";
import RazorpayVerifyPayload from "./IBookingService";
import verifySubscriptionPayload from "../../DTO/BookingResponseDTO";

export interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  govtId: string;
}

export interface IAddPropertyInput {
  data: Partial<IProperty> & {
    selectedFeatures?: string[];
    addedOtherFeatures?: string[];
    mapLocation?: string | {
      lat: number;
      lng: number;
    };
  };
  ownerId: string;
  images?: string[];
}

export interface IWalletWithTotals {
  userId: mongoose.Types.ObjectId;
  balance: number;
  transactionDetails: {
    paymentType: 'credit' | 'debit';
    amount: number;
    bookingId: string;
    date: Date;
  }[];
  totalDebit: number;
  totalCredit: number;
}

interface IOwnerService {
  registerOwner(ownerData: SignupData): Promise<{ message: string; status: number }>;

  verifyOTP(email: string, otp: string): Promise<{ message: string; status: number }>;

  resendOTP(email: string): Promise<{ message: string; status: number }>;

  loginOwner(
    email: string,
    password: string,
    res: Response
  ): Promise<{
    owner: OwnerResponseDTO;
    token: string;
    refreshToken: string;
    message: string;
    status: number;
  }>;

  resetPassword(email: string, newPassword: string): Promise<{ message: string; status: number }>;

  getProfileData(id: string): Promise<{ user: OwnerResponseDTO |null; status: number; message: string }>;

  getDashboardData(ownerId: string): Promise<{ data: any; status: number; message: string }>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ status: number; message: string }>;

  updateProfile(
    id: string,
    updatedData: Record<string, any>
  ): Promise<{ message: string; status: number }>;

  addProperty(req: IAddPropertyInput): Promise<{ message: string; status: number }>;

  getOwnerStatus(id: string): Promise<{ user: OwnerResponseDTO | null; status: number; message: string }>;

  getPropertyById(id: string): Promise<{ property: IProperty |null; status: number; message: string }>;

  fetchWalletData(id: string): Promise<{ message: string; status: number; data: IWalletWithTotals  }>;
   subscription(
    price: number,
    planName: string,
    ownerId: string,
    allowedProperties:number
  ): Promise<{
    id: string;
    amount: number;
    currency: string;
  }>;
 verifySubscription(
    payload: verifySubscriptionPayload
  ): Promise<{
    isValid: boolean;
  }>;
}

export default IOwnerService;
