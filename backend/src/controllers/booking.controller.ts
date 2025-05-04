import { Request, Response } from "express";
import bookingService from "../services/bookingService";
import { STATUS_CODES } from "../utils/constants";
import { IBookingController } from "./interfaces/IBookingController";


class bookingController implements IBookingController {

    
    async createBooking(req: Request, res: Response): Promise<void> {
      try {
        const { amount } = req.body;
      const productId= req.params.id;
      const userId = (req as any).userId;
    
      console.log(productId);
        if (!amount || typeof amount !== "number") {
           res.status(400).json({ message: "Invalid amount" });
        }
    
        const order = await bookingService.createBookingOrder(amount,productId,userId);
        res.status(200).json(order);
      } catch (error) {
        console.error("Error creating Razorpay order:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          message: error instanceof Error ? error.message : "Failed to create Razorpay order",
        });
      }
    }
    
    async verifyPayment(req: Request, res: Response): Promise<void> {
      try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId } = req.body;
    
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
           res.status(400).json({ message: "Missing payment verification fields" });
        }
    
        const result = await bookingService.verifyBookingPayment({
          razorpay_order_id,
          razorpay_payment_id,
          razorpay_signature,
          bookingId,
        });
    
        if (!result.isValid) {
           res.status(400).json({ success: false, message: "Payment verification failed" });
        }
    
        res.status(200).json({
          success: true,
          message: "Payment verified successfully",
          booking: result.booking, 
        });
      } catch (error) {
        console.error("Error verifying Razorpay payment:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          message: error instanceof Error ? error.message : "Payment verification failed",
        });
      }
    }

    async listBookingsByOwner(req:Request, res:Response):Promise<void>{
      try {
         
        const ownerId = req.query.ownerId as string;
        console.log(ownerId)
        const result = await bookingService.listBookingsByOwner(ownerId);
        res.status(result.status).json({
          bookings: result.bookings,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch bookings",
        });
      }
    }

    async bookingDetails(req:Request,res:Response):Promise<void>{
      try {
        const bookingId=req.params.id;
        const result = await bookingService.bookingDetails(bookingId);
        res.status(result.status).json({
          bookingData: result.bookingData,
          userData:result.userData,
          
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch booking data",
        });
      }
    }
    async userBookingDetails(req:Request,res:Response):Promise<void>{
      try {
        const bookingId=req.params.id;
        const result = await bookingService.userBookingDetails(bookingId);
        res.status(result.status).json({
          bookingData: result.bookingData,
          ownerData:result.ownerData,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch booking data",
        });
      }
    }
}




export default new bookingController();