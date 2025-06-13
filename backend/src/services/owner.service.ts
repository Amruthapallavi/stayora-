import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";

import OTPService from "../utils/OTPService";
import { response, Response } from "express";
import { IOwner } from "../models/owner.model";
import IOwnerService, { SignupData } from "./interfaces/IOwnerService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import Property, { IProperty } from "../models/property.model";
import { inject, injectable } from "inversify";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import TYPES from "../config/DI/types";
import mongoose, { Types } from "mongoose";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import {
  GovtIdStatus,
  SubscriptionPlan,
  UserStatus,
} from "../models/status/status";
import { IWalletWithTotals } from "../DTO/PropertyDTO";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { mapOwnerToDTO } from "../mappers/ownerMapper";
import verifySubscriptionPayload from "../DTO/BookingResponseDTO";
import { INotificationService } from "./interfaces/INotificationServices";
dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

@injectable()
export class OwnerService implements IOwnerService {
  constructor(
    @inject(TYPES.OwnerRepository)
    private ownerRepository: IOwnerRepository,
    @inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  private sanitizeUser(user: IOwner) {
    const { password, otp, __v, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  async registerOwner(
    ownerData: SignupData
  ): Promise<{ message: string; status: number }> {
    const { name, email, password, confirmPassword, phone, govtId } = ownerData;

    if (!name || !email || !password || !confirmPassword || !phone || !govtId) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }

    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }

    const existingOwner = await this.ownerRepository.findByEmail(email);
    if (existingOwner) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    console.log(otp, "owner otp");

    await OTPService.sendOTP(email, otp);
    console.log("Sent OTP:", otp, "to email:", email);

    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.ownerRepository.create({
      ...ownerData,
      govtIdStatus: GovtIdStatus.Pending,
      status: UserStatus.Pending,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
      govtId,
    });

    return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    const owner = await this.ownerRepository.findByEmail(email);
    if (!owner) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    console.log(owner.otp, otp);
    if (owner.otp !== otp || (owner.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    owner.isVerified = true;
    owner.otp = undefined;
    owner.status = UserStatus.Pending;
    owner.otpExpires = null;

    await this.ownerRepository.update(owner._id.toString(), owner);

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const owner = await this.ownerRepository.findByEmail(email);
    if (!owner) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    // if (owner.isVerified) {
    //   throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    // }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);

    console.log(newOtp);

    owner.otp = newOtp;
    owner.otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 10 minutes from now

    await this.ownerRepository.update(owner._id.toString(), owner);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }

  async loginOwner(
    email: string,
    password: string,
    res: Response
  ): Promise<{
    owner: OwnerResponseDTO;
    token: string;
    message: string;
    refreshToken: string;
    status: number;
  }> {
    const owner = await this.ownerRepository.findByEmail(email);
    if (!owner) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (owner.status === "Blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED_USER);
    }
    if (
      owner.status === UserStatus.Pending &&
      owner.govtIdStatus === "pending"
    ) {
      throw new Error(MESSAGES.ERROR.NOT_VERIFIED);
    }

    if (!owner.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const isPasswordValid = await bcrypt.compare(password, owner.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    const accessTokenSecret = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessTokenSecret || !refreshTokenSecret) {
      throw new Error("JWT secrets are missing.");
    }

    const accessToken = jwt.sign(
      { ownerId: owner._id, type: "owner" },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      { ownerId: owner._id, type: "owner" },
      refreshTokenSecret,
      { expiresIn: "7d" }
    );

    await this.ownerRepository.updateRefreshToken(
      owner._id.toString(),
      refreshToken
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return {
      owner: mapOwnerToDTO(owner),
      token: accessToken,
      refreshToken: refreshToken,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string; status: number }> {
    const owner = await this.ownerRepository.findByEmail(email);
    if (!owner) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    owner.password = hashedPassword;
    owner.otp = null;
    owner.otpExpires = null;
    owner.isVerified = true;

    await this.ownerRepository.update(owner._id.toString(), owner);
    return {
      message: MESSAGES.SUCCESS.PASSWORD_RESET,
      status: STATUS_CODES.OK,
    };
  }

  async getProfileData(
    id: string
  ): Promise<{
    user: OwnerResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const user = await this.ownerRepository.findById(id);

      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        user: mapOwnerToDTO(user),
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in getProfileData:", error);
      return {
        user: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getDashboardData(
    ownerId: string
  ): Promise<{ data: any; status: number; message: string }> {
    try {
      const properties = await this.ownerRepository.getPropertiesByOwner(
        ownerId
      );
      const propertyIds: string[] = properties.map((p) => String(p._id));
      const totalProperties = properties.length;
      const totalActiveProperties = properties.filter(
        (p) => p.status === "active"
      ).length;
      const totalRejectedProperties = properties.filter(
        (p) => p.status === "rejected"
      ).length;

      const bookings = await this.ownerRepository.getBookingsByPropertyIds(
        propertyIds
      );
      const bookingsByMonth = await this.ownerRepository.bookingsByMonth(
        ownerId
      );
      const totalBookings = bookings.filter(
        (b) => b.bookingStatus === "confirmed"
      ).length;
      const completedBookings = bookings.filter(
        (b) => b.bookingStatus === "completed"
      );
      const totalCompletedBookings = completedBookings.length;

      const totalRevenue = bookings.reduce((sum, b) => sum + b.totalCost, 0);

      const dashboardData = {
        totalProperties,
        totalActiveProperties,
        totalRejectedProperties,
        totalBookings,
        totalCompletedBookings,
        totalRevenue,
        allBookings: bookings,
        bookingsByMonth,
      };

      return {
        data: dashboardData,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in getDashboardData:", error);
      return {
        data: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async updateProfile(
    id: string,
    updatedData: Record<string, any>
  ): Promise<{ message: string; status: number }> {
    try {
      if (!id) {
        return {
          message: "Invalid user ID",
          status: STATUS_CODES.BAD_REQUEST,
        };
      }

      const user = await this.ownerRepository.findById(id);
      if (!user) {
        return {
          message: "User not found",
          status: STATUS_CODES.NOT_FOUND,
        };
      }
      user.name = updatedData.data.name;
      user.phone = updatedData.data.phone;
      user.address = updatedData.data.address;
      await user.save();

      return {
        message: "Profile updated successfully",
        status: STATUS_CODES.OK,
      };
    } catch (error) {
      console.error("Error updating profile:", error);
      return {
        message: "Internal Server Error",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async addProperty(req: {
    data: Partial<IProperty> & {
      selectedFeatures?: string[];
      addedOtherFeatures?: string[];
    };
    ownerId: string;
    images?: string[];
  }): Promise<{ status: number; message: string }> {
    try {
      const { data, ownerId, images } = req;
      if (!ownerId) {
        return { status: 400, message: "Owner ID is missing" };
      }

      if (
        !data.title ||
        !data.rentPerMonth ||
        !data.type ||
        !data.description ||
        !data.bedrooms ||
        !data.bathrooms ||
        !data.furnishing ||
        !data.minLeasePeriod ||
        !data.maxLeasePeriod ||
        !data.address ||
        !data.houseNumber ||
        !data.street ||
        !data.city ||
        !data.district ||
        !data.state ||
        !data.pincode
      ) {
        return { status: 400, message: "Missing required fields" };
      }
      const features = [
        ...(data.selectedFeatures || []),
        ...(data.addedOtherFeatures || []),
      ];
      const selectedFeatureIds: string[] = Array.isArray(data.selectedFeatures)
        ? data.selectedFeatures
        : data.selectedFeatures
        ? [data.selectedFeatures]
        : [];

      const featureDocs = await this.ownerRepository.getFeatureNamesByIds(
        selectedFeatureIds
      );

      const selectedFeatureNames = featureDocs.map((f: any) => f.name);

      const addedOtherFeatures = Array.isArray(data.addedOtherFeatures)
        ? data.addedOtherFeatures
        : data.addedOtherFeatures
        ? [data.addedOtherFeatures]
        : [];

      const allFeatures = [...selectedFeatureNames, ...addedOtherFeatures];

      const parsedMapLocation =
        typeof data.mapLocation === "string"
          ? JSON.parse(data.mapLocation)
          : data.mapLocation;

      const newProperty = new Property({
        ownerId,
        title: data.title.trim(),
        type: data.type.trim(),
        description: data.description.trim(),
        category: data.category || null,

        location: {
          coordinates: {
            latitude: parsedMapLocation?.lat,
            longitude: parsedMapLocation?.lng,
          },
        },

        address: data.address?.trim() || "",
        houseNumber: data.houseNumber?.trim() || "",
        street: data.street?.trim() || "",
        city: data.city?.trim() || "",
        district: data.district?.trim() || "",
        state: data.state?.trim() || "",
        pincode: Number(data.pincode),

        bedrooms: Number(data.bedrooms),
        bathrooms: Number(data.bathrooms),
        furnishing: data.furnishing,
        rentPerMonth: Number(data.rentPerMonth),
        minLeasePeriod: Number(data.minLeasePeriod),
        maxLeasePeriod: Number(data.maxLeasePeriod),
        rules: data.rules || "",
        cancellationPolicy: data.cancellationPolicy || "",
        features: allFeatures,

        images: images || [],
      });

      await newProperty.save();

      return { status: 201, message: "Property added successfully" };
    } catch (error) {
      console.error("Error in ownerService.addProperty:", error);
      return { status: 500, message: "Internal Server Error" };
    }
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.ownerRepository.findUserById(userId);
      if (!user) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: MESSAGES.ERROR.USER_NOT_FOUND,
        };
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password || "");
      if (!isMatch) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: MESSAGES.ERROR.INCORRECT_PASSWORD,
        };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.ownerRepository.updateUserPassword(userId, hashedPassword);

      return {
        status: STATUS_CODES.OK,
        message: "Password updated successfully",
      };
    } catch (error) {
      console.error("Error in changePasswordService:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async subscription(
    price: number,
    planName: string,
    ownerId: string,
    allowedProperties: number
  ): Promise<{ id: string; amount: number; currency: string }> {
    try {
      const options = {
        amount: price * 100,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      if (!price || isNaN(price) || price <= 0) {
        throw new Error("Invalid price value");
      }

      const order = await razorpay.orders.create(options);
      
      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
      };
    } catch (error) {
      console.error("subscription order creation failed:", error);
      throw new Error("Failed to create subscription order");
    }
  }

  async verifySubscription(
    payload: verifySubscriptionPayload
  ): Promise<{ isValid: boolean }> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        ownerId,
        planName,
        price,
        allowedProperties,
      } = payload;
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error(
          "RAZORPAY_KEY_SECRET is not defined in environment variables"
        );
      }
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");

      const isValid = generatedSignature === razorpay_signature;
      if (isValid) {
        const response = await this.ownerRepository.update(ownerId, {
          subscriptionPlan:
            SubscriptionPlan[planName as keyof typeof SubscriptionPlan],
          subscriptionPrice: price,
          isSubscribed: true,
          allowedProperties: allowedProperties,
        });
      }
      const notificationMessage = `You have successfully subscribed to the ${planName} plan. Enjoy your premium benefits!`;

      await this.notificationService.createNotification(
        ownerId.toString(),
        "Owner",
        "Subscription",
        notificationMessage,
        null
      );
      return { isValid };
    } catch (error) {
      console.error("subscription payment verification error:", error);
      throw new Error("Failed to verify subscription payment");
    }
  }

  async getOwnerStatus(id: string): Promise<{
    user: OwnerResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const user = await this.ownerRepository.findUserById(id);

      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        user: mapOwnerToDTO(user),
        status: STATUS_CODES.OK,
        message: "User fetched successfully",
      };
    } catch (error) {
      console.error("Error in fetching user:", error);
      return {
        user: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getPropertyById(
    id: string
  ): Promise<{ property: IProperty | null; status: number; message: string }> {
    try {
      const property = await this.ownerRepository.findPropertyById(id);

      if (!property) {
        return {
          property: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found",
        };
      }

      return {
        property,
        status: STATUS_CODES.OK,
        message: "Property fetched successfully",
      };
    } catch (error) {
      console.error("Error in getPropertyById:", error);
      return {
        property: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async fetchWalletData(id: string): Promise<{
    message: string;
    status: number;
    data: IWalletWithTotals;
  }> {
    try {
      if (!id) {
        return {
          message: "Invalid User ID",
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          data: {
            userId: new mongoose.Types.ObjectId(),
            balance: 0,
            transactionDetails: [],
            totalCredit: 0,
            totalDebit: 0,
          },
        };
      }

      const data = await this.walletRepository.findOne({
        userId: new mongoose.Types.ObjectId(id),
      });

      if (!data) {
        const emptyWallet: IWalletWithTotals = {
          userId: new mongoose.Types.ObjectId(id),
          balance: 0,
          transactionDetails: [],
          totalCredit: 0,
          totalDebit: 0,
        };
        return {
          message: "No transactions found",
          data: emptyWallet,
          status: STATUS_CODES.OK,
        };
      }

      let totalDebit = 0;
      let totalCredit = 0;

      data.transactionDetails.forEach((txn: any) => {
        if (txn.paymentType === "debit") {
          totalDebit += txn.amount;
        } else if (txn.paymentType === "credit") {
          totalCredit += txn.amount;
        }
      });

      const responseData: IWalletWithTotals = {
        ...data.toObject(),
        totalDebit,
        totalCredit,
      };

      return {
        message: "Wallet data fetched successfully",
        status: STATUS_CODES.OK,
        data: responseData,
      };
    } catch (error) {
      console.error("Error fetching wallet data:", error);
      return {
        message: "Internal Server Error",
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        data: {
          userId: new mongoose.Types.ObjectId(id),
          balance: 0,
          transactionDetails: [],
          totalCredit: 0,
          totalDebit: 0,
        },
      };
    }
  }
}

export default OwnerService;
