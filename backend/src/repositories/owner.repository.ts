import owner, { IOwner } from "../models/owner.model";
import { IOwnerRepository } from "./interfaces/IOwnerRepository";
import BaseRepository from "./base.repository";

class VendorRepository
  extends BaseRepository<IOwner>
  implements IOwnerRepository
{
  constructor() {
    super(owner);
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return await owner.findOne({ email: email });
  }
}

export default new VendorRepository();