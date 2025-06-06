import { IBooking } from "../../models/booking.model";
import { Document } from "mongoose";
import { IBaseRepository } from "./IBaseRepository";
import { IBookingData } from "../../DTO/BookingResponseDTO";

export interface IBookingRepository extends IBaseRepository<IBooking>{
  saveBooking(bookingData: IBookingData): Promise<IBooking>;

  findOwnerBookings(ownerId: string,page:number,limit:number): Promise<{bookings:IBooking[],totalPages:number}>;

  findBookings(userId: string): Promise<IBooking[]>;

  findBookingData(bookingId: string): Promise<IBooking | null>;

  updateBookingStatus(id: string, status: string): Promise<IBooking | null>;

  findPropertyById(id: string): Promise<Document | null>;

  getCartProperty(userId: string, productId: string): Promise<any>;

  updateBookingDetails(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null>;

  updatePropertyStatus(
    propertyId: string,
    status: string
  ): Promise<Document | null>;

  findBookingById(bookingId: string): Promise<IBooking | null>;

  findUserBookingData(bookingId: string): Promise<IBooking | null>;

  removeCartProperty(userId: string, propertyId: string): Promise<void>;

  findBookingsByUserId(
    userId: string,
    skip: number,
    limit: number
  ): Promise<IBooking[]>;

  countUserBookings(userId: string): Promise<number>;

  findPropertyBookings(propertyId: string): Promise<IBooking[]>;

  findAllBookings(skip: number, limit: number): Promise<IBooking[]>;

  findBookingsToComplete(today: Date): Promise<IBooking[]>;

  countAllBookings(): Promise<number>;
}
