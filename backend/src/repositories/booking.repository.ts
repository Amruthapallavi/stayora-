import mongoose, { Types } from "mongoose";
import Booking, { IBooking } from "../models/booking.model";
import Cart from "../models/cart.model";
import Property from "../models/property.model";
import BaseRepository from "./base.repository";
import { IBookingRepository } from "./interfaces/IBookingRepository";

class BookingRepository extends BaseRepository<IBooking> implements IBookingRepository {
  constructor() {
    super(Booking);
  }

  async saveBooking(bookingData: any) {
    const booking = new Booking(bookingData);
    return await booking.save();
  }

  async findOwnerBookings(ownerId: string) {
    return await Booking.find({ ownerId: new mongoose.Types.ObjectId(ownerId) })
      .populate("userId")
      .populate("propertyId")
      .sort({ createdAt: -1 }); 
  }
  
  async findBookings(userId: string) {
    return Booking.find({ userId }).sort({ createdAt: -1 });
  }
  

  async findBookingData(bookingId: string) {
    return Booking.findById(bookingId).populate("propertyId");
  }

  async updateBookingStatus(id: string, status: string) {
    return await Booking.findByIdAndUpdate(id, { status }, { new: true });
  }

  async findPropertyById(id: string) {
    return await Property.findById(id);
  }

  async getCartProperty(userId: string, productId: string) {
    const userCart = await Cart.findOne({
      userId,
      "properties.propertyId": productId,
    });

    if (!userCart) return null;

    const property = userCart.properties.find(
      (p: any) => p.propertyId.toString() === productId
    );

    return property || null;
  }

  async updateBookingDetails(bookingId: string, updateData: Partial<IBooking>) {
    return await Booking.findOneAndUpdate({ _id: bookingId }, updateData, {
      new: true,
    });
  }

  async updatePropertyStatus(propertyId: string, status: string) {
    return await Property.findByIdAndUpdate(propertyId, { status }, { new: true });
  }

  async findBookingById(bookingId: string) {
    return await Booking.findById(new Types.ObjectId(bookingId));
  }

  async findUserBookingData(bookingId: string) {
    return await Booking.findById(bookingId).populate("propertyId");
  }

  async removeCartProperty(userId: string, propertyId: string): Promise<void> {
    const cart = await Cart.findOne({ userId });
    if (!cart) return;

    const propertyToRemove = cart.properties.find(
      (prop: any) => prop.propertyId.toString() === propertyId.toString()
    );

    if (!propertyToRemove) return;

    const costToSubtract = propertyToRemove.totalCost || 0;
    await Cart.updateOne(
      { userId },
      {
        $pull: { properties: { propertyId } },
        $inc: { totalCost: -costToSubtract },
      }
    );
  }

  async findBookingsByUserId(userId: string, skip = 0, limit = 5) {
    return await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId");
  }

  async countUserBookings(userId: string) {
    return await Booking.countDocuments({ userId });
  }
  async  findPropertyBookings(propertyId: string) {
    return await Booking.find({ propertyId: propertyId })
      .populate("userId")  
  }
  
 async findBookingsToComplete (today: Date){
    return await Booking.find({
      endDate: { $lt: today },
      bookingStatus: { $ne: 'completed' },
    });
  };
}


export default new BookingRepository();
