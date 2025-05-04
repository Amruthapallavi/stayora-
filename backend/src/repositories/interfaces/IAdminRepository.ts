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
  updateRefreshToken(adminId: string | Types.ObjectId, refreshToken: string): Promise<IUser | null>;

  findByEmail(email: string): Promise<IUser | null>;
  findAllUsers(): Promise<IUser[] | null>;
  findAllOwners(): Promise<IOwner[] | null>;
  findService(id:string): Promise<IService | null>;
  findFeatures(): Promise<IFeature[] | null>;
  findUser(id: string): Promise<IUser | null>;
  findOwner(id: string): Promise<IOwner | null>;
  deleteOwner(id: string): Promise<IOwner | null>;
  blockUnblockProperty(id: string,status:string): Promise<IProperty | null>;
  deleteProperty(id: string): Promise<IProperty | null>;
  findAllBookings(): Promise<IBookingReport[]>;


}