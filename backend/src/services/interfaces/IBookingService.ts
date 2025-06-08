
import { OwnerResponseDTO } from "../../DTO/OwnerResponseDTO";
import { UserResponseDTO } from "../../DTO/UserResponseDto";
import { IBooking } from "../../models/booking.model";
import { IOwner } from "../../models/owner.model";
import { IUser } from "../../models/user.model";



export interface IBookingService {
  createBookingOrder(
    amount: number,
    propertyId: string,
    userId: string
  ): Promise<{
    id: string;
    amount: number;
    currency: string;
    bookingId: string;
  }>;

  verifyBookingPayment(
    payload: RazorpayVerifyPayload
  ): Promise<{
    isValid: boolean;
    booking: IBooking | null;
  }>;
bookingFromWallet(userId:string,propertyId:string):Promise<{isValid:boolean;booking:IBooking | null}>;
  listBookingsByOwner(
    ownerId: string,
    page:number,
    limit:number
  ): Promise<{
    bookings: IBooking[];
    status: number;
    totalPages:number;
    currentPage:number;
    message: string;
  }>;

  bookingDetails(
    id: string
  ): Promise<{
    bookingData: IBooking | null;
    userData: UserResponseDTO | null;
    status: number;
    message: string;
  }>;

  userBookingDetails(
    id: string
  ): Promise<{
    bookingData: IBooking | null;
    ownerData: OwnerResponseDTO | null;
    status: number;
    message: string;
  }>;

  listAllBookings(
    page: number,
    limit: number
  ): Promise<{
    bookings: IBooking[];
    status: number;
    message: string;
    totalPages: number;
  }>;

  AllbookingDetails(
    id: string
  ): Promise<{
    bookingData: IBooking | null;
    ownerData: OwnerResponseDTO | null;
    userData: UserResponseDTO | null;
    status: number;
    message: string;
  }>;
  cancelBooking(id: string, reason: string): Promise<{ status: number; message: string }>;

}




export default interface RazorpayVerifyPayload {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
    bookingId:string
    
  }
  
  

  