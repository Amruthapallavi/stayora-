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

async findAllUsers(
  page: number,
  limit: number,
  searchTerm?: string
): Promise<{ users: IUser[]; totalUser: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const searchQuery = searchTerm
    ? {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
        role: "user", 
      }
    : { role: "user" };

  const users = await User.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalUser = await User.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalUser / limit);

  return { users, totalUser, totalPages };
}
async findAllOwners(
  page: number,
  limit: number,
  searchTerm?: string
): Promise<{ owners: IOwner[]; totalOwner: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const searchQuery = searchTerm
    ? {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  const owners = await Owners.find(searchQuery)
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

  const totalOwner = await Owners.countDocuments(searchQuery);
  const totalPages = Math.ceil(totalOwner / limit);

  return { owners, totalOwner, totalPages };
}


async subscriptionRevenue(): Promise<number> {
  const result = await Owners.aggregate([
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: "$subscriptionPrice" }
      }
    }
  ]);

  return result[0]?.totalRevenue || 0;
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
