import Owner, { IOwner } from "../models/owner.model";
import { IOwnerRepository } from "./interfaces/IOwnerRepository";
import BaseRepository from "./base.repository";
import Feature, { IFeature } from "../models/features.model";

class OwnerRepository
  extends BaseRepository<IOwner>
  implements IOwnerRepository
{
  constructor() {
    super(Owner);
  }

  async findByEmail(email: string): Promise<IOwner | null> {
    return await Owner.findOne({ email: email });
  }
   async findFeatures(): Promise<IFeature[]>{
        return await Feature.find()
      }
}

export default new OwnerRepository();