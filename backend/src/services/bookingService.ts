import Razorpay from "razorpay";
import crypto from "crypto";
import { IBookingService } from "./interfaces/IBookingService";
import RazorpayVerifyPayload from "./interfaces/IBookingService";
import dotenv from "dotenv";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import { IBooking } from "../models/booking.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { inject, injectable } from "inversify";
import TYPES from "../config/DI/types";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { INotificationService } from "./interfaces/INotificationServices";
import { IProperty } from "../models/property.model";
import mongoose from "mongoose";
import { IPropertyRepository } from "../repositories/interfaces/IPropertyRepository";
import {
  BookingStatus,
  PaymentStatus,
  PropertyStatus,
} from "../models/status/status";
import {
  CreateBookingOrderResponseDTO,
  IResponse,
  IReviewUserResponse,
  VerifyBookingPaymentResponseDTO,
} from "../DTO/BookingResponseDTO";
import { UserResponseDTO } from "../DTO/UserResponseDto";
import { mapUsersToDTOs, mapUserToDTO } from "../mappers/userMapper";
import { OwnerResponseDTO } from "../DTO/OwnerResponseDTO";
import { mapOwnerToDTO } from "../mappers/ownerMapper";
import { generateTransactionId, generateWalletPaymentId } from "../config/TransactionId";
import { IReviewRepository } from "../repositories/interfaces/IReviewRepository";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository)
    private _bookingRepository: IBookingRepository,
    @inject(TYPES.UserRepository)
    private _userRepository: IUserRepository,
    @inject(TYPES.OwnerRepository)
    private _ownerRepository: IOwnerRepository,
    @inject(TYPES.WalletRepository)
    private _walletRepository: IWalletRepository,
    @inject(TYPES.NotificationService)
    private _notificationService: INotificationService,
    @inject(TYPES.PropertyRepository)
    private _propertyRepository: IPropertyRepository,
     @inject(TYPES.ReviewRepository)
    private _reviewRepository: IReviewRepository
  ) {}
  async createBookingOrder(
    amount: number,
    propertyId: string,
    userId: string
  ): Promise<CreateBookingOrderResponseDTO> {
    try {
      const options = {
        amount: amount,
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      const cartProperty = await this._bookingRepository.getCartProperty(
        userId,
        propertyId
      );

      if (!cartProperty || !cartProperty.propertyId) {
        throw new Error("Property not found in cart");
      }

      const property = (await this._bookingRepository.findPropertyById(
        cartProperty.propertyId.toString()
      )) as IProperty;

      if (!property) {
        throw new Error("Property not found");
      }
    if(property.status === PropertyStatus.Booked){
      throw new Error("Property already Booked...Please choose another one.")
    }
      const ownerId = property.ownerId;
      let booking: IBooking | null = null;

      if (cartProperty) {
        booking = await this.saveBookingFromCart(
          userId,
          cartProperty,
          "razorpay",
          ownerId.toString()
        );
        await this._bookingRepository.removeCartProperty(userId, propertyId);
      } else {
        console.error("No matching cart property found.");
      }

      return {
        id: order.id,
        amount: Number(order.amount),
        currency: order.currency,
        bookingId: booking?._id?.toString() || "",
      };
    } catch (error) {
      console.error("Razorpay order creation failed:", error);
      throw new Error("Failed to create Razorpay order");
    }
  }

  async verifyBookingPayment(
    payload: RazorpayVerifyPayload
  ): Promise<VerifyBookingPaymentResponseDTO> {
    try {
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        bookingId,
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

      let booking: IBooking | null = null;

      if (isValid) {
        await this._bookingRepository.updateBookingDetails(bookingId, {
          paymentStatus: PaymentStatus.Completed,
          bookingStatus: BookingStatus.Confirmed,
          paymentId: razorpay_payment_id,
        });

        booking = await this._bookingRepository.findBookingById(bookingId);
        if (booking && booking.propertyId) {
          await this._bookingRepository.updatePropertyStatus(
            booking.propertyId.toString(),
            "booked"
          );
        } else {
          console.warn("Property ID not found for booking");
        }
        const user = booking?.userId
          ? await this._userRepository.getUserById(booking.userId.toString())
          : null;

        const userName = user?.name ?? "A user";
        const propertyName = booking?.propertyName ?? "a property";

        const notificationMessage = `${userName} has successfully booked the property "${propertyName}".`;

        if (!booking?.ownerId) {
          throw new Error("ownerId is missing in the booking");
        }

        await this._notificationService.createNotification(
          booking.ownerId.toString(),
          "Owner",
          "booking",
          notificationMessage,
          booking._id ? booking._id.toString() : null
        );

        const userNotificationMessage = `Your booking for the property "${propertyName}" was successful.`;

        await this._notificationService.createNotification(
          booking.userId.toString(),
          "User",
          "booking",
          userNotificationMessage,
          booking._id?.toString() ?? null
        );

        const transactionId = generateTransactionId();
        const message = `Booking Completed - Property Name: ${propertyName}`;

        
        await this._walletRepository.updateUserWalletTransaction(
          booking?.ownerId?.toString() ?? "",
          booking.bookingId,
          message,
          booking?.totalCost ?? 0,
          "credit",
          transactionId
        );
      }

      return {
        isValid,
        booking: booking ?? null,
      };
    } catch (error) {
      console.error("Razorpay payment verification error:", error);
      throw new Error("Failed to verify Razorpay payment");
    }
  }
 
  async bookingFromWallet(userId: string, propertyId: string): Promise<{isValid:boolean,booking:IBooking | null }> {
    try {
       const cartProperty = await this._bookingRepository.getCartProperty(
        userId,
        propertyId
      );
      
      if (!cartProperty || !cartProperty.propertyId) {
        throw new Error("Property not found in cart");
      }
            const walletData = await this._walletRepository.fetchWalletData(userId)
            if (walletData?.balance === undefined) {
  throw new Error("Wallet balance not available.");
}

      if(cartProperty.totalCost > walletData?.balance){
           throw new Error("Insufficient balance. Please choose another payment method to continue")
      }
      const property = (await this._bookingRepository.findPropertyById(
        cartProperty.propertyId.toString()
      )) as IProperty;

      if (!property) {
        throw new Error("Property not found");
      }
   if(property.status === PropertyStatus.Booked){
      throw new Error("Property already Booked...Please choose another one.")
    }
      const ownerId = property.ownerId;
      let booking: IBooking | null = null;

      if (cartProperty) {
        booking = await this.saveBookingFromCart(
          userId,
          cartProperty,
          "wallet",
          ownerId.toString()
        );
        await this._bookingRepository.removeCartProperty(userId, propertyId);
        const bookingId = booking._id as string;
        const paymentId=generateWalletPaymentId();
       await this._bookingRepository.updateBookingDetails(bookingId, {
          paymentStatus: PaymentStatus.Completed,
          bookingStatus: BookingStatus.Confirmed,
          paymentId:paymentId ,
        });

        if (booking && booking.propertyId) {
          await this._bookingRepository.updatePropertyStatus(
            booking.propertyId.toString(),
            "booked"
          );
        } else {
          console.warn("Property ID not found for booking");
        }
        const user = booking?.userId
          ? await this._userRepository.getUserById(booking.userId.toString())
          : null;

        const userName = user?.name ?? "A user";
        const propertyName = booking?.propertyName ?? "a property";

        const notificationMessage = `${userName} has successfully booked the property "${propertyName}".`;

        if (!booking?.ownerId) {
          throw new Error("ownerId is missing in the booking");
        }

        await this._notificationService.createNotification(
          booking.ownerId.toString(),
          "Owner",
          "booking",
          notificationMessage,
          booking._id ? booking._id.toString() : null
        );

        const userNotificationMessage = `Your booking for the property "${propertyName}" was successful.`;

        await this._notificationService.createNotification(
          booking.userId.toString(),
          "User",
          "booking",
          userNotificationMessage,
          booking._id?.toString() ?? null
        );

        const transactionId = generateTransactionId();
        const message = `Booking Completed - Property Name: ${propertyName}`;

        await this._walletRepository.updateUserWalletTransaction(
          booking?.userId?.toString() ?? "",
          booking.bookingId,
          message,
          booking?.totalCost ?? 0,
          "debit",
          transactionId
        );
        await this._walletRepository.updateUserWalletTransaction(
          booking?.ownerId?.toString() ?? "",
          booking.bookingId,
          message,
          booking?.totalCost ?? 0,
          "credit",
          transactionId
        );
      
      } else {
        console.log("No matching cart property found.");
      }
  return {
    isValid:true,
    booking:booking,
  }
    } catch (error) {
      console.error("booking from wallet failed:", error);
      throw new Error("Failed to book property from wallet");
    }
  }
  async cancelBooking(id: string, reason: string): Promise<IResponse> {
    try {
      const booking = await this._bookingRepository.findById(id);
      if (!booking) {
        return {
          status: STATUS_CODES.NOT_FOUND,
          message: MESSAGES.ERROR.BOOKING_NOT_FOUND,
        };
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const moveInDate = new Date(booking.moveInDate);
      moveInDate.setHours(0, 0, 0, 0);

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

      const user = await this._userRepository.findById(
        booking.userId.toString()
      );
      const property = await this._propertyRepository.updatePropertyById(
        new mongoose.Types.ObjectId(booking.propertyId.toString()),
        { status: PropertyStatus.Active }
      );

      const propertyName = property?.title || "the property";
      const ownerName = "Owner";

      if (user) {
        await this._notificationService.createNotification(
          user._id.toString(),
          "User",
          "booking",
          `Your booking for "${propertyName}" was cancelled by ${ownerName}. Reason: ${reason}`,
          id
        );
      } else {
        console.warn(`User not found for booking ${id}`);
      }

      const allUsers = await this._userRepository.find({ status: "Active" });
      for (const u of allUsers) {
        await this._notificationService.createNotification(
          u._id.toString(),
          "User",
          "property",
          `The property "${propertyName}" is now available for booking.`,
          booking.propertyId.toString()
        );
      }

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

  async listBookingsByOwner(
    ownerId: string,
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    status: number;
    message: string;
    totalPages: number;
    currentPage: number;
  }> {
    try {
      const { bookings, totalPages } =
        await this._bookingRepository.findOwnerBookings(ownerId, page, limit);

      return {
        bookings,
        currentPage: page,
        totalPages,
        status: STATUS_CODES.OK,
        message: "successfully fetched",
      };
    } catch (error) {
      console.error("Error in listServices:", error);
      return {
        bookings: [],
        currentPage: page,
        totalPages: page,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  async getUserReview(
  bookingId: string,
  userId: string
): Promise<{ review: IReviewUserResponse | null; status: number; message: string }> {
  try {
    const review = await this._reviewRepository.findReviewByUser(bookingId,userId);

    if (!review) {
      return {
        review: null,
        message: "No review found for this booking.",
        status:STATUS_CODES.OK,
      };
    }

    return {
      review,
      message: "Review fetched successfully.",
      status: 200,
    };
  } catch (error) {
    console.error("Error while fetching user review:", error);
    return {
      review: null,
      message: "Internal server error.",
      status: 500,
    };
  }
}

 
  async bookingDetails(id: string): Promise<{
    bookingData: IBooking | null;
    userData: UserResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const bookingData = await this._bookingRepository.findBookingData(id);
      let userData: UserResponseDTO | null = null;

      if (bookingData?.userId) {
        const user = await this._userRepository.findById(
          bookingData.userId.toString()
        );
        if (user) {
          userData = mapUserToDTO(user);
        }
      }
      return {
        bookingData,
        userData,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in bookingDetails:", error);
      return {
        bookingData: null,
        userData: null,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async userBookingDetails(id: string): Promise<{
    bookingData: IBooking | null;
    ownerData: OwnerResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const bookingData = await this._bookingRepository.findUserBookingData(id);

      let ownerData: OwnerResponseDTO | null = null;

      if (bookingData?.ownerId) {
        const owner = await this._ownerRepository.findById(
          bookingData.ownerId.toString()
        );
        if (owner) {
          ownerData = mapOwnerToDTO(owner);
        }
      }
      return {
        bookingData,
        ownerData,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in bookingDetails:", error);
      return {
        bookingData: null,
        ownerData: null,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }
  async listAllBookings(
    page: number = 1,
    limit: number = 5
  ): Promise<{
    bookings: IBooking[];
    status: number;
    message: string;
    totalPages: number;
  }> {
    try {
      const skip = (page - 1) * limit;

      const bookings = await this._bookingRepository.findAllBookings(
        skip,
        limit
      );
      const totalBookings = await this._bookingRepository.countAllBookings();
      const totalPages = Math.ceil(totalBookings / limit);
      return {
        bookings: bookings || [],
        status: STATUS_CODES.OK,
        totalPages,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in property listing:", error);
      return {
        bookings: [],
        totalPages: 0,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  async AllbookingDetails(id: string): Promise<{
    bookingData: IBooking | null;
    ownerData: OwnerResponseDTO | null;
    userData: UserResponseDTO | null;
    status: number;
    message: string;
  }> {
    try {
      const bookingData = await this._bookingRepository.findBookingData(id);
      let userData: UserResponseDTO | null = null;
      let ownerData: OwnerResponseDTO | null = null;
      if (bookingData?.userId) {
        const user = await this._userRepository.findById(
          bookingData.userId.toString()
        );
        if (user) {
          userData = mapUserToDTO(user);
        }
      }
      if (bookingData?.ownerId) {
        const owner = await this._ownerRepository.findById(
          bookingData.ownerId.toString()
        );
        if (owner) {
          ownerData = mapOwnerToDTO(owner);
        }
      }
      return {
        bookingData,
        userData,
        ownerData,
        status: STATUS_CODES.OK,
        message: "Successfully fetched",
      };
    } catch (error) {
      console.error("Error in bookingDetails:", error);
      return {
        bookingData: null,
        userData: null,
        ownerData: null,
        message: MESSAGES.ERROR.SERVER_ERROR,
        status: STATUS_CODES.INTERNAL_SERVER_ERROR,
      };
    }
  }

  private async saveBookingFromCart(
    userId: string,
    cartItem: any,
    paymentMethod: string,
    ownerId: string
  ): Promise<IBooking> {
    const bookingData = {
      userId,
      ownerId,
      propertyId: cartItem.propertyId,
      propertyName: cartItem.propertyName,
      propertyImages: cartItem.propertyImages,
      moveInDate: cartItem.moveInDate,
      rentalPeriod: cartItem.rentalPeriod,
      endDate: cartItem.endDate,
      rentPerMonth: cartItem.rentPerMonth,
      addOn: cartItem.addOn,
      addOnCost: cartItem.addOnCost,
      totalCost: cartItem.totalCost,
      paymentMethod,
      paymentStatus: PaymentStatus.Pending,
      bookingStatus: BookingStatus.Pending,
      bookingId: generateBookingId(),
    };

    return await this._bookingRepository.saveBooking(bookingData);
  }
}

export const generateBookingId = (): string => {
  const datePart = moment().format("YYYYMMDD");
  const uniquePart = uuidv4().split("-")[0].toUpperCase();
  return `BOOK-${datePart}-${uniquePart}`;
};

export default BookingService;
