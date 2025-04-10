import Razorpay from "razorpay";
import crypto from "crypto";
import { RazorpayVerifyPayload } from "./interfaces/IBooking";
import dotenv from "dotenv";
import userRepository from "../repositories/user.repository";
import bookingRepository from "../repositories/booking.repository";
import moment from "moment";
import { v4 as uuidv4 } from "uuid";
import Booking, { IBooking } from "../models/booking.model";
import { MESSAGES, STATUS_CODES } from "../utils/constants";


dotenv.config();

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default {

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
      const cartProperty = await bookingRepository.getCartProperty(userId, productId);
      
if (!cartProperty || !cartProperty.propertyId) {
  throw new Error("Property not found in cart");
}

const property = await bookingRepository.findPropertyById(cartProperty.propertyId.toString());

if (!property) {
  throw new Error("Property not found");
}

const ownerId = property.ownerId;
console.log(ownerId,"owner");
      let booking: IBooking | null = null;

      if (cartProperty) {
        booking = await saveBookingFromCart(userId, cartProperty, "razorpay",ownerId.toString());
        console.log("Booking saved:", booking);
        await bookingRepository.removeCartProperty(userId, productId);

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
  },
  
  async verifyBookingPayment(payload: RazorpayVerifyPayload): Promise<{
    isValid: boolean;
    booking?: IBooking | null;
  }> {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = payload;
      console.log(bookingId, "fro");
  
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
        await bookingRepository.updateBookingDetails(bookingId, {
          paymentStatus: "completed",
          bookingStatus: "confirmed",
          paymentId: razorpay_payment_id,
        });
  
        booking = await bookingRepository.findBookingById(bookingId);
        if (booking && booking.propertyId) {
          await bookingRepository.updatePropertyStatus(
            booking.propertyId.toString(),
            "booked"
          );
        } else {
          console.warn("Property ID not found for booking");
        }
      }
  
      return {
        isValid,
        booking,
      };
    } catch (error) {
      console.error("Razorpay payment verification error:", error);
      throw new Error("Failed to verify Razorpay payment");
    }
  },
  
    async listBookings(id:string): Promise<{ bookings: IBooking[], status: number; message: string }> {
      try {
        const bookings = await bookingRepository.findOwnerBookings(id);
  
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
  


};


const saveBookingFromCart = async (userId: string, cartItem: any, paymentMethod: string,ownerId:string) => {
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
    paymentMethod: paymentMethod, // e.g., "razorpay", "cash", etc.
    paymentStatus: "pending",     // default
    bookingStatus: "pending",     // default
    bookingId:generateBookingId(),
  };

  const savedBooking = await bookingRepository.saveBooking(bookingData);
  return savedBooking;
};

export const generateBookingId = (): string => {
  const datePart = moment().format("YYYYMMDD");
  const uniquePart = uuidv4().split("-")[0].toUpperCase(); // 8-char part
  return `BOOK-${datePart}-${uniquePart}`;
};