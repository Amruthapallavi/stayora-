import { Request, Response } from "express";
import { STATUS_CODES } from "../utils/constants";
import { IBookingController } from "./interfaces/IBookingController";
import { injectable,inject } from "inversify";
import TYPES from "../config/DI/types";
import { IBookingService } from "../services/interfaces/IBookingService";
import { CreateBookingDTO, VerifyPaymentDTO } from "../DTO/booking/bookingControllerDTO";

@injectable()
export class BookingController implements IBookingController {
  constructor(
    @inject(TYPES.BookingService)
      private _bookingService: IBookingService
    
  ){}
    
    async createBooking(req: Request, res: Response): Promise<void> {
      try {
      const { amount }: CreateBookingDTO = req.body;
        const propertyId= req.params.id;
        const userId = (req as any).userId;
    
        if (!amount || typeof amount !== "number") {
           res.status(400).json({ message: "Invalid amount" });
        }
    
        const order = await this._bookingService.createBookingOrder(amount,propertyId,userId);
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
const {
  razorpay_order_id,
  razorpay_payment_id,
  razorpay_signature,
  bookingId,
}: VerifyPaymentDTO = req.body;
    
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
           res.status(400).json({ message: "Missing payment verification fields" });
        }
    
        const result = await this._bookingService.verifyBookingPayment({
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
    async bookingFromWallet(req: Request, res: Response): Promise<void> {
      try {
        const propertyId= req.params.id;
        const userId = (req as any).userId;
        const result =await this._bookingService.bookingFromWallet(userId,propertyId);
          if (!result.isValid) {
           res.status(400).json({ success: false, message: "booking from wallet failed...try another payment method..." });
        }
          res.status(200).json({
          success: true,
          message: "successfully booking completed",
          booking: result.booking, 
        });
    
      } catch (error) {
        console.error("booking error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          message: error instanceof Error ? error.message : "Booking failed",
        });
      }
    }

    async listBookingsByOwner(req:Request, res:Response):Promise<void>{
      try {
      const ownerId = req.query.ownerId as string;
const page = parseInt(req.query.page as string) || 1;
const limit = parseInt(req.query.limit as string) || 10;

const result = await this._bookingService.listBookingsByOwner(ownerId, page, limit);

res.status(result.status).json({
  bookings: result.bookings,
  currentPage: result.currentPage,
  totalPages: result.totalPages
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
        const result = await this._bookingService.bookingDetails(bookingId);
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
    async cancelBooking(req:Request,res:Response):Promise<void>{
      try {
        const bookingId= req.params.id;
        const reason:string=req.body.reason;
        if(!bookingId  ){
            res.status(STATUS_CODES.BAD_REQUEST).json({
              error: "booking not found",
            });
            return;
          }
          const result = await this._bookingService.cancelBooking(bookingId,reason);
        res.status(result.status).json({
          message:result.message,
        })
      } catch (error) {
        console.log(error);
        throw error;
      }
    }
    async userBookingDetails(req:Request,res:Response):Promise<void>{
      try {
        const bookingId=req.params.id;
        const result = await this._bookingService.userBookingDetails(bookingId);
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
    
    async listAllBookings(req:Request, res:Response):Promise<void>{
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 6;
        const result = await this._bookingService.listAllBookings(page,limit);
        
        res.status(result.status).json({
          bookings: result.bookings,
          totalPages: result.totalPages,
          currentPage: page,
        });
      } catch (error) {
        console.error(error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
          error: error instanceof Error ? error.message : "Failed to fetch bookings",
        });
      }
    }
    async getUserReview(req: Request, res: Response): Promise<void> {
      try {
        const bookingId=req.params.id;
        const userId = (req as any).userId;
        const result = await this._bookingService.getUserReview(bookingId,userId);
         res.status(result.status).json({
              review: result.review,
            });
      } catch (error) {
         console.error(error);
            res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
              error: error instanceof Error ? error.message : "Failed to fetch user review",
            });
      }
    }
     async AllbookingDetails(req:Request,res:Response):Promise<void>{
          try {
            const bookingId=req.params.id;
            const result = await this._bookingService.AllbookingDetails(bookingId);
            res.status(result.status).json({
              bookingData: result.bookingData,
              userData:result.userData,
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




export default BookingController;