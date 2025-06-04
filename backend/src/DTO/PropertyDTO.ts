import mongoose from "mongoose";
import { PropertyStatus } from "../models/status/status";


export interface PropertyResponseDTO {
  ownerId: string; 
  title: string;
  type: string;
  description: string;
  category?: string | null;
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
  cancellationPolicy: string;
  features: string[];
  otherFeatures?: string[];
  status: PropertyStatus;
}













export interface IWalletWithTotals {
  userId: mongoose.Types.ObjectId;
  balance: number;
  transactionDetails: {
    paymentType: "credit" | "debit";
    amount: number;
    bookingId: string;
    date: Date;
  }[];
  totalDebit: number;
  totalCredit: number;
}