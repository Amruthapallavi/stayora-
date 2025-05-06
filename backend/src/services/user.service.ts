import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import userRepository from "../repositories/user.repository";
import { IUser } from "../models/user.model";
import {
  IUserService,
  IWalletWithTotals,
  SignupData,
} from "./interfaces/IUserService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail, isValidOTP, isValidPhone } from "../utils/validators";
import ownerRepository from "../repositories/owner.repository";
import Cart, { IAddOn, ICart } from "../models/cart.model";
import mongoose, { ObjectId, Types } from "mongoose";
import Service from "../models/service.model";
import bookingRepository from "../repositories/booking.repository";
import { ChildProcess } from "child_process";
import propertyRepository from "../repositories/property.repository";
import { IBooking } from "../models/booking.model";
import { IWallet } from "../models/wallet.model";
import walletRepository from "../repositories/wallet.repository";
import { Response } from "express";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { INotificationService } from "./interfaces/INotificationServices";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private userRepository: IUserRepository,
    @inject(TYPES.PropertyRepository)
    private propertyRepository: IPropertyRepository,
    @inject(TYPES.OwnerRepository)
    private ownerRepository: IOwnerRepository,
    @inject(TYPES.BookingRepository)
    private bookingRepository: IBookingRepository,
    @inject(TYPES.WalletRepository)
    private walletRepository: IWalletRepository,
    @inject(TYPES.NotificationService)
    private notificationService: INotificationService
  ) {}

  private sanitizeUser(user: IUser) {
    const { password, otp, __v, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  async registerUser(
    userData: SignupData
  ): Promise<{ message: string; status: number }> {
    const { name, email, password, confirmPassword, phone } = userData;
    if (!name || !email || !password || !confirmPassword || !phone) {
      throw new Error(MESSAGES.ERROR.INVALID_INPUT);
    }
    if (!isValidEmail(email)) {
      throw new Error("Invalid email format");
    }
    if (!isValidPhone(phone)) {
      throw new Error("Invalid Phone number");
    }
    if (password !== confirmPassword) {
      throw new Error(MESSAGES.ERROR.PASSWORD_MISMATCH);
    }
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp, "and email", email);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this.userRepository.create({
      ...userData,
      password: hashedPassword,
      isVerified: false,
      otp,
      otpExpires,
    });
    return { message: MESSAGES.SUCCESS.SIGNUP, status: STATUS_CODES.CREATED };
  }

  async verifyOTP(
    email: string,
    otp: string
  ): Promise<{ message: string; status: number }> {
    console.log(email, "email");
    const user = await this.userRepository.findByEmail(email);
    console.log(user, "user");
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (!isValidOTP(otp)) {
      throw new Error("Invalid otp");
    }
    console.log("user otp", user.otp, "and ", otp);
    console.log("Stored OTP Expires:", user.otpExpires?.getTime());
    console.log("Current Time:", Date.now());

    if (user.otp !== otp || (user.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;

    await this.userRepository.update(user._id.toString(), {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }

    // if (user.isVerified) {
    //   throw new Error(MESSAGES.ERROR.ALREADY_VERIFIED);
    // }

    const newOtp = OTPService.generateOTP();

    await OTPService.sendOTP(email, newOtp);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    console.log(newOtp);

    user.otp = newOtp;
    user.otpExpires = otpExpires;
    await this.userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }

  async loginUser(
    email: string,
    password: string,
    res: Response
  ): Promise<{
    user: IUser;
    token: string;
    message: string;
    refreshToken: string;
    status: number;
  }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }

    if (!user.isVerified) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    if (user.status === "Blocked") {
      throw new Error(MESSAGES.ERROR.BLOCKED_USER);
    }
    if (!user.password) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const accessToken = process.env.JWT_SECRET;
    const refreshTokenSecret = process.env.JWT_REFRESH_SECRET;

    if (!accessToken || !refreshTokenSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }
    const token = jwt.sign({ userId: user._id, type: "user" }, accessToken, {
      expiresIn: "1h",
    });
    const refreshToken = jwt.sign(
      { userId: user._id, type: "user" },
      refreshTokenSecret,
      { expiresIn: "7d" }
    );
    console.log(token, "jwt token");
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    return {
      user: this.sanitizeUser(user),
      token,
      refreshToken: refreshToken,

      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async resetPassword(
    email: string,
    newPassword: string
  ): Promise<{ message: string; status: number }> {
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;

    await this.userRepository.update(user._id.toString(), user);
    return {
      message: MESSAGES.SUCCESS.PASSWORD_RESET,
      status: STATUS_CODES.OK,
    };
  }

  async processGoogleAuth(
    profile: any
  ): Promise<{ user: IUser; token: string; message: string; status: number }> {
    const email = profile.email;
    let user = await this.userRepository.findByEmail(email);
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await this.userRepository.update(user._id.toString(), user);
      }
    } else {
      user = await this.userRepository.create({
        googleId: profile.id,
        name: profile.displayName,
        email,
        password: "",
        isVerified: true,
      });
    }
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error(MESSAGES.ERROR.JWT_SECRET_MISSING);
    }

    const token = jwt.sign(
      {
        userId: user._id,
        type: "user",
        name: user.name,
        email: user.email,
        phone: user.phone,
        // profileImage: user.profileImage,
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      user: this.sanitizeUser(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async getAllProperties(): Promise<{
    properties: any[];
    status: number;
    message: string;
  }> {
    try {
      const properties = await this.userRepository.findProperties();

      return {
        properties: properties || [],
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        properties: [],
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async saveBookingDates(
    moveInDate: Date,
    rentalPeriod: number,
    endDate: Date,
    userId: string,
    propertyId: string
  ): Promise<{ status: number; message: string }> {
    try {
      if (!userId || !moveInDate || !rentalPeriod || !endDate || !propertyId) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Missing required booking data",
        };
      }

      const existingCart = await this.userRepository.findCart(userId);
      if (!existingCart) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart not found",
        };
      }
      console.log(existingCart, "cart");
      const toLocalDateString = (date: Date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
      };

      const moveIn = new Date(toLocalDateString(moveInDate));
      const end = new Date(toLocalDateString(endDate));

      const selectedProperty = existingCart.properties.find(
        (p) => p.propertyId.toString() === propertyId
      );

      if (!selectedProperty) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found in cart",
        };
      }

      selectedProperty.moveInDate = moveIn;
      selectedProperty.rentalPeriod = rentalPeriod;
      selectedProperty.endDate = end;

      const rent = selectedProperty.rentPerMonth || 0;
      const addOnCost = selectedProperty.addOnCost || 0;
      selectedProperty.totalCost = rent * rentalPeriod + addOnCost;

      existingCart.totalCost = existingCart.properties.reduce(
        (sum, p) => sum + (p.totalCost || 0),
        0
      );

      await existingCart.save();

      return {
        status: STATUS_CODES.OK,
        message: "Booking dates updated successfully",
      };
    } catch (error) {
      console.error("Error saving booking dates:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getProfileData(
    id: string
  ): Promise<{ user: any; status: number; message: string }> {
    try {
      const user = await this.userRepository.getUserById(id);

      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        user,
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

  async getPropertyById(
    id: string
  ): Promise<{
    property: any;
    ownerData: any;
    status: number;
    message: string;
  }> {
    try {
      const propertyId = id.toString();

      const property = await this.propertyRepository.findPropertyById(
        propertyId
      );
      console.log(id, "property");
      console.log(property);
      // if (!property || property.status !== "active") {
      //   throw new Error("Property not available");
      // }

      if (!property) {
        return {
          property: null,
          ownerData: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found",
        };
      }

      const ownerId = property.ownerId.toString();
      const owner = await this.userRepository.findOwnerById(ownerId);

      const ownerData = owner
        ? {
            name: owner.name,
            phone: owner.phone,
            email: owner.email,
          }
        : null;
      return {
        property,
        ownerData,
        status: STATUS_CODES.OK,
        message: "Property fetched successfully",
      };
    } catch (error) {
      console.error("Error in getPropertyById:", error);
      return {
        property: null,
        ownerData: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getUserStatus(id: string): Promise<{
    user: any | null;
    status: number;
    message: string;
  }> {
    try {
      const user = await this.userRepository.findUserById(id);

      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }

      return {
        user,
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

  async getCartData(
    propertyId: string,
    userId: string
  ): Promise<{
    cartData: any;
    property: any;
    status: number;
    message: string;
  }> {
    try {
      const property = await this.propertyRepository.findPropertyById(
        propertyId
      );
      console.log(property);
      if (!property) {
        return {
          cartData: null,
          property: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found",
        };
      }

      const propertyData = {
        propertyId: new mongoose.Types.ObjectId(propertyId),
        propertyName: property.title,
        propertyImages: property.images,
        location: [
          {
            latitude: property.mapLocation?.coordinates?.latitude || 0,
            longitude: property.mapLocation?.coordinates?.longitude || 0,
          },
        ],
        address: property.address,
        rentPerMonth: property.rentPerMonth,
        totalCost: property.rentPerMonth,
      };

      console.log(propertyData);
      let cart = await this.userRepository.findCart(userId);

      if (!cart) {
        cart = new Cart({
          userId,
          properties: [propertyData],
          totalCost: property.rentPerMonth,
        });
      } else {
        const alreadyInCart = cart.properties.some(
          (item: any) => item.propertyId.toString() === propertyId
        );
        if (!alreadyInCart) {
          cart.properties.push(propertyData);
          cart.totalCost += property.rentPerMonth;
        }
      }

      await cart.save();

      return {
        cartData: cart,
        property: property,
        status: STATUS_CODES.OK,
        message: "Property added to cart",
      };
    } catch (error) {
      console.error("Error in getCartData:", error);
      return {
        cartData: null,
        property: null,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async getUserBookings(
    userId: string,
    page: number = 1,
    limit: number = 5
  ): Promise<{
    bookings: any[] | null;
    totalPages: number;
    status: number;
    message: string;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [bookings, totalCount] = await Promise.all([
        this.bookingRepository.findBookingsByUserId(userId, skip, limit),
        this.bookingRepository.countUserBookings(userId),
      ]);

      if (!bookings || bookings.length === 0) {
        return {
          bookings: null,
          totalPages: 0,
          status: STATUS_CODES.NOT_FOUND,
          message: "No bookings found for this user",
        };
      }

      const totalPages = Math.ceil(totalCount / limit);

      return {
        bookings,
        totalPages,
        status: STATUS_CODES.OK,
        message: "Bookings fetched successfully",
      };
    } catch (error) {
      console.error("Error in getUserBookings:", error);
      return {
        bookings: null,
        totalPages: 0,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async listServices(): Promise<{
    services: any[];
    status: number;
    message: string;
  }> {
    try {
      const services = await this.userRepository.findActiveServices();
      return {
        services: services,
        status: STATUS_CODES.OK,
        message: "successfully fetched",
      };
    } catch (error) {
      console.error("Error in listServices:", error);
      return {
        services: [],
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async saveAddOnsForProperty(
    userId: string,
    propertyId: string,
    addOnIds: string[]
  ): Promise<{ status: number; message: string }> {
    try {
      if (!userId || !propertyId || !Array.isArray(addOnIds)) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Missing required data for add-ons",
        };
      }

      const cart = await this.userRepository.findCart(userId);
      if (!cart) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart not found",
        };
      }

      const selectedProperty = cart.properties.find(
        (p) => p.propertyId.toString() === propertyId
      );

      if (!selectedProperty) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Property not found in cart",
        };
      }

      const addOnServices = await Service.find({
        _id: { $in: addOnIds },
      });

      const addOnCost = addOnServices.reduce(
        (sum, s) => sum + (s.price || 0),
        0
      );
      const formattedAddOns: IAddOn[] = addOnServices.map((service) => ({
        serviceId: service._id as ObjectId,
        serviceName: service.name,
        serviceCost: service.price,
      }));

      selectedProperty.addOn = formattedAddOns;
      selectedProperty.addOnCost = addOnCost;

      const rent = selectedProperty.rentPerMonth || 0;
      const rentalPeriod = selectedProperty.rentalPeriod || 1;
      selectedProperty.totalCost = rent * rentalPeriod + addOnCost;

      cart.totalCost = cart.properties.reduce(
        (sum, p) => sum + (p.totalCost || 0),
        0
      );

      await cart.save();

      return {
        status: STATUS_CODES.OK,
        message: "Add-on services saved successfully",
      };
    } catch (error) {
      console.error("Error saving add-ons:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: "Failed to save add-on services",
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

      const user = await this.userRepository.findById(id);
      console.log(user, "for updating");
      if (!user) {
        return {
          message: "User not found",
          status: STATUS_CODES.NOT_FOUND,
        };
      }
      console.log(updatedData);
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

  async fetchWalletData(
    id: string
  ): Promise<{
    message: string;
    status: number;
    data: IWalletWithTotals | null;
  }> {
    try {
      if (!id) {
        return {
          message: "Invalid user ID",
          data: null,
          status: STATUS_CODES.BAD_REQUEST,
        };
      }

      // Fetch wallet data for the given user ID
      const data = await this.walletRepository.findOne({
        userId: new mongoose.Types.ObjectId(id),
      });

      if (!data) {
        return {
          message: "No wallet transactions found",
          data: null,
          status: STATUS_CODES.NOT_FOUND,
        };
      }

      let totalDebit = 0;
      let totalCredit = 0;

      data.transactionDetails.forEach((txn) => {
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
        data: null,
      };
    }
  }
  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string
  ): Promise<{ status: number; message: string }> {
    try {
      const user = await this.userRepository.findUserById(userId);
      if (!user) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: MESSAGES.ERROR.USER_NOT_FOUND,
        };
      }
      console.log(userId);
      const isMatch = await bcrypt.compare(oldPassword, user.password || "");
      if (!isMatch) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: MESSAGES.ERROR.INCORRECT_PASSWORD,
        };
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await this.userRepository.updateUserPassword(userId, hashedPassword);

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

  async cancelBooking(
    id: string,
    reason: string
  ): Promise<{ status: number; message: string }> {
    try {
      const booking = await this.bookingRepository.findById(id);
      if (!booking) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: MESSAGES.ERROR.BOOKING_NOT_FOUND,
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Reset the time to midnight

      const moveInDate = new Date(booking.moveInDate);
      moveInDate.setHours(0, 0, 0, 0); // Reset the time to midnight

      const fiveDaysBeforeMoveIn = new Date(moveInDate);
      fiveDaysBeforeMoveIn.setDate(fiveDaysBeforeMoveIn.getDate() - 5);

      if (today > fiveDaysBeforeMoveIn) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: MESSAGES.ERROR.BOOKING_CANCEL_NOT_ALLOWED,
        };
      }

      const refundAmount =
        booking.paymentMethod && booking.paymentMethod !== "COD"
          ? booking.totalCost
          : 0;

      const updateData: Partial<IBooking> = {
        isCancelled: true,
        cancellationReason: reason,
        refundAmount: refundAmount,
        bookingStatus: "cancelled",
        paymentStatus: "refunded",
      };

      console.log(reason);
      console.log("updated data", updateData);

      const response = await this.bookingRepository.updateBookingDetails(
        id,
        updateData
      );
      const propertyId = new mongoose.Types.ObjectId(
        booking.propertyId.toString()
      );
      const property = await this.propertyRepository.updatePropertyById(
        propertyId,
        { status: "active" }
      );

      console.log(response);

      return {
        status: STATUS_CODES.OK,
        message: "Booking cancelled successfully",
      };
    } catch (error) {
      console.error("Error while cancelling booking:", error);
      return {
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        message: MESSAGES.ERROR.SERVER_ERROR,
      };
    }
  }

  async updateBookingAndPropertyStatus(): Promise<void> {
    const today = new Date();
    const bookings = await this.bookingRepository.findBookingsToComplete(today);

    if (Array.isArray(bookings) && bookings.length > 0) {
      for (const booking of bookings) {
        const bookingId = booking._id as string;
        const propertyId = new mongoose.Types.ObjectId(
          booking.propertyId.toString()
        );

        await this.bookingRepository.updateBookingDetails(bookingId, {
          bookingStatus: "completed",
        });

        await this.propertyRepository.updatePropertyById(propertyId, {
          status: "active",
        });
        const user = await this.userRepository.getUserById(
          booking.userId.toString()
        );
        const owner = await this.ownerRepository.findById(
          booking.ownerId.toString()
        );
        const propertyName = booking.propertyName ?? "your property";

        if (user) {
          await this.notificationService.createNotification(
            user._id.toString(),
            "User",
            "booking",
            `Your rental period for the property "${propertyName}" has ended. Thank you for staying with us!`,
            bookingId
          );
        } else {
          console.warn(`User not found for booking ${bookingId}`);
        }

        if (owner) {
          await this.notificationService.createNotification(
            owner._id.toString(),
            "Owner",
            "booking",
            `Your property "${propertyName}" is now available for new bookings.`,
            bookingId
          );
        } else {
          console.warn(`Owner not found for property in booking ${bookingId}`);
        }
        if (user) {
          const otherUsers = await this.userRepository.getAllUsersExcept(
            user._id.toString()
          );
          for (const otherUser of otherUsers) {
            await this.notificationService.createNotification(
              otherUser._id.toString(),
              "User",
              "property",
              `The property "${propertyName}" is now available for booking!`,
              propertyId ? propertyId.toString() : null
            );
          }
        } else {
          console.warn(
            "User data is missing or null when attempting to notify other users."
          );
        }
      }
    } else {
      console.log("No bookings found to complete.");
    }
  }
}
export default UserService;
