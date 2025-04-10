import mongoose, { Types } from "mongoose";
import Booking, { IBooking } from "../models/booking.model";
import Cart from "../models/cart.model";
import Property from "../models/property.model";

const bookingRepository = {
  saveBooking: async (bookingData: any) => {
    const booking = new Booking(bookingData);
    return await booking.save();
  },
  findOwnerBookings: async (ownerId: string) => {
    return await Booking.find({ ownerId: new mongoose.Types.ObjectId(ownerId) }) // ensure proper ObjectId
    .populate('userId')
      .populate('propertyId');
  },
  findBookings:async(userId:string)=>{
    return Booking.find({userId})
  },
  
  updateBookingStatus: async (id: string, status: string) => {
    return await Booking.findByIdAndUpdate(id, { status }, { new: true });
  },
  findPropertyById:async(id:string)=>{
    return await Property.findById(id);
  },
  getCartProperty: async (userId: string, productId: string) => {
    const userCart = await Cart.findOne({
      userId,
      "properties.propertyId": productId,
    });

    if (!userCart) return null;

    const property = userCart.properties.find(
      (p: any) => p.propertyId.toString() === productId
    );

    return property || null;
  },
  updateBookingDetails: async (bookingId: string, updateData: Partial<IBooking>) => {
    console.log(bookingId,updateData)
    return await Booking.findOneAndUpdate({ _id:bookingId }, updateData, { new: true });
  },
  updatePropertyStatus: async (propertyId: string, status: string) => {
    return await Property.findByIdAndUpdate(propertyId, { status }, { new: true });
  },
  async findBookingById(bookingId: string) {
    return await Booking.findById(new Types.ObjectId(bookingId));
  },
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
  },

  async findBookingsByUserId(userId: string, skip = 0, limit = 5) {
    return await Booking.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("propertyId"); 
  },

  async countUserBookings(userId: string) {
    return await Booking.countDocuments({ userId });
  }
  
  
  
  
  
  
  
};

export default bookingRepository;
