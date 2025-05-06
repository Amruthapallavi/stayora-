import Razorpay from "razorpay";
import crypto from "crypto";
import { IBookingService, } from "./interfaces/IBookingService";
import RazorpayVerifyPayload from "./interfaces/IBookingService";
import dotenv from "dotenv";
import userRepository from "../repositories/user.repository";
import bookingRepository from "../repositories/booking.repository";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Booking, { IBooking } from "../models/booking.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";
import ownerRepository from "../repositories/owner.repository";
import { IOwner } from "../models/owner.model";
import { IUser } from "../models/user.model";
import walletRepository from "../repositories/wallet.repository";
import notificationService from "./notification.service";
import { IBookingRepository } from "../repositories/interfaces/IBookingRepository";
import { inject, injectable } from "inversify";
import  TYPES  from "../config/DI/types";
import { IUserRepository } from "../repositories/interfaces/IUserRepository";
import { IOwnerRepository } from "../repositories/interfaces/IOwnerRepository";
import { IWalletRepository } from "../repositories/interfaces/IWalletRepository";
import { INotificationService } from "./interfaces/INotificationServices";
import { IProperty } from "../models/property.model";

dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

@injectable()
export class BookingService implements IBookingService {
  constructor(
    @inject(TYPES.BookingRepository)
      private bookingRepository: IBookingRepository,
      @inject(TYPES.UserRepository)
      private userRepository: IUserRepository,
      @inject(TYPES.OwnerRepository)
      private ownerRepository: IOwnerRepository,
      @inject(TYPES.WalletRepository)
      private walletRepository: IWalletRepository,
      @inject(TYPES.NotificationService)
      private notificationService: INotificationService


    
  ){}
  async createBookingOrder(amount: number,productId:string,userId:string): Promise<{
    id: string;
    amount: number;
    currency: string;
    bookingId:string;
  }> {
    try {
      const options = {
        amount: amount , 
        currency: "INR",
        receipt: `receipt_order_${Date.now()}`,
      };
      const order = await razorpay.orders.create(options);
      const cartProperty = await this.bookingRepository.getCartProperty(userId, productId);
      
if (!cartProperty || !cartProperty.propertyId) {
  throw new Error("Property not found in cart");
}

const property = await this.bookingRepository.findPropertyById(cartProperty.propertyId.toString()) as IProperty;

if (!property ) {
  throw new Error("Property not found");
}

const ownerId = property.ownerId;
      let booking: IBooking | null = null;

      if (cartProperty) {
        booking = await this.saveBookingFromCart(userId, cartProperty, "razorpay", ownerId.toString());
        console.log("Booking saved:", booking);
        await this.bookingRepository.removeCartProperty(userId, productId);

      } else {
        console.log("No matching cart property found.");
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
  
  async verifyBookingPayment(payload: RazorpayVerifyPayload): Promise<{
    isValid: boolean;
    booking: IBooking | null;
  }> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = payload;
  
      const keySecret = process.env.RAZORPAY_KEY_SECRET;
      if (!keySecret) {
        throw new Error("RAZORPAY_KEY_SECRET is not defined in environment variables");
      }
  
      const generatedSignature = crypto
        .createHmac("sha256", keySecret)
        .update(`${razorpay_order_id}|${razorpay_payment_id}`)
        .digest("hex");
  
      const isValid = generatedSignature === razorpay_signature;
      console.log(isValid);
  
      let booking: IBooking | null = null;
  
      if (isValid) {
        await this.bookingRepository.updateBookingDetails(bookingId, {
          paymentStatus: "completed",
          bookingStatus: "confirmed",
          paymentId: razorpay_payment_id,
        });
  
        booking = await this.bookingRepository.findBookingById(bookingId);
        if (booking && booking.propertyId) {
          await this.bookingRepository.updatePropertyStatus(
            booking.propertyId.toString(),
            "booked"
          );
        } else {
          console.warn("Property ID not found for booking");
        }
        const user = booking?.userId
  ? await this.userRepository.getUserById(booking.userId.toString())
  : null;

  const userName = user?.name ?? "A user";
  const propertyName = booking?.propertyName ?? "a property";
        
        const notificationMessage = `${userName} has successfully booked the property "${propertyName}".`;
        
          if (!booking?.ownerId) {
            throw new Error("ownerId is missing in the booking");
          }
          
          await this.notificationService.createNotification(
            booking.ownerId.toString(),
            "Owner",
            "booking",
            notificationMessage,
            booking._id ? booking._id.toString() : null, 

          );
          
          const userNotificationMessage = `Your booking for the property "${propertyName}" was successful.`;

          await this.notificationService.createNotification(
            booking.userId.toString(),
            "User",
            "booking",
            userNotificationMessage,
            booking._id?.toString() ?? null
          );
        
        await this.walletRepository.updateUserWalletTransaction(
          booking?.userId?.toString() ?? '',
          bookingId,
          booking?.totalCost ?? 0,
          'debit'
        );
        await this.walletRepository.updateUserWalletTransaction(
          booking?.ownerId?.toString() ?? '',
          bookingId,
          booking?.totalCost ?? 0,
          'credit'
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

  
    async listBookingsByOwner(id:string): Promise<{ bookings: IBooking[], status: number; message: string }> {
      try {
        const bookings = await this.bookingRepository.findOwnerBookings(id);
  
      return {
        bookings,
        status: STATUS_CODES.OK,
        message:"successfully fetched"
      };
      } catch (error) {
        console.error("Error in listServices:", error);
        return { 
          bookings:[], 
          message: MESSAGES.ERROR.SERVER_ERROR, 
          status: STATUS_CODES.INTERNAL_SERVER_ERROR 
      }
    }
    }
    
    async bookingDetails(id: string): Promise<{
      bookingData: IBooking | null;
      userData:IUser | null;
      status: number;
      message: string;
    }> {
      try {
        const bookingData = await this.bookingRepository.findBookingData(id);
        let userData: IUser | null = null;
    
        if (bookingData?.userId) {
          userData = await this.userRepository.findById(bookingData.userId.toString());
          console.log('Owner:', userData);
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
          userData:null,
          message: MESSAGES.ERROR.SERVER_ERROR,
          status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        };
      }
    }
    async userBookingDetails(id: string): Promise<{
      bookingData: IBooking | null;
      ownerData: IOwner | null;
      status: number;
      message: string;
    }> {
      try {
        const bookingData = await this.bookingRepository.findUserBookingData(id);
    
        let ownerData: IOwner | null = null;
    
        if (bookingData?.ownerId) {
          ownerData = await this.ownerRepository.findById(bookingData.ownerId.toString());
          console.log('Owner:', ownerData);
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
     async listAllBookings(  page: number = 1,
        limit: number = 5): Promise<{ bookings: IBooking[]; status: number; message: string;    totalPages: number;
        }> {
        try {
          const skip = (page - 1) * limit;
    
          const bookings = await this.bookingRepository.findAllBookings(skip,limit);
          const totalBookings = await this.bookingRepository.countAllBookings();
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
            totalPages:0,
            message: MESSAGES.ERROR.SERVER_ERROR,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          };
        }
      }
        
      async AllbookingDetails(id: string): Promise<{
        bookingData: IBooking | null;
        ownerData:IOwner |null;
        userData:IUser | null;
        status: number;
        message: string;
      }> {
        try {
          const bookingData = await this.bookingRepository.findBookingData(id);
          let userData: IUser | null = null;
          let ownerData:IOwner |null=null;
          if (bookingData?.userId) {
            userData = await this.userRepository.findById(bookingData.userId.toString());
            console.log('user:', userData);
          }
          console.log(bookingData?.ownerId,"ownerId")
          if (bookingData?.ownerId) {
            ownerData = await this.ownerRepository.findById(bookingData.ownerId.toString());
            console.log('Owner:', ownerData);
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
            userData:null,
            ownerData:null,
            message: MESSAGES.ERROR.SERVER_ERROR,
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
          };
        }
      }

      private async saveBookingFromCart(userId: string, cartItem: any, paymentMethod: string, ownerId: string): Promise<IBooking> {
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
          paymentStatus: "pending",
          bookingStatus: "pending",
          bookingId: generateBookingId(),
        };
    
        return await this.bookingRepository.saveBooking(bookingData);
      }
    
  

  
};


// const saveBookingFromCart = async (userId: string, cartItem: any, paymentMethod: string,ownerId:string) => {
//   const bookingData = {
//     userId,
//     ownerId,
//     propertyId: cartItem.propertyId,
//     propertyName: cartItem.propertyName,
//     propertyImages: cartItem.propertyImages,
//     moveInDate: cartItem.moveInDate,
//     rentalPeriod: cartItem.rentalPeriod,
//     endDate: cartItem.endDate,
//     rentPerMonth: cartItem.rentPerMonth,
//     addOn: cartItem.addOn,
//     addOnCost: cartItem.addOnCost,
//     totalCost: cartItem.totalCost,
//     paymentMethod: paymentMethod, 
//     paymentStatus: "pending",     
//     bookingStatus: "pending",     
//     bookingId:generateBookingId(),
//   };

//   const savedBooking = await bookingRepository.saveBooking(bookingData);
//   return savedBooking;
// };

export const generateBookingId = (): string => {
  const datePart = moment().format("YYYYMMDD");
  const uniquePart = uuidv4().split("-")[0].toUpperCase(); 
  return `BOOK-${datePart}-${uniquePart}`;
};


export default  BookingService;