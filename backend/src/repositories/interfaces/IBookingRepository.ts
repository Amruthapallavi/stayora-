import { IBooking } from "../../models/booking.model";
import { IProperty } from "../../models/property.model";
import { IBaseRepository } from "./IBaseRepository";
import { Types } from "mongoose";

export interface IBookingRepository extends IBaseRepository<IBooking> {
  saveBooking(bookingData: any): Promise<IBooking>;
  findOwnerBookings(ownerId: string): Promise<IBooking[]>;
  findBookings(userId: string): Promise<IBooking[]>;
  findBookingData(bookingId: string): Promise<IBooking | null>;
  updateBookingStatus(id: string, status: string): Promise<IBooking | null>;
  findPropertyById(id: string): Promise<any>; // You may replace `any` with actual Property type
  getCartProperty(userId: string, productId: string): Promise<any | null>; // Replace `any` with cart property type if available
  updateBookingDetails(
    bookingId: string,
    updateData: Partial<IBooking>
  ): Promise<IBooking | null>;
  updatePropertyStatus(
    propertyId: string,
    status: string
  ): Promise<any>; 
  findBookingById(bookingId: string): Promise<IBooking | null>;
  findUserBookingData(bookingId: string): Promise<IBooking | null>;
  removeCartProperty(userId: string, propertyId: string): Promise<void>;
  findBookingsByUserId(
    userId: string,
    skip?: number,
    limit?: number
  ): Promise<IBooking[]>;
  countUserBookings(userId: string): Promise<number>;
}
