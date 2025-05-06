import { Response } from "express";
import { IUser } from "../../models/user.model";
import { IWallet } from "../../models/wallet.model";
import mongoose from "mongoose";
export interface IUserService {
  registerUser(userData: SignupData): Promise<{ message: string; status: number }>;
  verifyOTP(email: string, otp: string): Promise<{ message: string; status: number }>;
  resendOTP(email: string): Promise<{ message: string; status: number }>;
  loginUser(email: string, password: string, res: Response): Promise<{ user: IUser; token: string; message: string; refreshToken: string; status: number }>;
  resetPassword(email: string, newPassword: string): Promise<{ message: string; status: number }>;
  processGoogleAuth(profile: any): Promise<{ user: IUser; token: string; message: string; status: number }>;
  getAllProperties(): Promise<{ properties: any[]; status: number; message: string }>;
  saveBookingDates(
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    userId: string,
    propertyId: string
  ): Promise<{ status: number; message: string }>;
  getProfileData(id: string): Promise<{ user: any; status: number; message: string }>;
  getPropertyById(
    id: string
  ): Promise<{ property: any; ownerData: any; status: number; message: string }>;
  getUserStatus(id: string): Promise<{ user: any | null; status: number; message: string }>;
  getCartData(
    propertyId: string,
    userId: string
  ): Promise<{ cartData: any; property: any; status: number; message: string }>;
  getUserBookings(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ bookings: any[] | null; totalPages: number; status: number; message: string }>;
  listServices(): Promise<{ services: any[]; status: number; message: string }>;
  saveAddOnsForProperty(
    userId: string,
    propertyId: string,
    addOnIds: string[]
  ): Promise<{ status: number; message: string }>;
  updateProfile(
    id: string,
    updatedData: Record<string, any>
  ): Promise<{ message: string; status: number }>;
  fetchWalletData(id: string): Promise<{ message: string; status: number; data: IWalletWithTotals | null }>;
  changePassword(userId: string, oldPassword: string, newPassword: string): Promise<{ status: number; message: string }>;
  cancelBooking(id: string, reason: string): Promise<{ status: number; message: string }>;
  updateBookingAndPropertyStatus(): Promise<void>;
}

export interface SignupData extends Partial<IUser> {
  confirmPassword?: string;
}

export   interface IWalletWithTotals {
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