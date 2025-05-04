import { IBaseRepository } from "./IBaseRepository";
import { IProperty } from "../../models/property.model";

export interface IPropertyRepository extends IBaseRepository<IProperty> {
//   findByOwner(vendorId: string): Promise<IProperty[]>;
  findPropertyById(id: string): Promise<IProperty | null>;
  findSimilarProperties(
    title: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<IProperty[]|null>;
  findAllPropertiesWithOwnerData():Promise<IProperty[] |null>;

}