import { IAdminRepository } from "./interfaces/IAdminRepository";
import BaseRepository from "./base.repository";
import Admin, { IUser } from "../models/user.model";
import Service, { IService } from "../models/service.model";
import Feature, { IFeature } from "../models/features.model";
import User from "../models/user.model";
import  Owners, { IOwner } from "../models/owner.model";
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
    async findOwner(id:string):Promise<IUser|null>{
      return await Owners.findOne({_id:id});
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
    
}

export default new AdminRepository();
