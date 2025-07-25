import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import OTPService from "../utils/OTPService";

import { IUser } from "../models/user.model";
import {
  IUserService,
  IWalletWithTotals,
  SignupData,
} from "./interfaces/IUserService";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { isValidEmail, isValidOTP, isValidPhone } from "../utils/validators";
import Cart, { IAddOn, ICart } from "../models/cart.model";
import mongoose, { ObjectId, Types } from "mongoose";
import Service from "../models/service.model";
import { IBooking } from "../models/booking.model";
import { v4 as uuidv4 } from "uuid";
import { Response } from "express";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { INotificationService } from "./interfaces/INotificationServices";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { BookingStatus, PaymentStatus, PropertyStatus } from "../models/status/status";
import { UserResponseDTO } from "../DTO/UserResponseDto";
import { mapUserToDTO } from "../mappers/userMapper";
import { PropertyResponseDTO } from "../DTO/PropertyDTO";
import { mapPropertyToDTO, mapPropertyToDTOs } from "../mappers/propertyMapper";
import { IResponse } from "../DTO/BookingResponseDTO";
import { IProperty } from "../models/property.model";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { mapOwnerToDTO } from "../mappers/ownerMapper";
import { uuid } from "uuidv4";
import { generateTransactionId } from "../config/TransactionId";

@injectable()
export class UserService implements IUserService {
  constructor(
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.PropertyRepository)
    private _propertyRepository: IPropertyRepository,
    @inject(TYPES.OwnerRepository)
    private _ownerRepository: IOwnerRepository,
    @inject(TYPES.BookingRepository)
    private _bookingRepository: IBookingRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService
  ) {}

  private sanitizeUser(user: IUser) {
    const { password, otp, __v, ...sanitizedUser } = user.toObject();
    return sanitizedUser;
  }

  async registerUser(
    userData:SignupData
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
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(MESSAGES.ERROR.EMAIL_EXISTS);
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = OTPService.generateOTP();
    await OTPService.sendOTP(email, otp);

    console.log(otp, "and email", email);
    const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

    await this._userRepository.create({
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
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.USER_NOT_FOUND);
    }
    if (!isValidOTP(otp)) {
      throw new Error("Invalid otp");
    }
    console.log("user otp", user.otp, "and ", otp);
 
    if (user.otp !== otp || (user.otpExpires?.getTime() ?? 0) < Date.now()) {
      throw new Error(MESSAGES.ERROR.OTP_INVALID);
    }
    // user.isVerified = true;
    // user.otp = undefined;
    // user.otpExpires = undefined;

    await this._userRepository.update(user._id.toString(), {
      isVerified: true,
      otp: null,
      otpExpires: null,
    });

    return { message: MESSAGES.SUCCESS.OTP_VERIFIED, status: STATUS_CODES.OK };
  }

  async resendOTP(email: string): Promise<{ message: string; status: number }> {
    const user = await this._userRepository.findByEmail(email);
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
    await this._userRepository.update(user._id.toString(), user);

    return { message: MESSAGES.SUCCESS.OTP_RESENT, status: STATUS_CODES.OK };
  }

  async loginUser(
    email: string,
    password: string,
    res: Response
  ): Promise<{
    user: UserResponseDTO;
    token: string;
    message: string;
    refreshToken: string;
    status: number;
  }> {
    const user = await this._userRepository.findByEmail(email);
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
user: mapUserToDTO(user),
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
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error(MESSAGES.ERROR.INVALID_CREDENTIALS);
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;

    await this._userRepository.update(user._id.toString(), user);
    return {
      message: MESSAGES.SUCCESS.PASSWORD_RESET,
      status: STATUS_CODES.OK,
    };
  }

  async processGoogleAuth(
    profile: any
  ): Promise<{ user: UserResponseDTO; token: string; message: string; status: number }> {
    const email = profile.email;
    let user = await this._userRepository.findByEmail(email);
    if (user) {
      if (!user.googleId) {
        user.googleId = profile.id;
        await this._userRepository.update(user._id.toString(), user);
      }
    } else {
      user = await this._userRepository.create({
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
      },
      jwtSecret,
      { expiresIn: "1h" }
    );

    return {
      user: mapUserToDTO(user),
      token,
      message: MESSAGES.SUCCESS.LOGIN,
      status: STATUS_CODES.OK,
    };
  }

  async getAllProperties(page:number,limit:number): Promise<{
    properties: IProperty[];
    currentPage:number;
    totalPages:number;
    status: number;
    message: string;
  }> {
    try {
      const {properties,totalPages,totalProperties} = await this._userRepository.findProperties(page,limit);
      return {
        properties:properties|| [],
        totalPages,
        currentPage:page,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        properties: [],
        totalPages:1,
        currentPage:1,
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
  ): Promise<IResponse> {
    try {
      if (!userId || !moveInDate || !rentalPeriod || !endDate || !propertyId) {
        return {
          status: STATUS_CODES.BAD_REQUEST,
          message: "Missing required booking data",
        };
      }

      const existingCart = await this._userRepository.findCart(userId);
      if (!existingCart) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: "Cart not found",
        };
      }
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
  ): Promise<{ user: UserResponseDTO |null; status: number; message: string }> {
    try {
      const user = await this._userRepository.getUserById(id);
      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }
         const userData=mapUserToDTO(user);


      return {
        user:userData,
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
    ownerData: OwnerResponseDTO |null;
    status: number;
    message: string;
  }> {
    try {
      const propertyId = id.toString();

      const property = await this._propertyRepository.findPropertyById(
        propertyId
      );
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
      
      const owner = await this._ownerRepository.findById(ownerId);
      const ownerData = owner
        ? mapOwnerToDTO(owner)
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
    user: UserResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const user = await this._userRepository.findUserById(id);

      if (!user) {
        return {
          user: null,
          status: STATUS_CODES.NOT_FOUND,
          message: "User not found",
        };
      }
  const userData=mapUserToDTO(user);
      return {
        user:userData,
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
      const property = await this._propertyRepository.findPropertyById(
        propertyId
      );
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

      let cart = await this._userRepository.findCart(userId);

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
    bookings: IBooking[] | [];
    totalPages: number;
    status: number;
    message: string;
  }> {
    try {
      const skip = (page - 1) * limit;

      const [bookings, totalCount] = await Promise.all([
        this._bookingRepository.findBookingsByUserId(userId, skip, limit),
        this._bookingRepository.countUserBookings(userId),
      ]);

      if (!bookings || bookings.length === 0) {
        return {
          bookings: [],
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
        bookings: [],
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
      const services = await this._userRepository.findActiveServices();
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

      const cart = await this._userRepository.findCart(userId);
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

      const user = await this._userRepository.findById(id);
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

      const data = await this._walletRepository.fetchWalletData(id)
       if (!data) {
              const emptyWallet: IWalletWithTotals = {
                userId: new mongoose.Types.ObjectId(id),
                balance: 0,
                transactionDetails: [],
                totalCredit: 0,
                totalDebit: 0,
              };
              return {
                message: "No  transactions found",
                data: emptyWallet,
                status: STATUS_CODES.OK,
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
      const user = await this._userRepository.findUserById(userId);
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
      await this._userRepository.updateUserPassword(userId, hashedPassword);

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
      const booking = await this._bookingRepository.findById(id);
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
        bookingStatus: BookingStatus.Cancelled,
        paymentStatus: PaymentStatus.Refunded,
      };

      const response = await this._bookingRepository.updateBookingDetails(
        id,
        updateData
      );
      const propertyId = new mongoose.Types.ObjectId(
        booking.propertyId.toString()
      );
      const property = await this._propertyRepository.updatePropertyById(
        propertyId,
        { status: PropertyStatus.Active }
      );
        const transactionId = generateTransactionId();
        const message = `Refund Completed - Property Name ${property?.title} (Cancelled)`
        await this._walletRepository.updateUserWalletTransaction(
          booking?.userId?.toString() ?? '',
          booking.bookingId,
          message,
          booking?.totalCost ?? 0,
          'credit',
          transactionId
        );
        await this._walletRepository.updateUserWalletTransaction(
          booking?.ownerId?.toString() ?? '',
          booking.bookingId,
          message,
          booking?.totalCost ?? 0,
          'debit',
          transactionId,
        );
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
    const bookings = await this._bookingRepository.findBookingsToComplete(today);

    if (Array.isArray(bookings) && bookings.length > 0) {
      for (const booking of bookings) {
        const bookingId = booking._id as string;
        const propertyId = new mongoose.Types.ObjectId(
          booking.propertyId.toString()
        );

        await this._bookingRepository.updateBookingDetails(bookingId, {
          bookingStatus: BookingStatus.Completed,
        });

        await this._propertyRepository.updatePropertyById(propertyId, {
          status: PropertyStatus.Active,
        });
        const user = await this._userRepository.getUserById(
          booking.userId.toString()
        );
        const owner = await this._ownerRepository.findById(
          booking.ownerId.toString()
        );
        const propertyName = booking.propertyName ?? "your property";

        if (user) {
          await this._notificationService.createNotification(
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
          await this._notificationService.createNotification(
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
          const otherUsers = await this._userRepository.getAllUsersExcept(
            user._id.toString()
          );
          for (const otherUser of otherUsers) {
            await this._notificationService.createNotification(
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
