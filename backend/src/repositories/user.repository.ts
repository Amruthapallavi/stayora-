import User, { IUser } from "../models/user.model";
import { IUserRepository } from "./interfaces/IUserRepository";
import BaseRepository from "./base.repository";
import Property, { IProperty } from "../models/property.model";
import Cart, { ICart } from "../models/cart.model";
import Owners, { IOwner } from "../models/owner.model";
import Service, { IService } from "../models/service.model";

class UserRepository extends BaseRepository<IUser> implements IUserRepository {
  constructor() {
    super(User);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email: email });
  }
 async findProperties(page: number, limit: number) {
  const skip = (page - 1) * limit;

  const [totalProperties, properties] = await Promise.all([
    Property.countDocuments({ status: 'active' }),
    Property.find({ status: 'active' })
      .skip(skip)
      .limit(limit)
  ]);

  const totalPages = Math.ceil(totalProperties / limit);

  return {
    totalProperties,
    totalPages,
    properties,
  };
}

  
  async findCart(id:string):Promise<ICart |null>{
    return await Cart.findOne({userId:id})
  }

  async findOwnerById(id:string):Promise<IOwner |null>{
    return await Owners.findById(id)
  }
  async findActiveServices(): Promise<IService[]> {
    return await Service.find({ status: "active" });
  }
  async getUserById(id: string): Promise<IUser | null> {
    return await User.findById(id).select('-password'); // exclude password
  }
  async findUserById(id:string):Promise<IUser |null>{
    return await User.findById(id)
  }
  // async findUserCart(id:string):Promise<IOwner |null>{
  //   return await Cart.findById(id)
  // }

 async updateUserPassword (id: string, newHashedPassword: string): Promise<void> {
    await User.findByIdAndUpdate(id, { password: newHashedPassword });
  };
  async getAllUsersExcept(userId: string): Promise<IUser[]> {
    return User.find({ _id: { $ne: userId } });
  }
  
}

export default  UserRepository;