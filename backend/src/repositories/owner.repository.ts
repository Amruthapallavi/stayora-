import Owner, { IOwner } from "../models/owner.model";
import { IOwnerRepository } from "./interfaces/IOwnerRepository";
import BaseRepository from "./base.repository";
import Feature, { IFeature } from "../models/features.model";
import Property, { IProperty } from "../models/property.model";
import Booking, { IBooking } from "../models/booking.model";
import mongoose from "mongoose";
import { title } from "process";
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
async findOwnerProperty(
  ownerId: string,
  page: number,
  limit: number,
  searchTerm?: string
): Promise<{ properties: IProperty[]; totalProperties: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const searchQuery = searchTerm
    ? {
        ownerId,
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : { ownerId };

  const properties = await Property.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalProperties = await Property.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalProperties / limit);

  return { properties, totalProperties, totalPages };
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
async updateUserPassword (id: string, newHashedPassword: string): Promise<void> {
    await Owner.findByIdAndUpdate(id, { password: newHashedPassword });
  };
  async getBookingsByPropertyIds(propertyIds: string[]): Promise<IBooking[]> {
    return await Booking.find({ propertyId: { $in: propertyIds } }).lean();
  }
  async bookingsByMonth(ownerId: string): Promise<{ name: string; bookings: number; revenue: number }[]> {
    try {
      const bookingsByMonth = await Booking.aggregate([
        {
          $match: {
            ownerId: new mongoose.Types.ObjectId(ownerId), 
            bookingStatus: 'confirmed', 
          },
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }, 
            totalCost: 1, 
          },
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" }, 
            totalBookings: { $sum: 1 }, 
            totalRevenue: { $sum: "$totalCost" },
          },
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }, 
        },
      ]);
  
      const chartData = bookingsByMonth.map((item) => {
        const monthName = new Date(item._id.year, item._id.month - 1).toLocaleString('en', { month: 'short' });
        return {
          name: `${monthName} ${item._id.year}`, 
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

export default OwnerRepository;
