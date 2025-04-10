import { IAdminRepository } from "./interfaces/IAdminRepository";
import BaseRepository from "./base.repository";
import Admin, { IUser } from "../models/user.model";
import Service, { IService } from "../models/service.model";
import Feature, { IFeature } from "../models/features.model";
import User from "../models/user.model";
import  Owners, { IOwner } from "../models/owner.model";
import Property, { IProperty } from "../models/property.model";
import Booking, { IBooking } from "../models/booking.model";
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
  async findAllOwners():Promise<IOwner[]>{
    return await Owners.find();
  }
  async findServices():Promise<IService[]>{
    return await Service.find()
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
    async findProperties() {
      return await Property.find().populate("ownerId", "-password");
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
    async findAllBookings  (){
      return Booking.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "userId",
            foreignField: "_id",
            as: "user",
          }
        },
        {
          $lookup: {
            from: "owners",
            localField: "ownerId",
            foreignField: "_id",
            as: "owner",
          }
        },
        {
          $lookup: {
            from: "properties",
            localField: "propertyId",
            foreignField: "_id",
            as: "property",
          }
        },
        // Flatten arrays from lookups
        { $unwind: "$user" },
        { $unwind: "$owner" },
        { $unwind: "$property" },
        {
          $project: {
            id: "$_id",
            userName: "$user.name",
            ownerName: "$owner.name",
            propertyName: "$property.title", 
            ownerEmail:"owner.email",
            userEmail:"user.email",
            moveInDate: 1,
            endDate: 1,
            bookingId:1,
            bookingStatus: 1,
            paymentStatus: 1,
            totalCost: 1,
            createdAt: 1
          }
        }
      ]);
    };
    
    
    
    
    
    
}

export default new AdminRepository();
