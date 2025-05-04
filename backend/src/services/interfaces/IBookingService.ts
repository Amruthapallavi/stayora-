
import { IBooking } from "../../models/booking.model";


export interface IBookingService {
  createBookingOrder(amount: number, productId: string, userId: string): Promise<any>;

   verifyBookingPayment(payload: RazorpayVerifyPayload): Promise<{
    isValid: boolean;
    booking: IBooking | null;
  }>

  listBookingsByOwner(
    ownerId: string,
    // filter: string
  ): Promise<{ message: string; status: number; bookings: IBooking[] }>;
  
  

  
}






export default interface RazorpayVerifyPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    bookingId:string
    
  }
  