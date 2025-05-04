import Owner, { IOwner } from "../models/owner.model";
import { IOwnerRepository } from "./interfaces/IOwnerRepository";
import BaseRepository from "./base.repository";
import Feature, { IFeature } from "../models/features.model";
import Property, { IProperty } from "../models/property.model";
import Booking, { IBooking } from "../models/booking.model";
import mongoose from "mongoose";
class OwnerRepository
  extends BaseRepository<IOwner>
  implements IOwnerRepository
{
  constructor() {
    super(Owner);
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return await Owner.findOne({ email: email });
  }
  async findFeatures(): Promise<IFeature[]> {
    return await Feature.find();
  }
  async findOwnerProperty(ownerId: string): Promise<IProperty[]> {
    return await Property.find({ ownerId });
  }
  async getFeatureNamesByIds(ids: string[]): Promise<IFeature[]> {
    return await Feature.find({ _id: { $in: ids } }, { name: 1, _id: 0 });
  }
  async findUserById(id: string): Promise<IOwner | null> {
    return await Owner.findById(id);
  }
  async findPropertyById(id: string): Promise<IProperty | null> {
    return await Property.findById(id);
  }
  async updateRefreshToken(ownerId: string, refreshToken: string) {
    return await Owner.updateOne({ _id: ownerId }, { refreshToken });
  }
  async getPropertiesByOwner(ownerId: string): Promise<IProperty[]> {
    return await Property.find({ ownerId }).lean();
  }

  async getBookingsByPropertyIds(propertyIds: string[]): Promise<IBooking[]> {
    return await Booking.find({ propertyId: { $in: propertyIds } }).lean();
  }
  async bookingsByMonth(ownerId: string): Promise<{ name: string; bookings: number; revenue: number }[]> {
    try {
      const bookingsByMonth = await Booking.aggregate([
        {
          $match: {
            ownerId: new mongoose.Types.ObjectId(ownerId), // Filter by ownerId
            bookingStatus: 'completed', // Filter only completed bookings, adjust as needed
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" }, // Extract month from createdAt
            year: { $year: "$createdAt" }, // Extract year from createdAt
            totalCost: 1, // Include totalCost field to calculate revenue
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" }, // Group by month and year
            totalBookings: { $sum: 1 }, // Count of bookings
            totalRevenue: { $sum: "$totalCost" }, // Sum of total cost (revenue)
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }, // Sort by year and month in ascending order
        },
      ]);
  
      // Format the data to match the required structure
      const chartData = bookingsByMonth.map((item) => {
        const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('en', { month: 'short' });
        return {
          name: `${monthName} ${item._id.year}`, // Format like "Jan 2025"
          bookings: item.totalBookings,
          revenue: item.totalRevenue,
        };
      });
  
      return chartData;
    } catch (error) {
      console.error("Error fetching bookings by month:", error);
      throw new Error("Error fetching bookings by month");
    }
  }

}

export default new OwnerRepository();
