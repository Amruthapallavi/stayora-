import { IBaseRepository } from "./IBaseRepository";
import { IUser } from "../../models/user.model";
import { IOwner } from "../../models/owner.model";
import { IService } from "../../models/service.model";
import { IFeature } from "../../models/features.model";
import { IBooking } from "../../models/booking.model";
import { IBookingReport } from "../../type/booking";
import { IProperty } from "../../models/property.model";
import { Types } from "mongoose";

export interface IAdminRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
findAllUsers(page: number, limit: number,searchTerm?:string): Promise<{ users: IUser[]; totalUser: number;totalPages:number }>;
findAllOwners(page: number, limit: number,searchTerm?:string): Promise<{ owners: IOwner[]; totalOwner: number;totalPages:number }>;
  findUser(userId: string): Promise<IUser | null>;
  findOwner(ownerId: string): Promise<IOwner | null>;
  deleteOwner(ownerId: string): Promise<IOwner | null>;
  updateRefreshToken(adminId: string | Types.ObjectId, refreshToken: string): Promise<IUser | null>;
  getUserRegistrations(): Promise<
    { _id: { month: number; year: number }; count: number }[]
  >;
  getOwnerRegistrations(): Promise<
    { _id: { month: number; year: number }; count: number }[]
  >;
  getBookingStats(): Promise<
    { _id: { month: number; year: number }; count: number; revenue: number }[]
  >;
  
subscriptionRevenue(): Promise<number>

}



  
