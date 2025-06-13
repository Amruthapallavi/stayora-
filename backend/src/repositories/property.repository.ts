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
async findAllPropertiesWithOwnerData(
  page: number,
  limit: number,
  searchTerm: string
): Promise<{ properties: IProperty[]; totalPages: number }> {
  const skip = (page - 1) * limit;

  // Create a case-insensitive regex filter
  const searchFilter = searchTerm
    ? {
        $or: [
          { title: { $regex: searchTerm, $options: "i" } },
          { description: { $regex: searchTerm, $options: "i" } },
          { location: { $regex: searchTerm, $options: "i" } },
        ],
      }
    : {};

  const [properties, totalCount] = await Promise.all([
    Property.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("ownerId", "-password"),

    Property.countDocuments(searchFilter),
  ]);

  const totalPages = Math.ceil(totalCount / limit);

  return { properties, totalPages };
}


  async propertiesWithSameType(id:string,type:string):Promise<IProperty[] |[]>{
    return await Property.find({ownerId:id,type:type})
  }
  async updateRatingAndReviewCount(
    propertyId: string,
    averageRating: number,
    totalReviews: number
  ): Promise<IProperty | null> {
    return await Property.findByIdAndUpdate(
      propertyId,
      {
        averageRating,
        totalReviews,
      },
      { new: true } 
    );
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
  let min = 0;
  let max = Number.MAX_SAFE_INTEGER;

  if (typeof filters.priceRange === 'string') {
    const parts = filters.priceRange.split(',').map(Number);
    if (parts.length === 2) {
      min = parts[0];
      max = parts[1];
    }
  } else if (Array.isArray(filters.priceRange)) {
    if (filters.priceRange.length === 2) {
      min = Number(filters.priceRange[0]);
      max = Number(filters.priceRange[1]);
    }
  }

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
  if (filters.features && Array.isArray(filters.features) && filters.features.length > 0) {
    query.features = { $all: filters.features };
  }
    return query;
  }
    async approveProperty (propertyId: string) {
        return await Property.findByIdAndUpdate(propertyId, { status: 'active' });
      };
      async blockUnblockProperty (propertyId: string, status: string) {
        return await Property.findByIdAndUpdate(propertyId, { status });
       };
       
       async deleteProperty (propertyId: string) {
         return await Property.findByIdAndDelete(propertyId);
       };
    
  
  
}
export default propertyRepository;
