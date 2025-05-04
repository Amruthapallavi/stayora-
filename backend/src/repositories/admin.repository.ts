import { IAdminRepository } from "./interfaces/IAdminRepository";
import BaseRepository from "./base.repository";
import Admin, { IUser } from "../models/user.model";
import Service, { IService } from "../models/service.model";
import Feature, { IFeature } from "../models/features.model";
import User from "../models/user.model";
import  Owners, { IOwner } from "../models/owner.model";
import Property, { IProperty } from "../models/property.model";
import Booking, { IBooking } from "../models/booking.model";
import { Types } from "mongoose";
class AdminRepository
  extends BaseRepository<IUser>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await Admin.findOne({ email: email, role: 'admin' });
  }

  async findAllUsers(): Promise<IUser[]> {
    return await User.find({ role: 'user' });
  }
  async findAllOwners(): Promise<IOwner[]> {
    return await Owners.find().sort({ createdAt: -1 });
  }
  
  
   async findService(id:string): Promise<IService|null> {
      return await Service.findOne({_id:id});
    }
    async findFeatures(): Promise<IFeature[]>{
      return await Feature.find()
    }
    async findUser(id:string):Promise<IUser|null>{
      return await User.findOne({_id:id});
    }
    async findOwner(id: string): Promise<IOwner | null> {
      return await Owners.findById(id);
    }
    async deleteOwner(id: string): Promise<IOwner | null> {
      return await Owners.findOneAndDelete({ _id: id });
    }
    async findFeature(id:string): Promise<IFeature |null>{
      return await Feature.findOne({_id:id})
    }
    async deleteFeature(id:string): Promise<IFeature | null>{
      return await Feature.findByIdAndDelete({_id:id});
    }
  
    async approveProperty (id: string) {
      return await Property.findByIdAndUpdate(id, { status: 'active' });
    };
    
    async blockUnblockProperty (id: string, status: string) {
     return await Property.findByIdAndUpdate(id, { status });
    };
    
    async deleteProperty (id: string) {
      return await Property.findByIdAndDelete(id);
    };
    async findAllBookings(skip: number = 0, limit: number = 5) {
      return Booking.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          },
        },
        {
          $lookup: {
            from: "owners",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          },
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          },
        },
        { $unwind: "$user" },
        { $unwind: "$owner" },
        { $unwind: "$property" },
        {
          $project: {
            id: "$_id",
            userName: "$user.name",
            ownerName: "$owner.name",
            propertyName: "$property.title",
            ownerEmail: "$owner.email",
            userEmail: "$user.email",
            moveInDate: 1,
            endDate: 1,
            bookingId: 1,
            bookingStatus: 1,
            paymentStatus: 1,
            totalCost: 1,
            createdAt: 1,
          },
        },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit },
      ]);
    };

    async countAllBookings() {
      return Booking.countDocuments();
    }
    async updateRefreshToken(adminId: string | Types.ObjectId, refreshToken: string): Promise<IUser | null> {
      return await Admin.findByIdAndUpdate(adminId, { refreshToken }, { new: true });
  }
 
  
    async getUserRegistrations() {
      return User.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          }
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            count: { $sum: 1 }
          }
        }
      ]);
    }
  
    async getOwnerRegistrations() {
      return Owners.aggregate([
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          }
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            count: { $sum: 1 }
          }
        }
      ]);
    }

    async getBookingStats() {
      return Booking.aggregate([
        {
          $match: { bookingStatus: 'completed' }
        },
        {
          $project: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" },
            totalCost: 1
          }
        },
        {
          $group: {
            _id: { month: "$month", year: "$year" },
            count: { $sum: 1 },
            revenue: { $sum: "$totalCost" }
          }
        }
      ]);
    }
  
  
    
    
    
    
    
}

export default new AdminRepository();
