import { IBaseRepository } from "./IBaseRepository";
import { IOwner } from "../../models/owner.model";

export interface IOwnerRepository extends IBaseRepository<IOwner> {
  findByEmail(email: string): Promise<IOwner | null>;
}