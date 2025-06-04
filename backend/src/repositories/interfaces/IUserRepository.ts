import { IBaseRepository } from "./IBaseRepository";
import { IUser } from "../../models/user.model";
import { IProperty } from "../../models/property.model";
import { ICart } from "../../models/cart.model";
import { IOwner } from "../../models/owner.model";
import { IService } from "../../models/service.model";

export interface IUserRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
findProperties(
  page: number,
  limit: number
): Promise<{
  properties: IProperty[];
  totalPages: number;
  totalProperties: number;
}>;
  findCart(id: string): Promise<ICart | null>;
  findOwnerById(id: string): Promise<IOwner | null>;
  findActiveServices(): Promise<IService[]>;
  getUserById(id: string): Promise<IUser | null>;
  findUserById(id: string): Promise<IUser | null>;
  updateUserPassword(id: string, newHashedPassword: string): Promise<void>;
  getAllUsersExcept(userId: string): Promise<IUser[] |[]>;

}