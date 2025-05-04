import { Types } from "mongoose";
import Property, { IProperty } from "../models/property.model";
import BaseRepository from "./base.repository";
import { IPropertyRepository } from "./interfaces/IPropertyRepository";

class propertyRepository
  extends BaseRepository<IProperty>
  implements IPropertyRepository
{
  constructor() {
    super(Property);
  }

  async findPropertyById(id: string): Promise<IProperty | null> {
    return await Property.findById(id);
  }
  async findAllPropertiesWithOwnerData() {
    return await Property.find()
      .sort({ createdAt: -1 }) 
      .populate("ownerId", "-password");
  }
  
  async updatePropertyById(id: Types.ObjectId, updateData: Partial<IProperty>): Promise<IProperty | null> {
    const updatedProperty = await Property.updateOne({ _id: id }, updateData);
  
    if (updatedProperty.modifiedCount === 0) {
      return null; 
    }
  
    return await Property.findById(id); 
  }
  
  
  async findSimilarProperties(
    title: string,
    coordinates: { latitude: number; longitude: number }
  ): Promise<IProperty[]> {
    return await Property.find({
      title: new RegExp(`^${title}$`, 'i'), 
      'location.coordinates.latitude': coordinates.latitude,
      'location.coordinates.longitude': coordinates.longitude,
    });
  }
  async deletePropertyById (id: string) {
    return await Property.findByIdAndDelete(id);
  }
  async findFilteredProperties(filters: any) {
    try {
      const query = this.buildQuery(filters);
      return await Property.find(query);
    } catch (error) {
      console.error('Error in PropertyRepository:', error);
      throw new Error('Database query failed');
    }
  }

  private buildQuery(filters: any) {
    let query: any = {
      status: 'active'
    };
  
    if (filters.priceRange) {
      const [min, max] = filters.priceRange.split(',').map(Number);
      query.rentPerMonth = { $gte: min, $lte: max };
    }
  
    if (filters.type) {
      const typeRegex = new RegExp(`^${filters.type}$`, 'i'); 
      query.type = typeRegex;
    }
    
  
    if (filters.location) {
      const regex = new RegExp(filters.location, 'i');
      query.$or = [
        { city: regex },
        { district: regex },
        { state: regex }
      ];
    }
  
    if (filters.bedrooms) {
      query.bedrooms = { $gte: Number(filters.bedrooms) };
    }
  
    return query;
  }
  
  
}
export default new propertyRepository();
