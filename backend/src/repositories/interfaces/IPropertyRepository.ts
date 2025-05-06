import { IBaseRepository } from "./IBaseRepository";
import { IProperty } from "../../models/property.model";
import { Types } from "mongoose";

export interface IPropertyRepository extends IBaseRepository<IProperty> {
  
  findPropertyById(id: string): Promise<IProperty | null>;
  findAllPropertiesWithOwnerData(): Promise<IProperty[]>;
  propertiesWithSameType(id: string, type: string): Promise<IProperty[]>;
  updatePropertyById(
    id: Types.ObjectId,
    updateData: Partial<IProperty>
  ): Promise<IProperty | null>;
  findSimilarProperties(
    title: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<IProperty[]>;
  deletePropertyById(id: string): Promise<IProperty | null>;
  findFilteredProperties(filters: any): Promise<IProperty[]>;
  approveProperty(propertyId: string): Promise<IProperty | null>;
  blockUnblockProperty(propertyId: string, status: string): Promise<IProperty | null>;
  deleteProperty(propertyId: string): Promise<IProperty | null>;
}