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
  
  
   
    async findUser(userId:string):Promise<IUser|null>{
      return await User.findOne({_id:userId});
    }
    async findOwner(ownerId: string): Promise<IOwner | null> {
      return await Owners.findById(ownerId);
    }
    async deleteOwner(ownerId: string): Promise<IOwner | null> {
      return await Owners.findOneAndDelete({ _id: ownerId });
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

export default AdminRepository;
