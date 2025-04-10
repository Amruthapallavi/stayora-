import Owner, { IOwner } from "../models/owner.model";
import { IOwnerRepository } from "./interfaces/IOwnerRepository";
import BaseRepository from "./base.repository";
import Feature, { IFeature } from "../models/features.model";
import Property,{IProperty} from "../models/property.model";
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
      async findOwnerProperty(ownerId: string): Promise<IProperty[]> {
        return await Property.find({ ownerId }); 
      }
      async getFeatureNamesByIds(ids: string[]): Promise<IFeature[]> {
        return await Feature.find(
          { _id: { $in: ids } },
          { name: 1, _id: 0 } 
        );
      }
      async findUserById(id:string):Promise<IOwner |null>{
          return await Owner.findById(id)
        }
        async findPropertyById(id:string):Promise<IProperty |null>{
          return await Property.findById(id);
        }
          async deleteProperty (id: string) {
              return await Property.findByIdAndDelete(id);
            };
}

export default new OwnerRepository();